import websockets, asyncio



async def main():
    async with websockets.connect("wss://scammygame-production.up.railway.app") as ws:
        await ws.send("Hello from client!")
        response = await ws.recv()
        print(f"Respone: {response}")


asyncio.run(main());
