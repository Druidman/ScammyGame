import websockets
import asyncio
import os



PORT = int(os.environ.get("PORT", 8000))

async def clientHandler(websocket: websockets.WebSocketServerProtocol, path):
    print("Client connected")

    try:
        async for message in websocket:
            print("Message received: ", message)
            await websocket.send(f"Echo: {message}")


    except Exception as e:
        print(f"EXCEPTION: {e}")
        websocket.close()
        

async def main():
    server = await websockets.serve(clientHandler, "0.0.0.0", PORT)
    print(f"Server started... on port {PORT}")
    await server.wait_closed()

asyncio.run(main());