import * as Data from "./data.js"
import { setCurrentScreen, currentScreen } from "./index.js"
import { animateQueueWaitUntilNotVisible } from "./utils.js"

export function switchToConnectionWaiter(){
    document.getElementById("conectionWaiter").style.display = "flex"
    document.getElementById("lobbyWaiter").style.display = "none"
    animateQueueWaitUntilNotVisible("conectionWaiter")
}

export function switchToLobbyWaiter(){
    document.getElementById("conectionWaiter").style.display = "none"
    document.getElementById("lobbyWaiter").style.display = "flex"
    animateQueueWaitUntilNotVisible("lobbyWaiter")
}



export function hideAllScreens(){
    let screens = document.querySelectorAll(".mainSection")
    for (let screen of screens){
        screen.style.display = "none"
    }
}

export function goToWelcomeScreen(){
    if (currentScreen == Data.WELCOME_SCREEN){
        console.log("Changing to same screen WELCOME_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("welcomeScreen").style.display = "flex"

    setCurrentScreen(Data.WELCOME_SCREEN)
}

export function goToGameQueueScreen(){
    if (currentScreen == Data.GAME_QUEUE_SCREEN){
        console.log("Changing to same screen GAME_QUEUE_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("gameQueueScreen").style.display = "flex"
    switchToConnectionWaiter()

    setCurrentScreen(Data.GAME_QUEUE_SCREEN)
}

export function goToGameReadyScreen(){
    if (currentScreen == Data.GAME_READY_SCREEN){
        console.log("Changing to same screen GAME_READY_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("gameReadyScreen").style.display = "flex"

    setCurrentScreen(Data.GAME_READY_SCREEN)
}

export function goToGameChatScreen(){
    if (currentScreen == Data.GAME_CHAT_SCREEN){
        console.log("Changing to same screen GAME_CHAT_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("gameChatScreen").style.display = "flex"


    setCurrentScreen(Data.GAME_CHAT_SCREEN)
}

export function goToGameScreen(){
    if (currentScreen == Data.GAME_SCREEN){
        console.log("Changing to same screen GAME_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("gameScreen").style.display = "flex"

    setCurrentScreen(Data.GAME_SCREEN)
}

export function goToGameSummaryScreen(){
    if (currentScreen == Data.GAME_SUMMARY_SCREEN){
        console.log("Changing to same screen GAME_SUMMARY_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("gameSummaryScreen").style.display = "flex"

    setCurrentScreen(Data.GAME_SUMMARY_SCREEN)
}

export function goToThankYouScreen(){
    if (currentScreen == Data.THANK_YOU_SCREEN){
        console.log("Changing to same screen THANK_YOU_SCREEN")
        return
    }
    hideAllScreens()
    document.getElementById("thankYouScreen").style.display = "flex"

    setCurrentScreen(Data.THANK_YOU_SCREEN)
}
