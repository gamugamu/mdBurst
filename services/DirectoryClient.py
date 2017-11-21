# coding: utf8
import services.ConfigLoader as ConfigLoader
import services.DirectoryAutoAcount as DAA

import requests
from flask import request

import json

import time


TOKEN_REQU_HEADER       = "token-request"
TOKEN_HEADER            = "token"
MD_BUSTMD_UID           = DAA.create_MDBurstFolder_if_none()

def DirectoryClient(app):
    @app.route('/dc/graph')
    def graph():
        token           = DAA.getToken()
        headers_auth    = {'content-type': 'application/json', TOKEN_HEADER : token}
        data            = {"file_id" : MD_BUSTMD_UID}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'graph',
            headers = headers_auth,
            data    = json.dumps(data)
            )

        return r.content

    @app.route('/dc/post', methods=["POST"])
    def post():
        post =  request.get_json()

        token           = DAA.getToken()
        headers_auth    = {'content-type': 'application/json', TOKEN_HEADER : token}
        payload         = {"payload" : {
            "parentId"  : MD_BUSTMD_UID,
            "name"      : post["title"],
            "type"      : 2,
            "owner"     : "unknow",
            "title"     : post["title"],
            "payload"   : post["payload"]
        }}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'createfile',
            headers = headers_auth,
            data    = json.dumps(payload)
            )

        return r.content

    @app.route('/dc/getPayload', methods=["POST"])
    def get_payload():
        post            =  request.get_json()
        token           = DAA.getToken()
        headers_auth    = {'content-type': 'application/json', TOKEN_HEADER : token}
        filesID         = {"filesid" : post["filesid"]}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'filespayload',
            headers = headers_auth,
            data    = json.dumps(filesID)
            )
        #TODO gestion erreur
        data = json.loads(r.content)
        return json.dumps(data["filespayload"])


    @app.route('/dc/history', methods=["POST"])
    def get_history():
        post            =  request.get_json()
        token           = DAA.getToken()
        headers_auth    = {'content-type': 'application/json', TOKEN_HEADER : token}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'history',
            headers = headers_auth,
            data    = json.dumps({"option-filter" : {
                "group_name"        : "groupmdBurst",
                "file_header"       : True,
                "current_page"      : post["current_page"],
                "total_per_page"    : 5
                }}))

        data = json.loads(r.content)
        return json.dumps(data)
