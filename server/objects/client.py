from .gameSession import GameSession
import websockets, asyncio
from typing import List

class Client:
    def __init__(self, ws: websockets.WebSocketServerProtocol):
        self.gameSession: GameSession = None
        self.websocket: websockets.WebSocketServerProtocol = ws

        self.messages: List[str] = []

        self.closed = False

    async def sendMsg(self, msg: str) -> bool:
        if self.websocket.closed:
            return False
        await self.websocket.send(msg)
        return True

    async def receiveMsg(self) -> str:
        while len(self.messages) == 0: await asyncio.sleep(0)

        message: str = self.messages[0]

        self.messages.pop(0)
        return message

    def assign_game(self, game: GameSession):
        self.gameSession = game

    async def wait_until_game_assigned(self):
        while not self.gameSession: await asyncio.sleep(0)

        return 