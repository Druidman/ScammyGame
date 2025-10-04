import websockets, asyncio

from server.globals.communication import *

# DEST = "wss://scammygame-production.up.railway.app"
DEST = "ws://localhost:8080"
PORT = 8080


messages = []

async def getMsg() -> str:
    while (len(messages) == 0): await asyncio.sleep(0)

    msg: str = messages[0]
    messages.pop(0)

    return msg

async def testGame(websocket: websockets.WebSocketServerProtocol):
    response = await getMsg()
    if (response != SUCCESFULLY_CONNECTED):
        if (response == DISCONNECT):
            print("server closed connection!")
            return
        
        print("Client couldn't connect succesfully")
        exit()


    response = await getMsg()
    if (response != GAME_ASSIGNED):
        if (response == DISCONNECT):
            print("server closed connection!")
            return
        print("Client couldn't get game succesfully")
        exit()
    
    print("full client cycle done!")

    response = await getMsg()
    if (response != REQUEST_STATUS):
        if (response == DISCONNECT):
            print("server closed connection!")
            return
        print(f"Wrong game requests order {__file__}")
        exit()


    print("closing connection")
    await websocket.close()

    
    
    


    


async def main():
    

    async with websockets.connect(DEST) as ws:
        asyncio.create_task(testGame(ws))
        try:
            async for msg in ws:
                messages.append(msg)
        except websockets.ConnectionClosed:
            print("Closed connection as exception")
        
        return


        

    
    


asyncio.run(main());
