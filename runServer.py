from server import server
import os, asyncio


HOST = "0.0.0.0"
PORT = int(os.environ.get("PORT", 8080))

serverObj: server.Server = server.Server(HOST, PORT)


asyncio.run(serverObj.run_server())