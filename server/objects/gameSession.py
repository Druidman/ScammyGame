from ..globals.communication import *
import websockets, asyncio

class GameSession:
    def __init__(self):
        from .client import Client
        self.player1: Client = None
        self.player2: Client = None

        self.ended: bool = False

    async def checkIfPlayersReady(self) -> bool:
        await self.player1.sendMsg(REQUEST_STATUS)

        await self.player2.sendMsg(REQUEST_STATUS)

        msg1 = await self.player1.receiveMsg()
        msg2 = await self.player2.receiveMsg()

        if (msg1 == msg2 == READY_STATUS):
            return True
        else:
            return False
        
    async def stop(self):
        if (self.ended):
            return
        if (not self.player1.closed):
            await self.player1.sendMsg(DISCONNECT)
        if (not self.player2.closed):
            await self.player2.sendMsg(DISCONNECT)
        self.ended = True

    async def update(self):
        await self.player1.sendMsg(TEST_MSG)
        await self.player2.sendMsg(TEST_MSG)