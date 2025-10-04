
import * as Data from "./data.js"

const socket = new WebSocket("ws://localhost:8080");

var currentScreen = Data.START_SCREEN

socket.addEventListener("open", () => {
    console.log("Connected");
});

// Listen for messages
socket.addEventListener("message", (event) => {
    handleMsg(event.data)
});

document.getElementById("chatInput").addEventListener("keydown", (event) =>{
    if (event.key.toLowerCase() == "enter"){
        socket.send(JSON.stringify(Data.CHAT_MSG(document.getElementById("chatInput").value)))
    }
})
document.getElementById("guesserTruthButton").addEventListener("click", (event) =>{
    socket.send(JSON.stringify(Data.GAME_QUESTION_VERIFY_REPLY(true)))
})
document.getElementById("guesserFalseButton").addEventListener("click", (event) =>{
    socket.send(JSON.stringify(Data.GAME_QUESTION_VERIFY_REPLY(false)))
})

document.getElementById("responderTruthButton").addEventListener("click", (event) =>{
    socket.send(JSON.stringify(Data.GAME_QUESTION_REPLY(true)))
})
document.getElementById("responderFalseButton").addEventListener("click", (event) =>{
    socket.send(JSON.stringify(Data.GAME_QUESTION_REPLY(false)))
})

function handleMsg(msg){
    let data = JSON.parse(msg)
    if (data["MSG_TYPE"] == Data.DISCONNECT_MSG_TYPE){
        console.log("Server disconnected")
        goToGameStartScreen()
    }
    if (currentScreen == Data.START_SCREEN){
        if (data["MSG_TYPE"] == Data.CONNECTION_MSG_TYPE){
            document.getElementById("connectingWaiter").style.backgroundColor = "green"
        }
        if (data["MSG_TYPE"] == Data.GAME_ASSIGNED_MSG_TYPE){
            document.getElementById("gameAssignementWaiter").style.backgroundColor = "green"
        }
        if (data["MSG_TYPE"] == Data.REQUEST_STATUS_MSG_TYPE){
            socket.send(JSON.stringify(Data.STATUS_MSG(true)))
            
        }
        if (data["MSG_TYPE"] == Data.START_CHATTING_PHASE_MSG_TYPE){
            goToGameChatScreen()
        }
    }
    else if (currentScreen == Data.CHAT_BOX_SCREEN){
        if (data["MSG_TYPE"] == Data.CHAT_MSG_TYPE){
            document.getElementById("messagesFromPlayer2").textContent += data["VALUE"]
        }
        if (data["MSG_TYPE"] == Data.END_CHATTING_PHASE_MSG_TYPE){
            goToGameScreen()
        }
    }
    else if (currentScreen == Data.GAME_BOX_SCREEN){
        if (data["MSG_TYPE"] == Data.ROUND_START_MSG_TYPE){
            // idk
        }
        if (data["MSG_TYPE"] == Data.GAME_QUESTION_MSG_TYPE){
            document.getElementById("guesserBox").style.display = "none"
            document.getElementById("responderBox").style.display = "block"
            document.getElementById("responderQuestionBox").textContent = data["VALUE"]["QUESTION"] + "  " + data["VALUE"]["OPERATION"]
            
        }
        if (data["MSG_TYPE"] == Data.GAME_QUESTION_VERIFY_TYPE){
            document.getElementById("responderBox").style.display = "none"
            document.getElementById("guesserBox").style.display = "block"
            document.getElementById("guesserQuestionBox").textContent = data["VALUE"]["QUESTION"] + "  " + data["VALUE"]["OPERATION"]
        }
        if (data["MSG_TYPE"] == Data.ROUND_END_MSG_TYPE){
            document.getElementById("responderQuestionBox").textContent = ""
            document.getElementById("guesserQuestionBox").textContent = ""
        }

    }
}

function goToGameStartScreen(){


    document.getElementById("gameWaiter").style.display = "none"
    document.getElementById("chatBox").style.display = "none"
    document.getElementById("gameBox").style.display = "none"

    currentScreen = Data.START_SCREEN
}
function goToGameWaiterScreen(){
    document.getElementById("gameWaiter").style.display = "block"
    

    document.getElementById("chatBox").style.display = "none"
    document.getElementById("gameBox").style.display = "none"
    currentScreen = Data.GAME_WAITER_SCREEN
}
function goToGameChatScreen(){
    document.getElementById("chatBox").style.display = "block"
    

    document.getElementById("gameWaiter").style.display = "none"
    document.getElementById("gameBox").style.display = "none"

    currentScreen = Data.CHAT_BOX_SCREEN
}
function goToGameScreen(){
    document.getElementById("gameBox").style.display = "block"
    

    document.getElementById("gameWaiter").style.display = "none"
    document.getElementById("chatBox").style.display = "none"

    currentScreen = Data.GAME_BOX_SCREEN
}




