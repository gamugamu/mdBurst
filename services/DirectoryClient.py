from datetime import datetime, timedelta
from Crypto import Random
from Crypto.Cipher import AES
from flask import request

import base64
import requests
import json
import services.ConfigLoader as ConfigLoader

Fa01_DATE_FORMAT        = "%Y-%m-%d_%H:%M:%S"
TOKEN_REQU_HEADER       = "token-request"
TOKEN_HEADER            = "token"

def DirectoryClient(app):
    @app.route('/dc/generateAPIKey')
    def generateAPIKey():
        return encrypt(ConfigLoader.get("secret_key_DIRECTORY_API") + "|" + datetime.now().strftime(Fa01_DATE_FORMAT), ConfigLoader.get("key_DIRECTORY_API"))

    @app.route('/dc/graph', methods=['POST'])
    def graph():
        if TOKEN_REQU_HEADER in request.headers:
            crypted_token_request = request.headers.get(TOKEN_REQU_HEADER)
        else:
            crypted_token_request = ""

        headers_auth = {
            'content-type': 'application/json',
            TOKEN_REQU_HEADER : crypted_token_request
            }

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'graph',
            headers = headers_auth,
            data    = json.dumps(request.get_json())
            )
        return r.content

# AES Encryption
def pad(data):
    length = 16 - (len(data) % 16)
    return data + chr(length)*length

def unpad(data):
    return data[:-ord(data[-1])]

def encrypt(message, passphrase):
    IV = Random.new().read(16)
    aes = AES.new(passphrase, AES.MODE_CFB, IV, segment_size=128)
    return base64.b64encode(IV + aes.encrypt(pad(message)))

def decrypt(encrypted, passphrase):
    encrypted = base64.b64decode(encrypted)
    IV = encrypted[:16]
    aes = AES.new(passphrase, AES.MODE_CFB, IV, segment_size=128)
    return unpad(aes.decrypt(encrypted[BLOCK_SIZE:]))
