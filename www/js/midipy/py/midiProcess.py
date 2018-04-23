import asyncio
import websockets
import base64
import uuid
import json
import os
from music21 import *

async def midiProcess(websocket, path):
	
	while True:
		input = await websocket.recv()
		print('starting midi processing')

		splittedInput = str.split(input, ',')
		b64str = splittedInput[1]
		extension = str.split(str.split(splittedInput[0], '/')[1], ';')[0]
		extension = '.' + extension

		currDir = os.path.realpath(__file__).replace('midiProcess.py', '')
		fileName = currDir + 'audiofiles/' + uuid.uuid4().hex + extension
		#fileName = 'audiofiles/3f13166a5fd9409486c6d54f2fc61433.mid'

		file = open(fileName, 'wb')
		file.write(base64.b64decode(b64str))
		file.close()

		s = converter.parse(fileName)
		chordified = s.chordify()

		chords = []
		for thisChord in chordified.recurse().getElementsByClass('Chord'):
			if(thisChord.normalOrder not in chords):
				chords.append(thisChord.normalOrder)

		await websocket.send(json.dumps(chords))
		print('midi processed and sent')

start_server = websockets.serve(midiProcess, "127.0.0.1", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()