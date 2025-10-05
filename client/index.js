
import * as Data from "./data.js"
import * as Destinations from "./destinations.js"

var socket = undefined

export var currentScreen = Data.WELCOME_SCREEN

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function setCurrentScreen(screen) {
    currentScreen = screen;
}

document.getElementById("playButton").addEventListener("click", async ()=>{
    Destinations.goToGameQueueScreen()
    await connectToServer()
})
function sendMsgToServer(msg){
    let data = JSON.stringify(msg)
    socket.send(data)
}
async function connectToServer(){
    
    
    await sleep(1000) // cool feeling
    socket = new WebSocket("ws://localhost:8080");
    
    socket.addEventListener("open", () => {
        console.log("Connected");
        
    });
    
    // Listen for messages
    socket.addEventListener("message", (event) => {
        handleMsg(event.data)
    });
}


function displayStatusReadyButton(){
    document.getElementById("readyButton").style.display = "flex"
    document.getElementById("readyButton").addEventListener("click",()=>{
        sendMsgToServer(Data.STATUS_MSG(true))
    })
}



function handleMsg(msg){
    let data = JSON.parse(msg)
    if (data["MSG_TYPE"] == Data.DISCONNECT_MSG_TYPE){
        console.log("Server disconnected")
        Destinations.goToWelcomeScreen()
        return
    }
    
    if (currentScreen == Data.GAME_QUEUE_SCREEN){
        gameQueueScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_READY_SCREEN){
        gameReadyScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_CHAT_SCREEN){
        gameChatScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_SCREEN){
        gameScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_SUMMARY_SCREEN){
        gameSummaryMsgHandler(data)
    }
}

function gameQueueScreenMsgHandler(data){
    let msgType = data["MSG_TYPE"]

    if (msgType == Data.CONNECTION_MSG_TYPE){
        console.log("Connection established with server")
        Destinations.switchToLobbyWaiter()
    }
    if (msgType == Data.GAME_ASSIGNED_MSG_TYPE){
        console.log("Assigned game lobby!")
        Destinations.goToGameReadyScreen()
        console.log("Switched to game ready screen " + currentScreen)

    }
}
function gameReadyScreenMsgHandler(data){
    let msgType = data["MSG_TYPE"]
    if (msgType == Data.REQUEST_STATUS_MSG_TYPE){
        console.log("Requested msg status")
        displayStatusReadyButton()
    }
    if (msgType == Data.START_CHATTING_PHASE_MSG_TYPE){
        Destinations.goToGameChatScreen()
    }
}
function gameChatScreenMsgHandler(data){
    let msgType = data["MSG_TYPE"];
    if (msgType == Data.END_CHATTING_PHASE_MSG_TYPE){
        Destinations.goToGameScreen()
    }
}
function gameScreenMsgHandler(data){
    let msgType = data["MSG_TYPE"];
    if (msgType == Data.ENDING_GAME_ROUNDS_MSG_TYPE){
        Destinations.goToGameSummaryScreen()
    }

}
function gameSummaryMsgHandler(data){

    let msgType = data["MSG_TYPE"];
    if (msgType == Data.GAME_SUMMARY_MSG_TYPE){
        console.log("Game summary received");

    }
}



