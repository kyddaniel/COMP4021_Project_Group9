const Stats = (function(){

    const gameOver = function(p1, p2){
        //TODO: set players name
        $("#player1-name").html(p1)
        $("#player2-name").html(p2)

        //TODO: update stats
        $("#player1-kill").html("40")
        $("#player1-coin").html("21")
        $("#player1-score").html("4021")

        $("#player2-kill").html("21")
        $("#player2-coin").html("40")
        $("#player2-score").html("2022")

        //TODO: rank handling

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

        //TODO: button onclick
        $("#play-again").on("click", () => {
            
        })

        $("#return-to-title").on("click", () => {
            
        })


    }

    return { gameOver }

})();