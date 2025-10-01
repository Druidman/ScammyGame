import websockets, asyncio

async def main():
    async with websockets.connect("ws://localhost:8000") as ws:
        await ws.send("Hello from client!")
        response = await ws.recv()
        print(f"Respone: {response}")


asyncio.run(main());
