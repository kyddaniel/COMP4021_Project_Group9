const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            socket.emit("get messages");
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersPanel.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersPanel.addUser(user);
        });

        // Set up the remove user event
        socket.on("remove user", (user) => {
            user = JSON.parse(user);

            // Remove the online user
            OnlineUsersPanel.removeUser(user);
        });

        // Set up the messages event
        socket.on("messages", (chatroom) => {
            chatroom = JSON.parse(chatroom);

            // Show the chatroom messages
            //ChatPanel.update(chatroom);
        });

        // Set up the add message event
        socket.on("add message", (message) => {
            
            message = JSON.parse(message);
            // Add the message to the chatroom
            ChatPanel.addMessage(message);
        });

        // Set up typing event for ChatPanel
        socket.on("typing", (msg) => {
            ChatPanel.typing(JSON.parse(msg));
        });


        // Set up invite event for UI
        socket.on("invite", (info) => {
            //ChatPanel.typing(JSON.parse(player));
            let message = JSON.parse(info);
            let inviter = message.inviterName;
            let player = message.playerName;
            console.log("Inviter: ", inviter);
            console.log("Player invited: ", player);
            
            UI.invite(inviter, player);
        });

        socket.on("decline", (info) => {
            let message = JSON.parse(info);
            UI.decline(message.inviter, message.player);
        })


        // Set up starting game
        socket.on("start main game", (info) => {
            //ChatPanel.typing(JSON.parse(player));
            let message = JSON.parse(info);
            let inviter = message.inviterName;
            let player = message.playerName;
                        
            UI.perpareGameScreen(inviter, player);
        });


    };

    // Handle key down event called from ChatPanel
    const anyKeyDown = function() {
        socket.emit("key down");
    };


    // Handle invite event
    const callInvite = function(inviter, player_name) {
        socket.emit("call invite", inviter, player_name);
    };

    const declineInvite = function(inviter, player_name){
        socket.emit("di", inviter, player_name);
        console.log("decline emitted");
    }

    // Handle start game event
    const callStartGame = function(inviter, player) {
        socket.emit("call start game", inviter, player);
    };




    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // This function sends a post message event to the server
    const postMessage = function(content) {
        if (socket && socket.connected) {
            socket.emit("post message", content);
        }
    };

    return { 
        getSocket, connect, disconnect, postMessage, anyKeyDown, 
        callInvite, declineInvite, callStartGame };
})();
