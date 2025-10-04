from .gameSession import GameSession
import websockets, asyncio
from typing import List
import json

from ..globals.communication import *

class Client:
    def __init__(self, ws: websockets.WebSocketServerProtocol):
        self.gameSession: GameSession = None
        self.websocket: websockets.WebSocketServerProtocol = ws

        self.messages: List[str] = []

        self.closed = False

    async def sendMsg(self, msg: dict) -> bool:

        if self.websocket.closed:
            return False
        await self.websocket.send(json.dumps(msg))
        return True

    async def receiveMsg(self, blocking=True) -> dict:
        if (blocking):
            while len(self.messages) == 0: await asyncio.sleep(0)
        else:
            if (len(self.messages) == 0):
                return NONE_MSG
            
        message: str = self.messages[0]

        self.messages.pop(0)

        data = json.loads(message)
        return data
            
            

    def assign_game(self, game: GameSession):
        self.gameSession = game

    async def wait_until_game_assigned(self):
        while not self.gameSession: await asyncio.sleep(0)

        return 