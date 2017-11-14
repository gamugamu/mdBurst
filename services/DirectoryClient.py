# coding: utf8
import services.ConfigLoader as ConfigLoader
import services.DirectoryAutoAcount as DAA

import requests
from flask import request

import json

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
        payload         = {"filetype" : {"parentId" : MD_BUSTMD_UID, "name" : post["title"], "type": 2}}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'createfile',
            headers = headers_auth,
            data    = json.dumps(payload)
            )
        print "result ", r.content

        return r.content
