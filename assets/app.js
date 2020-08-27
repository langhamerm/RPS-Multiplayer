
// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCjGF-g7ICBv0xIskxOznTRiwMoWB0mNts",
    authDomain: "clicky-b94cf.firebaseapp.com",
    databaseURL: "https://clicky-b94cf.firebaseio.com",
    projectId: "clicky-b94cf",
    storageBucket: "clicky-b94cf.appspot.com",
    messagingSenderId: "675320129914",
    appId: "1:675320129914:web:255af6d2525a28bb220ec3",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  

//Variables
var database = firebase.database();
var PlayerName = '';
var user_1_Name = "";
var user_2_Name = "";
var user_1_Choice = "";
var user_2_Choice = "";
var newMessage = "";
var player_1_win = 0;
var player_1_lose = 0;
var player_2_win = 0;
var player_2_lose = 0;
var turns = 1;
var delayTimer;
var delayTimer2;
var IsGameResetting = false;


$(document).ready(function () {

    //Score Check
    var CheckWinners = {
        //Restart Game
        resetGame: function () {
            IsGameResetting = false;
            turns = 1;
            //update the turn in the firebase to 1
            database.ref().update({
                turn: turns
            });
        },
        //Clear TO and Reset
        clearDelay: function () {
            clearTimeout(delayTimer);
            CheckWinners.resetGame();
        },
        //Winner Message Player 1
        updateWinner1: function () {
            $("#winner").html(user_1_Name + " wins!!");
        },
        //Winner Message Player 2
        updateWinner2: function () {
            $("#winner").html(user_2_Name + " wins!!");
        },
        //Score Update to Database
        updateScore: function () {
            database.ref("players/1").update({
                win: player_1_win,
                lose: player_1_lose,
            });
            database.ref("players/2").update({
                win: player_2_win,
                lose: player_2_lose,
            });
        },
        //update the local vairable of player scores then call the winner message update and call the score update in the database
        playerSocre: function () {
            // If Player 1 picks rock and Player 2 picks scissors then Player 1 wins.
            if (user_1_Choice == "rock" && user_2_Choice == "scissors") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.updateWinner1();
                CheckWinners.updateScore();
            }
            // If Player 1 picks rock and Player 2 picks paper then Player 1 loses.
            if (user_1_Choice == "rock" && user_2_Choice == "paper") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.updateWinner2();
                CheckWinners.updateScore();
            }
            // If Player 1 picks scissors and Player 2 picks rock then Player 1 loses.
            if (user_1_Choice == "scissors" && user_2_Choice == "rock") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.updateWinner2();
                CheckWinners.updateScore();
            }
            // If Player 1 picks scissor and Player 2 picks paper then Player 1 wins.
            if (user_1_Choice == "scissors" && user_2_Choice == "paper") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.updateWinner1();
                CheckWinners.updateScore();
            }
            // If Player 1 picks paper and Player 2 picks rock then Player 1 wins.
            if (user_1_Choice == "paper" && user_2_Choice == "rock") {
                player_1_win++;
                player_2_lose++;
                CheckWinners.updateWinner1();
                CheckWinners.updateScore();
            }
            // If Player 1 picks paper and Player 2 picks scissor then Player 1 loses.				
            if (user_1_Choice == "paper" && user_2_Choice == "scissors") {
                player_1_lose++;
                player_2_win++;
                CheckWinners.updateWinner2();
                CheckWinners.updateScore();
            }
            // If Player 1 and Player 2 pick the same then tie game.
            if (user_1_Choice == user_2_Choice) {
                $("#winner").html("It's a tie!");
            }

        }
    }


    //Initial Screen
    $("#greetings").html("<h2>Enter Your Name to Play</h2>"
        + "</br><input type='text' id='name-input'>" +
        "</br></br><input type='submit' id='submit-name'>");
    $("#waiting1").html("Waiting for player 1");
    $("#waiting2").html("Waiting for player 2");

    //Hide until players exist
    function hidden() {
        $("#player1choices").attr("style", "visibility:hidden");
        $("#player2choices").attr("style", "visibility:hidden");
        $("#group2message").attr("style", "visibility:hidden");
        $("#group1message").attr("style", "visibility:hidden");
    }
    hidden();

    //this will run after every database change
    database.ref().on("value", function (snapshot) {

        function playerDisconnect() {
            if (PlayerName != "") {
                //if this is Player 1's browser
                if ((snapshot.child("players").child(1).exists()) && (PlayerName == snapshot.child("players").child(1).val().name)) {
                    //update the message to the database
                    database.ref("/chat").onDisconnect().update({
                        message: ((snapshot.child("players").child(1).val().name) + " has been DISCONNECTED!!"),
                        dateAdded: firebase.database.ServerValue.TIMESTAMP
                    });
                    //delete the player 1 database
                    database.ref("players/1").onDisconnect().remove();
                    //if this is Player 2's browser
                } else if ((snapshot.child("players").child(2).exists()) && (PlayerName == snapshot.child("players").child(2).val().name)) {
                    //update the message to the database	
                    database.ref("/chat").onDisconnect().update({
                        message: ((snapshot.child("players").child(2).val().name) + " has been DISCONNECTED!!"),
                        dateAdded: firebase.database.ServerValue.TIMESTAMP
                    });//database	
                    //delete the player 1 database
                    database.ref("players/2").onDisconnect().remove();
                    //delete the turn database				
                    database.ref("/turn").onDisconnect().remove();
                }
            }
        }

        //If Player 1 doesn't exist clear its database
        if (((snapshot.child("players").child(1).exists()) == false)) {
            $("#waiting1").html("Waiting for player 1");
            $("#winner").empty();
            $("#win1").empty();
            $("#lose1").empty();
            $("#player1-name").empty();
            $("#whose-turn").empty();
            $("#player-1").attr("style", "border: 5px solid white");
            $("#player-2").attr("style", "border: 5px solid white");

        };
        //If Player 2 doesn't exist clear its database
        if (((snapshot.child("players").child(2).exists()) == false)) {
            $("#waiting2").html("Waiting for player 2");
            $("#winner").empty();
            $("#win2").empty();
            $("#lose2").empty();
            $("#player2-name").empty();
            $("#whose-turn").empty();
            $("#player-1").attr("style", "border: 5px solid white");
            $("#player-2").attr("style", "border: 5px solid white");
        };
        //If Player 2 exists but not 1, show Player 2 name
        if ((snapshot.child("players").child(2).exists()) && ((snapshot.child("players").child(1).exists()) === false)) {
            $("#player2-name").html(snapshot.child("players").child(2).val().name);
            $("#waiting2").empty();
            $("#player-1").attr("style", "border: 5px solid white");
            $("#player-2").attr("style", "border: 5px solid white");
            hidden();
            //when any player disconnect from the game
            playerDisconnect();
        };
        //If Player 1 exists but not 2, show Player 1 name
        if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
            $("#waiting1").empty();
            $("#player1-name").html(snapshot.child("players").child(1).val().name);
            hidden();
            //when any player disconnect from the game
            playerDisconnect();
            if (PlayerName == snapshot.child("players").child(1).val().name) {
                $("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name + ".  You are player 1!</h2>");
                $("#win1").html("WIN: " + player_1_win);
                $("#lose1").html("LOSE: " + player_1_lose);
            }
            //If both players exists, then game is ready.
        } else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()))) {
            //Keeping track of turn for the database
            var databaseTurn = snapshot.child("turn").val();
            user_1_Name = snapshot.child("players").child(1).val().name;
            user_2_Name = snapshot.child("players").child(2).val().name;
            //Both browers will show...
            $("#waiting2").empty();
            $("#waiting1").empty();
            $("#player2-name").html(snapshot.child("players").child(2).val().name);
            $("#player1-name").html(snapshot.child("players").child(1).val().name);
            $("#win2").html("WIN: " + snapshot.child("players").child(2).val().win);
            $("#lose2").html("LOSE: " + snapshot.child("players").child(2).val().lose);
            $("#win1").html("WIN: " + snapshot.child("players").child(1).val().win);
            $("#lose1").html("LOSE: " + snapshot.child("players").child(1).val().lose);
            //when any player disconnect from the game
            playerDisconnect();

            //Player 1's browser at their turn
            if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 1)) {
                $("#greetings").html("<h2>Hello " + snapshot.child("players").child(1).val().name + ".  You are player 1!</h2>");
                $("#player-1").attr("style", "border: 5px solid yellow");
                $("#player-2").attr("style", "border: 5px solid white");
                hidden();
                $("#player1choices").attr("style", "visibility:visible");
                $("#winner").empty();
                $("#whose-turn").html("It's your turn!");
            }
            //Player 1's browser at Player 2's turn
            if ((PlayerName == snapshot.child("players").child(1).val().name) && (databaseTurn == 2)) {
                $("#player-1").attr("style", "border: 5px solid white");
                $("#player-2").attr("style", "border: 5px solid yellow");
                hidden();
                $("#group1message").attr("style", "visibility:visible");;
                $("#whose-turn").html("Waiting for " + user_2_Name + " to choose...");
            }

            //Player 2's browser at Player 1's turn
            if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 1)) {
                $("#greetings").html("<h2>Hello " + snapshot.child("players").child(2).val().name + ".  You are player 2!</h2>");
                $("#player-1").attr("style", "border: 5px solid yellow");
                $("#player-2").attr("style", "border: 5px solid white");
                $("#whose-turn").html("Wating for " + user_1_Name + " to choose!!");
                hidden();
                $("#winner").empty();
            }
            //Player 2's browser at their turn
            if ((PlayerName == snapshot.child("players").child(2).val().name) && (databaseTurn == 2)) {
                $("#player-1").attr("style", "border: 5px solid white");
                $("#player-2").attr("style", "border: 2px solid yellow");
                $("#whose-turn").html("It is your turn!");
                hidden();
                $("#player2choices").attr("style", "visibility:visible");
            }
            //Both player's browser at turn 3
            if (databaseTurn == 3 && IsGameResetting == false) {
                IsGameResetting = true;
                //Restating variables to match the database
                user_1_Choice = snapshot.child("players").child(1).val().choice;
                user_2_Choice = snapshot.child("players").child(2).val().choice;
                player_1_win = snapshot.child("players").child(1).val().win;
                player_1_lose = snapshot.child("players").child(1).val().lose;
                player_2_win = snapshot.child("players").child(2).val().win;
                player_2_lose = snapshot.child("players").child(2).val().lose;
                $("#player-1").attr("style", "border: 5px solid white");
                $("#player-2").attr("style", "border: 5px solid white");
                $("#player2choices").attr("style", "visibility:hidden");
                $("#player1choices").attr("style", "visibility:hidden");
                $("#group2message").attr("style", "visibility:visible");
                $("#group1message").attr("style", "visibility:visible");
                $("#whose-turn").empty();
                //Check for winner
                CheckWinners.playerSocre();
                // Display this page for 5 seconds and call clearDelay function to reset the game
                delayTimer = setTimeout(CheckWinners.clearDelay, 5 * 1000);
            }
        }
    });
    //Players entering the game
    $("#submit-name").on("click", function () {
        //Grab Player name input 
        var username = $("#name-input").val().trim();
        //Change html to Player name
        PlayerName = username;
        console.log(username);

        // Read snapshot when Player adds name
        database.ref().once('value').then(function (snapshot) {
            //if Player 1 doesn't exist
            if ((snapshot.child("players").child(1).exists()) === false) {
                database.ref("players/1").set({
                    name: username,
                    win: player_1_win,
                    lose: player_1_lose
                });
                //if Player 2 doesn't exist
            } else if ((snapshot.child("players").child(1).exists()) && ((snapshot.child("players").child(2).exists()) === false)) {
                database.ref("players/2").set({
                    name: username,
                    win: player_2_win,
                    lose: player_2_lose
                });
                database.ref().update({
                    turn: turns,
                });
                //If both players exist
            } else if ((snapshot.child("players").child(1).exists()) && (snapshot.child("players").child(2).exists())) {
                alert("There are two players playing! Try again later!");
            }
        });
    });

    //if Player 1 makes a choice 
    $(".choice1").on("click", function () {
        //Grabs player choice
        user_1_Choice = $(this).val();
        console.log(user_1_Choice);

        database.ref().once('value').then(function (snapshot) {
            //Turn Switch	
            turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
            turns++;
            if ((PlayerName == snapshot.child("players").child(1).val().name)) {
                database.ref("players/1").update({
                    choice: user_1_Choice,
                });
                database.ref().update({
                    turn: turns
                });
            }
        });
    });

    //if Player 2 makes a choice 
    $(".choice2").on("click", function () {
        //Grabs player choice
        user_2_Choice = $(this).val();
        console.log(user_2_Choice);

        database.ref().once('value').then(function (snapshot) {
            //Turn Switch		
            turns = (snapshot.child("turn").exists() ? snapshot.child("turn").val() : turns);
            turns++;
            if ((PlayerName == snapshot.child("players").child(2).val().name)) {
                database.ref("players/2").update({
                    choice: user_2_Choice,
                });
                database.ref().update({
                    turn: turns,
                });
            }
        });
    });

    //if the Player sends a message
    $("#submit-chat").on("click", function (event) {
        //prevent refresh
        event.preventDefault();
        console.log(this);
        //Grabs input and empties
        var messages = $("#chat-input").val().trim();
        $("#chat-input").val("");

        //newMessage value change
        newMessage = PlayerName + " : " + messages;

        //Update chats in database
        database.ref("/chat").update({
            message: newMessage,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });
    });

    //Update browser chat window
    database.ref("/chat").orderByChild("dateAdded").limitToLast(1).on("value", function (snapshot) {
        $("#chat-window").append("</br>" + snapshot.val().message + "</br>");
    });

});