
import * as Data from "./data.js"
import * as Destinations from "./destinations.js"
import { WAITING_FOR } from "./utils.js"

var prizes = undefined

var socket = undefined
var gameEnded = false

var coins = 0

export var currentScreen = Data.WELCOME_SCREEN


const URL = "wss://scammygame-production.up.railway.app"

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
    socket = new WebSocket(URL);

    socket.addEventListener("open", () => {
        console.log("Connected");
        setInterval(()=>{
            sendMsgToServer(Data.PING_MSG)
        }, 500)

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

function generateAnswerButtonBox(who){
    // <div id="answerButtonsBox">
    //     <button class="questionAnswerButton trueAns">True</button>
    //     <button class="questionAnswerButton falseAns">False</button>
    // </div>

    let answerButtonsBox = document.createElement("div")
    answerButtonsBox.id = "answerButtonsBox"
    
    let trueButton = document.createElement("button")
    trueButton.classList.add("questionAnswerButton")
    trueButton.classList.add("trueAns")
    
    

    let falseButton = document.createElement("button")
    falseButton.classList.add("questionAnswerButton")
    falseButton.classList.add("falseAns")
    

    if (who == Data.GAME_RESPONDER)
    {
        trueButton.textContent = "Yes"
        falseButton.textContent = "No"
    }
    else if (who == Data.GAME_GUESSER){
        trueButton.textContent = "Tells truth"
        falseButton.textContent = "Lies"
    }



    answerButtonsBox.appendChild(trueButton)
    answerButtonsBox.appendChild(falseButton)

    return answerButtonsBox

}

function generateResponderQuestionBox(data){
    // <div id="questionMsg">How old are you?</div>
    // <div id="questionPromptBox">Tell the truth</div>
    // <div id="answerButtonsBox">
    //     <button class="questionAnswerButton trueAns">True</button>
    //     <button class="questionAnswerButton falseAns">False</button>
    // </div>

    let questionMsg = document.createElement("div")
    questionMsg.id = "questionMsg"
    questionMsg.textContent = data["QUESTION"]

    let questionPromptBox = document.createElement("div")
    questionPromptBox.id = "questionPromptBox"
    questionPromptBox.textContent = "( Tell the: " + data["OPERATION"] + " )"


    let answerButtonsBox = generateAnswerButtonBox(Data.GAME_RESPONDER)

    answerButtonsBox.getElementsByClassName("trueAns")[0].addEventListener("click", ()=>{
        sendMsgToServer(Data.GAME_QUESTION_REPLY(true))
    })
    answerButtonsBox.getElementsByClassName("falseAns")[0].addEventListener("click", ()=>{
        sendMsgToServer(Data.GAME_QUESTION_REPLY(false))
    })

    let element = document.getElementById("questionBox")
    element.innerHTML = ""
    element.appendChild(questionMsg)
    element.appendChild(questionPromptBox)
    element.appendChild(answerButtonsBox)

    console.log("DATA_RECEIVED: " + data["OPERATION"])
}

function generateGuesserQuestionBox(data){
    // <div id="questionMsg">How old are you?</div>
    // <div id="questionPromptBox">Opponent told the truth</div>
    // <div id="answerButtonsBox">
    //     <button class="questionAnswerButton trueAns">True</button>
    //     <button class="questionAnswerButton falseAns">False</button>
    // </div>

    let questionMsg = document.createElement("div")
    questionMsg.id = "questionMsg"
    questionMsg.textContent = data["QUESTION"]

    let questionPromptBox = document.createElement("div")
    questionPromptBox.id = "questionPromptBox"
    let answer = (data["ANSWER"]) ? "Yes" : "No"
  
    questionPromptBox.textContent = "( Opponent's answer: " + answer + " )"


    let answerButtonsBox = generateAnswerButtonBox(Data.GAME_GUESSER)
    answerButtonsBox.getElementsByClassName("trueAns")[0].addEventListener("click", ()=>{
        console.log("clicked tells truth button")
        sendMsgToServer(Data.GAME_QUESTION_VERIFY_REPLY(true))
    })
    answerButtonsBox.getElementsByClassName("falseAns")[0].addEventListener("click", ()=>{
        console.log("clicked false button")
        sendMsgToServer(Data.GAME_QUESTION_VERIFY_REPLY(false))
    })

    let element = document.getElementById("questionBox")
    element.innerHTML = ""
    element.appendChild(questionMsg)
    element.appendChild(questionPromptBox)
    element.appendChild(answerButtonsBox)

    console.log("DATA_RECEIVED: " + data["ANSWER"])
}



function handleMsg(msg) {
    let data = JSON.parse(msg)
    if (data["MSG_TYPE"] == Data.DISCONNECT_MSG_TYPE && !gameEnded) {
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
    if (msgType == Data.STARTING_GAME_ROUNDS_MSG_TYPE){

    }
    if (msgType == Data.CURRENT_COINS_MSG_TYPE){
        document.getElementById("coins").textContent = data["VALUE"]
        console.log("received coins request")
    }
    if (msgType == Data.ROUND_START_MSG_TYPE){
        document.getElementById("role").textContent = ""
        document.getElementById("questionBox").textContent = ""
        sendMsgToServer(Data.GET_CURRENT_COINS_MSG)
        console.log("sent coins request")
    }

    if (msgType == Data.GAME_ROLE_MSG_TYPE){
        document.getElementById("role").textContent = data["VALUE"]
    }

    if (msgType == Data.GAME_RESPONDER_ANSWERING_TYPE){
        document.getElementById("questionBox").textContent = WAITING_FOR(Data.GAME_RESPONDER)
    }
    if (msgType == Data.GAME_GUESSER_ANSWERING_TYPE){
        document.getElementById("questionBox").textContent = WAITING_FOR(Data.GAME_GUESSER)
    }

    if (msgType == Data.GAME_QUESTION_MSG_TYPE){
        generateResponderQuestionBox(data["VALUE"])
    }
    if (msgType == Data.GAME_QUESTION_VERIFY_TYPE){
        generateGuesserQuestionBox(data["VALUE"])
    }

    if (msgType == Data.ROUND_END_MSG_TYPE){
        document.getElementById("role").textContent = ""
        document.getElementById("questionBox").textContent = ""
        sendMsgToServer(Data.GET_CURRENT_COINS_MSG)
        console.log("sent coins request")

    }
    

    if (msgType == Data.ENDING_GAME_ROUNDS_MSG_TYPE) {
        Destinations.goToGameSummaryScreen()
    }

}
function gameSummaryMsgHandler(data) {
    
    let msgType = data["MSG_TYPE"];
    
    if (msgType == Data.GAME_SUMMARY_MSG_TYPE) {
        gameEnded = true
        let summaryData = data["VALUE"]
        
        if (summaryData["GAME_RESULT"] == Data.WIN){
            document.getElementById("winScreen").style.display = "flex"
            coins = summaryData["COINS"]
            prizes = summaryData["PRIZES"]
            document.getElementById("winCoins").textContent = coins
        }
        else if (summaryData["GAME_RESULT"] == Data.LOST){
            document.getElementById("lostScreen").style.display = "flex"
        }
        else if (summaryData["GAME_RESULT"] == Data.TIE){
            document.getElementById("tieScreen").style.display = "flex"
        }
    }
   
}

document.getElementById("gameMakerNameOnSlackPrizeButton").addEventListener("click", ()=>{
    console.log("Name on slack clicked")
    if (coins < 15){
        return
    }
    coins -= 15
    document.getElementById("winCoins").textContent = coins
    alert(prizes["CREATOR_NAME"])
})

document.getElementById("gameMakerGpuPrizeButton").addEventListener("click", ()=>{
    console.log("gpu clicked")
    if (coins < 15){
        return
    }
    coins -= 15
    document.getElementById("winCoins").textContent = coins
    alert(prizes["CREATOR_GPU"])
})




