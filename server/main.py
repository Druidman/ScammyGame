import websockets
import asyncio



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
    server = await websockets.serve(clientHandler, "localhost", 8000)
    print("Server started...")
    await server.wait_closed()

asyncio.run(main());