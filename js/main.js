/* start the external action and say hello at the console */
console.log("App is alive");

let channels = [];
let messages = [];

/** create global variable for the currently selected channel */
let selectedChannel;

// Functions to execute when DOM has loaded
function init(){

    // to be displayed on the console, to be sure that the JS code is running
    console.log("App is initialized")
    
    // get existing channels from mock file or database
    channels = mockChannels;

    // get existing messages from mock file or database
    messages = mockMessages;
    
    // load the messages from messages.js into the channels
    loadMessagesIntoChannel();

    // display the channels
    displayChannels();
}

//---------------- Channels-----------------------------------

// load existing messages into respective channel
function loadMessagesIntoChannel() {
    channels.forEach(channel=>{
        messages.forEach(message=>{
            if(message.channel==channel.id){
                channel.messages.push(message);
            }
        })
    })
}

// display channels in channel area 
function displayChannels() {
    var regularElement = document.getElementById('regular-channels');
    channels.forEach(channel=>{
        regularElement.innerHTML=regularElement.innerHTML+ `<li id="${channel.id}" onclick=switchChannel("${channel.id}")> <div> ${channel.name} </div> <div> ${channel.latestMessage}</div> </li> `
    })
}

// changes header name and favorite button
function showHeader() {
    document.querySelector("# -area-header h1").innerHTML = `${selectedChannel.name}`;
}

//Switches channel 
function switchChannel(selectedChannelID) {
    console.log("selected channel with id: " + selectedChannelID);
    if (!!selectedChannel) {
        document.getElementById(selectedChannel.id).classList.remove("selected");
    }
    document.getElementById(selectedChannelID).classList.add("selected")
    channels.forEach(channel => {
        if (channel.id === selectedChannelID) {
            selectedChannel = channel;
        }
    })

    // Once a user click on any channel display the chat input
    if (!!document.getElementById("select-channel")) {
        document.getElementById("select-channel").style.display = "none";
        document.getElementById("input-area").style.display = "flex";
        document.getElementById("message-area-header").style.display = "flex";
    }
    showHeader();
    showMessages();
}


//---------------- Messages-----------------------------------

//Create a Message as an object
function Message(user, own, text, channelID) {
    
    this.createdBy = user; //username
    this.createdOn = new Date(Date.now()); // get the actual time
    this.own = own; 
    this.text = text; // get the text
    this.channel = channelID; // get the channel ID
}

//Add an EventListener for the HTML element "send-button" once it's clicked call the Java Script method: "sendMessage"
document.getElementById('send-button').addEventListener('click', sendMessage);

// Check if input is provided, send message, and clear input. Return if not.
function sendMessage() {
    const text = document.getElementById('message-input').value;
    
    // run the code only if the user has entred an message 
    if (!!text) {
        const myUserName = "Basti";
        const own = true;
        const channelID = selectedChannel.id;
        const message = new Message(myUserName, own, text, channelID)
        console.log("New message: ", message);
        selectedChannel.messages.push(message);
        document.getElementById('message-input').value = '';
        showMessages();
        displayChannels();
    } else {
        return // in cas the user hasen't entered any message and clicked on send
    }
}

// Show the messages of the selected channel
function showMessages() {
    const chatArea = document.getElementById('chat-area');
    chatArea.innerHTML = ""
    selectedChannel.messages.forEach(message => {
        const messageTime = message.createdOn.toLocaleTimeString("de-DE", {
            hour: "numeric",
            minute: "numeric"
        });
        let currentMessageHtmlString;
        if (message.own) {
            currentMessageHtmlString = `<div class="message outgoing-message">
                                            <div class="message-wrapper">
                                                <div class="message-content">
                                                    <p>` + message.text + `</p>
                                                </div>
                                                <i class="material-icons">account_circle</i>
                                            </div>
                                            <span class="timestamp">` + messageTime + `</span>
                                        </div>`;
        } else {
            currentMessageHtmlString = `<div class="message incoming-message">
                                            <div class="message-wrapper">
                                                <i class="material-icons">account_circle</i>
                                                <div class="message-content">
                                                    <h3>` + message.createdBy + `</h3>
                                                    <p>` + message.text + `</p>
                                                </div>
                                            </div>
                                            <span class="timestamp">` + messageTime + `</span>
                                        </div>`;
        }
        chatArea.innerHTML += currentMessageHtmlString;
    })
}

