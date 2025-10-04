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

                await game.player1.sendMsg(GAME_ASSIGNED_MSG(True))
                await game.player2.sendMsg(GAME_ASSIGNED_MSG(True))

                asyncio.create_task(game.runGame())
                print("created new gameSession!")
            await asyncio.sleep(0)

    async def clientHandler(self, server: websockets.WebSocketServerProtocol):
        print(f"client connected!")
        
        try:
            
            client: Client = Client(server)

            self.clients.append(client)
            self.unassigned_clients.append(client)
            
            await client.sendMsg(CONNECTION_MSG(True))
            print("sent succesfull connection")
            
            async for msg in server:
                client.messages.append(msg)
        except websockets.ConnectionClosed:
            print("Connection closed dirty")
        finally:
            print("client disconnected...")
            if (not client):
                return
            client.closed = True
            if (client in self.clients):
                self.clients.remove(client)
            if (not client.gameSession):
                self.unassigned_clients.remove(client)
            else:
                await client.gameSession.stop()
            
            
            

        
            