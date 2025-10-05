
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

document.getElementById("playButton").addEventListener("click", async () => {
    Destinations.goToGameQueueScreen()
    await connectToServer()
})
document.getElementById("chatInput").addEventListener("keydown", (event) => {
    let element = event.target
    if (event.key.toLowerCase() === "enter") {
        
        sendMsgToServer(Data.CHAT_MSG(element.value))
        addChatMsg(false, element.value)
        element.value = ""
    }
})
function sendMsgToServer(msg) {
    let data = JSON.stringify(msg)
    socket.send(data)
}
async function connectToServer() {


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


function displayStatusReadyButton() {
    document.getElementById("readyButton").style.display = "flex"
    document.getElementById("readyButton").addEventListener("click", () => {
        sendMsgToServer(Data.STATUS_MSG(true))
        Destinations.switchToGameReadyWaiter()
    })
}

function addChatMsg(left, msg) {
    // <div class="chatMsgBox chatMsgBoxRight">
    //     <div class="chatMsg">Siemano stary co tam w cb</div>
    // </div>

    let msgBox = document.createElement("div")
    msgBox.classList.add("chatMsgBox")
    if (left) {
        msgBox.classList.add("chatMsgBoxLeft")
    }
    else {
        msgBox.classList.add("chatMsgBoxRight")
    }

    let msgElement = document.createElement("div")
    msgElement.classList.add("chatMsg")
    msgElement.textContent = msg

    msgBox.appendChild(msgElement)
    console.log("added child" + msgBox)
    document.getElementById("chatBox").appendChild(msgBox)
}



function handleMsg(msg) {
    let data = JSON.parse(msg)
    if (data["MSG_TYPE"] == Data.DISCONNECT_MSG_TYPE) {
        console.log("Server disconnected")
        location.reload()
        return
    }

    if (currentScreen == Data.GAME_QUEUE_SCREEN) {
        gameQueueScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_READY_SCREEN) {
        gameReadyScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_CHAT_SCREEN) {
        gameChatScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_SCREEN) {
        gameScreenMsgHandler(data)
    }
    else if (currentScreen == Data.GAME_SUMMARY_SCREEN) {
        gameSummaryMsgHandler(data)
    }
}

function gameQueueScreenMsgHandler(data) {
    let msgType = data["MSG_TYPE"]

    if (msgType == Data.CONNECTION_MSG_TYPE) {
        console.log("Connection established with server")
        Destinations.switchToLobbyWaiter()
    }
    if (msgType == Data.GAME_ASSIGNED_MSG_TYPE) {
        console.log("Assigned game lobby!")
        Destinations.goToGameReadyScreen()
        console.log("Switched to game ready screen " + currentScreen)

    }
}
function gameReadyScreenMsgHandler(data) {
    let msgType = data["MSG_TYPE"]
    if (msgType == Data.REQUEST_STATUS_MSG_TYPE) {
        console.log("Requested msg status")
        displayStatusReadyButton()
    }
    if (msgType == Data.START_CHATTING_PHASE_MSG_TYPE) {
        Destinations.goToGameChatScreen()
    }
}
function gameChatScreenMsgHandler(data) {
    
    let msgType = data["MSG_TYPE"];
    if (msgType == Data.CHAT_MSG_TYPE) {
        console.log("received chat msg")
        addChatMsg(true, data["VALUE"])
    }
    if (msgType == Data.END_CHATTING_PHASE_MSG_TYPE) {
        Destinations.goToGameScreen()
    }
}
function gameScreenMsgHandler(data) {
    let msgType = data["MSG_TYPE"];
    if (msgType == Data.ENDING_GAME_ROUNDS_MSG_TYPE) {
        Destinations.goToGameSummaryScreen()
    }

}
function gameSummaryMsgHandler(data) {

    let msgType = data["MSG_TYPE"];
    if (msgType == Data.GAME_SUMMARY_MSG_TYPE) {
        console.log("Game summary received");

    }
}



