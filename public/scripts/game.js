const Game = (function(){

    let socket = null;

    const getSocket = function() {
        return socket;
    };

    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            
        });

        

    }

    

    return { getSocket, connect }

})();