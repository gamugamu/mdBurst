# coding: utf8
import services.ConfigLoader as ConfigLoader
import services.DirectoryAutoAcount as DAA

from services import Cloudinary
from services import File_metadata

import requests
import json
import time

from flask import request

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

        print "graph", r.content
        return r.content

    @app.route('/dc/post', methods=["POST"])
    def post():
        post        = request.get_json()

        payload     = post["payload"]
        title       = post["title"]
        category    = post["category"]
        print "category", category
        for idx, image_64 in enumerate(post["image_base_64"]):
            # Cloudinary
            image_tag   = "data:image_" + str(idx)
            image_Link  = Cloudinary.upload_image(image_64)
            print "D", image_Link

            payload     = payload.replace(image_tag, "![](" + image_Link + ")")

        token           = DAA.getToken()
        headers_auth    = {'content-type': 'application/json', TOKEN_HEADER : token}
        payload         = {"payload" : {
            "parentId"  : MD_BUSTMD_UID,
            "name"      : title,
            "type"      : 2,
            "owner"     : "unknow",
            "title"     : title,
            "payload"   : payload
        }}

        r = requests.post(
            ConfigLoader.get("url_DIRECTORY_API") + 'createfile',
            headers = headers_auth,
            data    = json.dumps(payload)
            )

        # if r.content ok
        result = json.loads(r.content)

        # success
        if int(result["error"]["code"]) == 1:
            File_metadata.select_category_to_file(file_name=result["filepayload"]["uid"], category=category)
        else:
            #TODO error handling
            pass

        return r.content

    @app.route('/dc/getPayload', methods=["POST"])
    def get_payload():
        post            = request.get_json()
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
                "total_per_page"    : 10
                }}))


        data = json.loads(r.content)
        print "_DATA ", data

        for list_id in data["history"]:
            print list_id["uid"]
            cat = File_metadata.get_file_meta(file_name=list_id["uid"])

            if not cat:
                list_id["category"] = "unknow"
            else:
                list_id["category"] = cat.pop()

        return json.dumps(data)

    @app.route('/dc/category_name', methods=["GET"])
    def get_category_name():
        return ConfigLoader.get_categories()
