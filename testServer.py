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


    response = await getMsg()
    if (response["MSG_TYPE"] != REQUEST_STATUS_MSG_TYPE or not response["VALUE"]):
        if (response["MSG_TYPE"] == DISCONNECT_MSG_TYPE):
            print("server closed connection!")
            return
        print("Not request status")
        exit()

    await websocket.send(json.dumps(STATUS_MSG(True)))

    
    
    print("Client is in game with other opponent!")

    response = await getMsg()
    if (response["MSG_TYPE"] != START_CHATTING_PHASE_MSG_TYPE):
        if (response["MSG_TYPE"] == DISCONNECT_MSG_TYPE):
            print("server closed connection!")
            return
        print("Not chatting start msg")
        exit()

    await websocket.send(json.dumps(CHAT_MSG("Starting msg...")))
    response = await getMsg()
    while (response["MSG_TYPE"] != END_CHATTING_PHASE_MSG_TYPE):
        if (response["MSG_TYPE"] == DISCONNECT_MSG_TYPE):
            print("server closed connection!")
            return
        if (response["MSG_TYPE"] != CHAT_MSG_TYPE):
            print("Got different msg type during chatting phase!!!")
            return
        
        print(f"Received msg: {response['VALUE']}")
        await websocket.send(json.dumps(CHAT_MSG("I got your msg")))

        response = await getMsg()

    print("End of chatting...")
    print("full client cycle done!...")
    


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
