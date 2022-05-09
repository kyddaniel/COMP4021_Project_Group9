const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Populate the avatar selection
        Avatar.populate($("#register-avatar"));
        
        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    UserPanel.update(Authentication.getUser());
                    UserPanel.show();

                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const avatar   = $("#register-avatar").val();
            const name     = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, avatar, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });

        
    };

    

    // This function shows the form
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide it
        $("#user-panel").hide();

        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();

                    hide();
                    SignInForm.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function(user) {
        $("#user-panel").show();
    };

    // This function hides the form
    const hide = function() {
        $("#user-panel").hide();
    };

    // This function updates the user panel
    const update = function(user) {
        if (user) {
            $("#user-panel .user-avatar").html(Avatar.getCode(user.avatar));
            $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#user-panel .user-avatar").html("");
            $("#user-panel .user-name").text("");
        }
    };

    return { initialize, show, hide, update };
})();

const OnlineUsersPanel = (function() {
    // This function initializes the UI
    const initialize = function() {};

    // This function updates the online users panel
    const update = function(onlineUsers) {
        const onlineUsersArea = $("#online-users-area");

        // Clear the online users area
        onlineUsersArea.empty();

		// Get the current user
        const currentUser = Authentication.getUser();

        // Add the user one-by-one
        for (const username in onlineUsers) {
            if (username != currentUser.username) {
                onlineUsersArea.append(
                    $("<div id='username-" + username + "'></div>")
                        .bind({
                            click: function() {
                               Socket.callInvite(currentUser.username, username);
                            }
                        })
                        .append(UI.getUserDisplay(onlineUsers[username]))
                );
            }
        }
    };

    // This function adds a user in the panel
	const addUser = function(user) {
        const onlineUsersArea = $("#online-users-area");
		
		// Find the user
		const userDiv = onlineUsersArea.find("#username-" + user.username);
		
        // Get the current user
        const currentUser = Authentication.getUser();

		// Add the user
		if (userDiv.length == 0) {
			onlineUsersArea.append(
				$("<div id='username-" + user.username + "'></div>")
                    .bind({
                        click: function() {
                            // let message = "You sent an invitation to " + user.username + "!";
                            // $("#invitation").html(message);
                            Socket.callInvite(currentUser.username, user.username);
                        }
                    })
                    .append(UI.getUserDisplay(user))
			);
		}
	};

    // This function removes a user from the panel
	const removeUser = function(user) {
        const onlineUsersArea = $("#online-users-area");
		
		// Find the user
		const userDiv = onlineUsersArea.find("#username-" + user.username);
		
		// Remove the user
		if (userDiv.length > 0) userDiv.remove();
	};

    const clearMessage = function(){
        //$("#invitation").html("");
    }

    return { initialize, update, addUser, removeUser, clearMessage };
})();

const ChatPanel = (function() {
	// This stores the chat area
    let chatArea = null;

    // This function initializes the UI
    const initialize = function() {
		// Set up the chat area
		chatArea = $("#chat-area");

        // Submit event for the input form
        $("#chat-input-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the message content
            const content = $("#chat-input").val().trim();

            // Post it
            Socket.postMessage(content);

			// Clear the message
            $("#chat-input").val("");
        });

        // Handle key down event
        $("#chat-input-form").on("keydown", function() {
            // call key down event
            Socket.anyKeyDown();
        });
        
 	};

    // Create new message when user is typing
    const typing = function(msg) {
        
        const currentUser = Authentication.getUser();
        if(msg != currentUser.username) {
            // clear previous Timeout
            if(timeout) clearTimeout(timeout);

            // set new Timeout
            timeout = setTimeout(cancel, 3000);

            let typing_message =  msg + " is typing...";
            $("#typing-notice").text(typing_message);
        }

    }

    function cancel() {
        $("#typing-notice").text("");
    }

    // This function updates the chatroom area
    const update = function(chatroom) {
        // Clear the online users area
        chatArea.empty();

        // Add the chat message one-by-one
        for (const message of chatroom) {
			addMessage(message);
        }
    };

    // This function adds a new message at the end of the chatroom
    const addMessage = function(message) {
		const datetime = new Date(message.datetime);
		const datetimeString = datetime.toLocaleDateString() + " " +
							   datetime.toLocaleTimeString();

		chatArea.append(
			$("<div class='chat-message-panel row'></div>")
				.append(UI.getUserDisplay(message.user))
				.append($("<div class='chat-message col'></div>")
					.append($("<div class='chat-date'>" + datetimeString + "</div>"))
					.append($("<div class='chat-content'>" + message.content + "</div>"))
				)
		);
		chatArea.scrollTop(chatArea[0].scrollHeight);
    };

    return { initialize, update, addMessage, typing };
})();

const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, UserPanel, OnlineUsersPanel, ChatPanel];

    // This function initializes the UI
    const initialize = function() {
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };


    //Handling the invite function
    const invite = function(inviter, player) {
        const currentUser = Authentication.getUser();
        let message = inviter + " wants to play with you!";
        if(player == currentUser.username) {
            
            $("#invitation").html(message);
            $("#invitation-buttons").css("visibility", "visible");
            
            $("#accept-button").on("click", () => {
                console.log("Player accept!");
                    
                    if(player == currentUser.username || inviter == currentUser.username) {
                        $("#container").hide();
                    }
                    
                    Socket.callStartGame(inviter, player);
            });

            $("#decline-button").on("click", () => {
                console.log("Player refuse!");
                message = "You declined the invite!";
                $("#invitation").html(message);
                $("#invitation-buttons").css("visibility", "hidden");
                Socket.declineInvite(inviter, player);
                setTimeout(OnlineUsersPanel.clearMessage, 3000);
                

            });

            // if (confirm(message) == true) {
            //         console.log("Player accept!");
                    
            //         if(player == currentUser.username || inviter == currentUser.username) {
            //             $("#container").hide();
            //         }
                    
            //         Socket.callStartGame(inviter, player);
            //     }
            //     else {
            //         console.log("Player refuse!");
            //     }
        }
    };

    const decline = function(inviter, player){
        const currentUser = Authentication.getUser().username;
        if(currentUser == inviter){
            console.log(currentUser, inviter);
            let msg = player + " declined your invitation TAT";
            $("#invitation").html(msg);
            setTimeout(OnlineUsersPanel.clearMessage,3000);
        }
    }

    // This function prepare the game screen
    const perpareGameScreen = function(inviter, player) {
        const currentUser = Authentication.getUser();
        if(player == currentUser.username || inviter == currentUser.username) {
            $("#container").hide();

            $("#game-screen").show();
            $("#game-screen").load("plants_vs_zombies.html");
        }
    };

    return { getUserDisplay, initialize, invite, decline, perpareGameScreen };
})();