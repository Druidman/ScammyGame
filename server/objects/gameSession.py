from ..globals.communication import *
import websockets, asyncio, time

class GameSession:
    
    def __init__(self):
        from .client import Client
        self.player1: Client = None
        self.player2: Client = None

        self.ended: bool = False


        self.CHATTING_PHASE_TIME = 30 #s

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
    
    async def handleChatMsg(msg: str, receiver):
        if (msg == ""):
            return 

      

    async def chattingPhase(self):
        if not await self.player1.sendMsg("CHATTING_PHASE"):
            print("Error when sending chatting phase com to player1")
        if not await self.player2.sendMsg("CHATTING_PHASE"):
            print("Error when sending chatting phase com to player2")

        startTime = time.time()
        while (time.time() - startTime < self.CHATTING_PHASE_TIME):
            msgFromP1 = await self.player1.receiveMsg(False)
            await self.handleChatMsg(msgFromP1, self.player2)

            msgFromP2 = await self.player2.receiveMsg(False)
            await self.handleChatMsg(msgFromP2, self.player1)
    async def runGame(self):
        print("Starting game...")

        print("checkcing players...")
        if (not await self.checkIfPlayersReady()):
            print("Players not ready")
            await self.stop()
            return
        print("player ready!")


        await self.chattingPhase()
        
        
        
        

