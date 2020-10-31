from flask import Flask, request, Response
import os, re
import json
from flask_cors import CORS

MEDIA = "."
CHUNK_SIZE_LIMIT = 8000000 #8MB

nft = []

app = Flask(__name__)
CORS(app)

@app.route("/content", methods = ['POST'])
def content():
     if request.method == 'POST':
        data = (request.get_data()).decode()
        print("INCOMING: ",data)
        data = json.loads(data)
        nft.append(data)
        return json.dumps({"res":True})

@app.route("/")
def beg():
    return json.dumps(nft)

@app.after_request
def after_request(response):
    response.headers.add('Accept-Ranges', 'bytes')
    return response


if __name__ == "__main__":
    # print(scan_dir(MEDIA))
    app.run(debug=True, port=5000, host='0.0.0.0')
    
