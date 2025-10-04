from ..globals.communication import *
from ..globals.game_questions import *
import websockets, asyncio, time, random

class GameSession:
    
    def __init__(self):
        from .client import Client
        self.player1: Client = None
        self.player2: Client = None

        self.ended: bool = False


        self.CHATTING_PHASE_TIME = 10 #s\
        self.COINS_PER_ROUND = 50

        self.guesser = self.player1
        self.responder = self.player2

        self.available_questions = GAME_QUESTIONS

    async def checkIfPlayersReady(self) -> bool:
        await self.player1.sendMsg(REQUEST_STATUS_MSG)

        await self.player2.sendMsg(REQUEST_STATUS_MSG)

        msg1 = await self.player1.receiveMsg()
        msg2 = await self.player2.receiveMsg()

        if (
            (msg1["MSG_TYPE"] == msg2["MSG_TYPE"] == STATUS_MSG_TYPE)
            and
            (msg1["VALUE"] and msg2["VALUE"])
        ):
            
            return True
          
        else:
            return False
        
    async def stop(self):
        if (self.ended):
            return
        if (not self.player1.closed):
            await self.player1.sendMsg(DISCONNECT_MSG)
        if (not self.player2.closed):
            await self.player2.sendMsg(DISCONNECT_MSG)
        self.ended = True
    
    async def handleChatMsg(self,msg: str, receiver):
        if (msg == NONE_MSG):
            return 
        
        if (msg["MSG_TYPE"] != CHAT_MSG_TYPE):
            return
        
        await receiver.sendMsg(msg)
        
    async def chattingPhase(self):
        print("chatting...")
        if not await self.player1.sendMsg(START_CHATTING_PHASE_MSG):
            print("Error when sending chatting phase start com to player1")
        if not await self.player2.sendMsg(START_CHATTING_PHASE_MSG):
            print("Error when sending chatting phase start com to player2")

        startTime = time.time()
        while (time.time() - startTime < self.CHATTING_PHASE_TIME):
            msgFromP1 = await self.player1.receiveMsg(False)
            await self.handleChatMsg(msgFromP1, self.player2)

            msgFromP2 = await self.player2.receiveMsg(False)
            await self.handleChatMsg(msgFromP2, self.player1)


            await asyncio.sleep(0)

        if not await self.player1.sendMsg(END_CHATTING_PHASE_MSG):
            print("Error when sending chatting phase end com to player1")
        if not await self.player2.sendMsg(END_CHATTING_PHASE_MSG):
            print("Error when sending chatting phase end com to player2")

    async def giveCoins(self): 
        self.player1.coins = self.COINS_PER_ROUND
        self.player2.coins = self.COINS_PER_ROUND

    async def askQuestionToPlayer(self, question: str, shouldLie: bool) -> bool:
        

        #ask the question
        if not await self.responder.sendMsg(GAME_QUESTION_MSG(question, shouldLie)):
            print("Error when sending question com to responder")
        
        #get answer
        msg = await self.responder.receiveMsg()
        if (msg["MSG_TYPE"] != GAME_QUESTION_REPLY_TYPE):
            print("WRONG answer msg type in askQuestionToPlayer")
        
        return msg["VALUE"]
    
    async def toVerifyAnswerPlayer(self, question: str, answer: str) -> bool:
    
        #ask to verify
        if not await self.guesser.sendMsg(GAME_QUESTION_VERIFY(question, answer)):
            print("Error when sending question verify com to guesser")
        
        #get answer
        msg = await self.guesser.receiveMsg()
        if (msg["MSG_TYPE"] != GAME_QUESTION_VERIFY_REPLY_TYPE):
            print("WRONG answer msg type in toVerifyAnswerPlayer")
        
        return msg["VALUE"]
        


    async def startRound(self, i: int):
        # send round start
        if not await self.player1.sendMsg(ROUND_START_MSG):
            print("Error when sending round start com to player1")
        if not await self.player2.sendMsg(ROUND_START_MSG):
            print("Error when sending round start com to player2")

        # send question to player
        # receive answer
        questionInd: int = random.randint(0,len(self.available_questions))
        question: str = self.available_questions[questionInd]
        shouldLie: bool = bool(random.randint(0,1))

        responderAnswer: bool = await self.askQuestionToPlayer(question=question, shouldLie=shouldLie)

        # send answer and question to  second player
        # receive answer
        guesserAnswer: bool = await self.toVerifyAnswerPlayer(question=question, answer=responderAnswer)

        # compare answers
        realResponderAnswer: bool = responderAnswer
        if (shouldLie):
            # If user was prompted to lie then his actual answer would have been negation of real one
            realResponderAnswer = not responderAnswer

        # if guesserAnswer is true then it means that we think that responders answer is true
        if (guesserAnswer == realResponderAnswer):
            # guessed!
            self.guesser.coins += 1
        else:
            # not guessed !
            self.responder.coins += 1

        # send round end
        if not await self.player1.sendMsg(ROUND_END_MSG):
            print("Error when sending round end com to player1")
        if not await self.player2.sendMsg(ROUND_END_MSG):
            print("Error when sending round end com to player2")

        return
        
    async def runGame(self):
        print("Starting game...")

        print("checkcing players...")
        if (not await self.checkIfPlayersReady()):
            print("Players not ready")
            await self.stop()
            return
        print("players ready!")


        await self.chattingPhase()
        print("End of chatting!")

        print("Giving coins...")
        await self.giveCoins()


        print("Starting rounds....")
        self.guesser = self.player1
        self.responder = self.player2
        for i in range(5):
            print(f"Round {i}. START!")
            await self.startRound(i)
            print(f"Round {i}. END!")
        print("game done")

        print("Stopping the game")
        await self.stop()
        
        
        
        

