import asyncio
import datetime
import random
import websockets

async def hello_world(websocket, path):
    while True:
        input = await websocket.recv()
        await websocket.send(input + ' world!')

start_server = websockets.serve(hello_world, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()