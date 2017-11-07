# coding: utf8
import services.ConfigLoader as ConfigLoader
from Crypto import Random
from Crypto.Cipher import AES
from datetime import datetime, timedelta

import requests
import base64
import json

Fa01_DATE_FORMAT    = "%Y-%m-%d_%H:%M:%S"
ROOT_URL            = ConfigLoader.get("url_DIRECTORY_API")
AKEY                = ConfigLoader.get("key_DIRECTORY_API")
SECRET_KEY          = ConfigLoader.get("secret_key_DIRECTORY_API")

# créer automatiquement un compte et se logue à l'interface directory API pour créer le MAIN_GROUP_MDBURST

def generateAPIKey():
    return encrypt(SECRET_KEY + "|" + datetime.now().strftime(Fa01_DATE_FORMAT), AKEY)

def create_MDBurstFolder_if_none():
    data = is_MDBurstFolder_exist()

    if data["error"]["code"] == "1":
        return data["filepayload"]["uid"]
    else:
        return create_account_AF()

def is_MDBurstFolder_exist():
    group_main  = ConfigLoader.get("MAIN_GROUP_MDBURST")

    r           = requests.get(ROOT_URL + "groupbyname/" + group_main, headers = {'content-type': 'application/json',})
    data        = json.loads(r.content)

    return data

def create_account_AF():
    apirequestkey           = encrypt(SECRET_KEY + "|" + datetime.now().strftime(Fa01_DATE_FORMAT), AKEY)
    headers_requestToken    = {'content-type': 'application/json', 'token-request' : apirequestkey}
    # GET TOKEN
    r       = requests.get(ROOT_URL + "asktoken", headers=headers_requestToken)
    data    = json.loads(r.content)
    token   = data["token"]["hash"]

    # CREATE ACCOUNT
    headers_token   = {'content-type': 'application/json', 'token' : token}
    email           = ConfigLoader.get("login_DIRECTORY_API")
    password        = ConfigLoader.get("passw_DIRECTORY_API")

    crypted_password    = encrypt(SECRET_KEY + "|" + password + "|" + email + "|" + datetime.now().strftime(Fa01_DATE_FORMAT), AKEY)
    r                   = requests.post(ROOT_URL + "createaccount", headers=headers_token, data=json.dumps({"loginrequest" : {"email" : email, "cryptpassword" : crypted_password}}))
    data                = json.loads(r.content)

    code_error          = data["error"]["code"]
    #1 success | 30 count already exist
    if code_error == "1" or code_error == "30":
        print "account OK++"
        return login_to_directory_AF(crypted_password, headers_token, email)
    else:
        print "ERROR SERVER"
        return "NOK"

def login_to_directory_AF(crypted_password, headers_token, email):
    r           = requests.post(ROOT_URL + "login", headers=headers_token, data=json.dumps({"loginrequest" : {"email" : email , "cryptpassword" : crypted_password}}))
    data        = json.loads(r.content)
    code_error  = data["error"]["code"]

    if code_error == "1":
        print "login OK++"
        token_session = data["token"]["hash"]
        return create_MDBurstFolder_AF(token_session)
    else:
        print "ERROR SERVER"
        return "NOK"

def create_MDBurstFolder_AF(token_session):
    headers_session_token   = {'content-type': 'application/json', 'token' : token_session}
    group_name              = ConfigLoader.get("MAIN_GROUP_MDBURST")

    data        = {"filetype" : {"type" : 1, "name" : group_name, "parentId" : ""}}
    r           = requests.post(ROOT_URL + "createfile", headers=headers_session_token, data=json.dumps(data))
    data        = json.loads(r.content)
    code_error  = data["error"]["code"]

    if code_error == "1":
        print "data OK", data
        return "OK"
    else:
        print "ERROR SERVER"
        return "NOK"

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
