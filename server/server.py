import websockets
import asyncio

from .objects.gameSession import GameSession
from .objects.client import Client
from .globals.communication import *

from typing import List


class Server:
    def __init__(self, host: str, port: int):
        self.host = host
        self.port = port

        self.server: websockets.WebSocketServer = None

        self.unassigned_clients: List[Client] = []
        self.clients: List[Client] = []

        self.SHUTDOWN = False

    
    async def run_server(self):
        server: websockets.WebSocketServer = await websockets.serve(self.clientHandler, host="0.0.0.0", port=self.port)
        print(f"Server started... on port {self.port}")


        asyncio.create_task(self.player_connector())
        

        await server.wait_closed()
        self.SHUTDOWN = True
    async def run_game_session(self, game: GameSession):
        if (not await game.checkIfPlayersReady()):
            print("Players not ready")
            await game.stop()
            return
        
        print("Starting game...")
        while not game.ended:
            await game.update()
            await asyncio.sleep(0)

        await game.stop()

    async def player_connector(self):
        print(f"player connector running...")
        while not self.SHUTDOWN:
            if (len(self.unassigned_clients) >= 2):
                game: GameSession = GameSession()

                self.unassigned_clients[0].assign_game(game)
                self.unassigned_clients[1].assign_game(game)

                game.player1 = self.unassigned_clients[0]
                game.player2 = self.unassigned_clients[1]

                self.unassigned_clients.pop(1)
                self.unassigned_clients.pop(0)

                await game.player1.sendMsg(GAME_ASSIGNED)
                await game.player2.sendMsg(GAME_ASSIGNED)

                asyncio.create_task(self.run_game_session(game=game))
                print("created new gameSession!")
            await asyncio.sleep(0)

    async def clientHandler(self, server: websockets.WebSocketServerProtocol):
        print(f"client connected!")
        client: Client = Client(server)

        self.clients.append(client)
        self.unassigned_clients.append(client)
        try:
            await client.sendMsg(SUCCESFULLY_CONNECTED)
            print("sent succesfull connection")
            
            async for msg in server:
                client.messages.append(msg)
        finally:
            client.closed = True

            self.clients.remove(client)
            if (not client.gameSession):
                self.unassigned_clients.remove(client)
            else:
                await client.gameSession.stop()
            
            
            print("client disconnected...")

        
            