const Stats = (function(){

    const gameOver = function(p1, p1k, p1s, p2, p2k, p2s){
        //TODO: set players name
        $("#player1-name").html(p1)
        $("#player2-name").html(p2)

        //TODO: update stats
        $("#player1-kill").html(p1k)
        $("#player1-coin").html(p1s)
        $("#player1-score").html(p1k*10)

        $("#player2-kill").html(p2k)
        $("#player2-coin").html(p2s)
        $("#player2-score").html(p2k*10)

        if(p1k > p2k){
            $("#player1-rank").html("1st")
            $("#player2-rank").html("2nd")
        }else if (p2k > p1k){
            $("#player2-rank").html("1st")
            $("#player1-rank").html("2nd")
        }else{
            $("#player2-rank").html("1st")
            $("#player1-rank").html("1st")
        }


        //promoting code
        const words = [
            "Consider giving an A+ for us!", 
            "Gibson is the best!",
            "COMP4021 is fun!",
            "Zombies are not real!",
            "Plants won't hurt you!",
            "GGWP!",
            "Sunlight is great!",
            "Fire! Fire! Fire!"
        ]

        let index = Math.floor(Math.random()*8)
        $("#promotion").html(words[index])

        $("#return-to-title").on("click", () => {
            /*
            $("#game-screen").load("index.html");   
            $("#game-screen").hide()
            UI.initialize()
            SignInForm.hide();
            UserPanel.update(Authentication.getUser());
            UserPanel.show();

            Socket.connect();
            $("#container").show()*/
            location.reload()
        })
        


    }

    return { gameOver }

})();
