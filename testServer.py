import websockets, asyncio, json

from server.globals.communication import *

# DEST = "wss://scammygame-production.up.railway.app"
DEST = "ws://localhost:8080"
PORT = 8080


messages = []

async def getMsg() -> dict:
    while (len(messages) == 0): await asyncio.sleep(0)

    msg: str = messages[0]
    messages.pop(0)

    data = json.loads(msg)

    return data

async def testGame(websocket: websockets.WebSocketServerProtocol):
    response = await getMsg()
    if (response["MSG_TYPE"] != CONNECTION_MSG_TYPE or not response["VALUE"]):
        if (response["MSG_TYPE"] == DISCONNECT_MSG_TYPE):
            print("server closed connection!")
            return
        
        print("Client couldn't connect succesfully")
        exit()


    response = await getMsg()
    if (response["MSG_TYPE"] != GAME_ASSIGNED_MSG_TYPE or not response["VALUE"]):
        if (response["MSG_TYPE"] == DISCONNECT_MSG_TYPE):
            print("server closed connection!")
            return
        print("Client couldn't get game succesfully")
        exit()
    
    print("full client cycle done!")


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
