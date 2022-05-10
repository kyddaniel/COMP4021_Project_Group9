const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;
    
    // D. Reading the users.json file
    const jsonData = fs.readFileSync("data/users.json");
    const users = JSON.parse(jsonData);

    // E. Checking for the user data correctness
    
    // E-1 check empty
    if(!username || !avatar || !name || !password){
        res.json({status: "error",
                  error: "Username/Avatar/Name/Password cannot be empty"});
        return;
    }
    // E-2 check only underscores, letters or numbers
    if(!containWordCharsOnly(username) || !containWordCharsOnly(avatar) || !containWordCharsOnly(name) || !containWordCharsOnly(password)){
        res.json({status: "error",
                  error: "Username/Avatar/Name/Password should only contain underscores, letters or numbers"});
        return;
    }
    // E-3 check the username does not exist in the current list of users
    if(username in users){
        res.json({status: "error",
                  error: "username is used!"});
        return;
    }

    // G. Adding the new user account
    const hash = bcrypt.hashSync(password, 10);
    users[username] = { avatar, name, password:hash };

    // H. Saving the users.json file
    fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "));

    // I. Sending a success response to the browser
    res.json({ status: "success" });

    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    // D. Reading the users.json file
    const jsonData = fs.readFileSync("data/users.json");
    const users = JSON.parse(jsonData);

    // E. Checking for username/password
    if(!username || !password){
        res.json({status: "error",
                  error: "Username/Password cannot be empty"});
        return;
    }
    
    if(username in users){
        
        if (!bcrypt.compareSync(password, users[username].password)) {
            res.json({ ststus: "error",
                       error: "Incorrect username/password!"});
            return;
        }

    }

    const user_avatar = users[username].avatar;
    const user_name = users[username].name;
    const session_user = { username, avatar: user_avatar, name: user_name };
    req.session.user = session_user;

    // G. Sending a success response with the user account
    
    //res.json({ status: "success", user: { username, avatar: user_avatar, name: user_name }});
    res.json({ status: "success", user: session_user});

 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {

    // B. Getting req.session.user
    const session_user = req.session.user;

    // D. Sending a success response with the user account
    if(!session_user) {
        res.json({ ststus: "error",
                   error: "You have not signed in!"});
        return;
    }

    res.json({ status: "success", user: session_user});

 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {

    // Deleting req.session.user
    if(req.session.user) {
        delete req.session.user;
    }

    // Sending a success response
    res.json({ status: "success"});
 
    // Delete when appropriate
    //res.json({ status: "error", error: "This endpoint is not yet implemented." });
});


//
// ***** Please insert your Lab 6 code here *****
//

// Create the Socket.IO server
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);

// Use the session in the Socket.IO server
io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});

// A JavaScript object storing the online users
const onlineUsers = {};
let gameReady = 0;
let gameUsers = []
let player1, player2
let player1_kills, player2_kills

io.on("connection", (socket) => {

    // Add a new user to the online user list
    if(socket.request.session.user) {
        const { username, avatar, name } = socket.request.session.user;
        onlineUsers[username] = { avatar, name };
        //console.log(onlineUsers);

        // broadcast the signed in users
        io.emit("add user", JSON.stringify(socket.request.session.user));
    }

    // Revomve the user from the online user llist
    socket.on("disconnect", () => {
        if(socket.request.session.user) {
            const { username } = socket.request.session.user;
            if(onlineUsers[username]) delete onlineUsers[username];
            //console.log(onlineUsers);

            // broadcast the signed out user
            io.emit("remove user", JSON.stringify(socket.request.session.user));
        }
    })

    // Set up the get users event
    socket.on("get users", () => {
        // send the online users to the browser
        socket.emit("users", JSON.stringify(onlineUsers));
    })

    // Set up the get messages event
    socket.on("get messages", () => {
        // send the messages to the browser
        const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json", "utf-8"));
        socket.emit("messages", JSON.stringify(chatroom));
    })

    // Set up the post message event
    socket.on("post message", (content) => {
        if(socket.request.session.user) {
            // create the message object
            const message = content;

            // read the chat room messages
            const chatroom = JSON.parse(fs.readFileSync("data/chatroom.json", "utf-8"));

            // add the messages to the chatroom
            const user = socket.request.session.user;
            const time = new Date();
            const chatroom_message = { user: { username:user.username, avatar:user.avatar, name:user.name },
                                       datetime: time,
                                       content: message }

            // write the chatroom messages
            chatroom.push(chatroom_message);
            fs.writeFileSync("data/chatroom.json", JSON.stringify(chatroom, null, " "));

            // broadcast the new messages
            //socket.emit("messages", JSON.stringify(chatroom));
            io.emit("add message", JSON.stringify(chatroom_message));
        }
    })

    // Handle key down event
    socket.on("key down", () => {
        // broadcast the typing's user name
        if(socket.request.session.user) {
            io.emit("typing", JSON.stringify(socket.request.session.user.username));
        }
            
    })


    // Handle invite event
    socket.on("call invite", (inviter, player_name) => {
        // broadcast the invitation to target player
        if(socket.request.session.user) {
            let info = {inviterName: inviter, playerName:player_name};
            io.emit("invite", JSON.stringify(info));
        }
            
    })

    socket.on("di", (inviter, player_name) => {
        if(socket.request.session.user){
            let info = {inviter: inviter, player:player_name};
            io.emit("decline", JSON.stringify(info));
            console.log("decline emitted");
        }
    })

    // Handle start game event
    socket.on("call start game", (inviter, player) => {
        // broadcast the starting event to both players
        if(socket.request.session.user) {
            let info = {inviterName: inviter, playerName:player};
            io.emit("start main game", JSON.stringify(info));
        }
            
    })

    socket.on("press start", (user) => {
        let exist = false
        for (var i=0; i < gameReady; i++){
            if (gameUsers[i] == user.username){
                exist = true
            }
        }
        if (!exist) {
            gameReady++
            gameUsers.push(user.username)
            if (gameReady == 2){
                gameReady = 0
                player1 = gameUsers[0]
                player2 = gameUsers[1]
                io.emit("game start", gameUsers[0], gameUsers[1])
                gameUsers = []
            }
        }
        
    })

    socket.on("call add plant", (info, user) => {
        let message = {info: info, playerName: user};
        io.emit("add plant", message)
    })

    socket.on("call collect sun", (info, player) => {
        let message = info;
        io.emit("collect sun", message, player)
    })

    socket.on("call remove plant", (info) => {
        let message = info;
        io.emit("remove plant", message)
    })

    socket.on("call update sun", (count, player) => {
        io.emit("update sun", count, player)
    })

    socket.on("call zombie", (index) => {
        io.emit("zombie", index)
    })

    socket.on("call game over", (p1, p1k, p2, p2k) => {
        // player1_kills = p1k
        // player2_kills = p2k
        player1_kills = 10
        player2_kills = 20
    })

    socket.on("request stat", () => {
        io.emit("stat", player1, player1_kills, player2, player2_kills)
    })

});

// Use a web server to listen at port 8000
//app.listen(8000, () => {
//    console.log("The chat server has started...");
//});
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});



