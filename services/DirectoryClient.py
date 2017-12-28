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

        return r.content

    @app.route('/dc/post', methods=["POST"])
    def post():
        post        = request.get_json()

        payload     = post["payload"]
        title       = post["title"]
        category    = post["category"]

        for idx, image_64 in enumerate(post["image_base_64"]):
            # Cloudinary
            image_tag   = "data:image_" + str(idx)
            image_Link  = Cloudinary.upload_image(image_64)
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
            file_uid = result["filepayload"]["uid"]
            File_metadata.select_category_to_file(file_name=file_uid, category=category)

            for tag in post["tags"]:
                File_metadata.set_tag_to_file(file_name=file_uid, tag=tag)
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

        for list_id in data["history"]:
            file_id = list_id["uid"]
            cat     = File_metadata.get_file_category(file_name=file_id)
            tags    = File_metadata.get_tags_from_file(file_name=file_id)
            print "TAGS ", tags
            list_id["tags"] = list(tags)

            if not cat:
                list_id["category"] = "unknow"
            else:
                list_id["category"] = cat.pop() # Les catégories sont dans des tableaux. Mais pas nécessaire.

        return json.dumps(data)

    @app.route('/dc/searchByTags/<tags>', methods=["GET"])
    def search_by_tag(tags):
         files = File_metadata.get_files_by_tag(tags)
         return json.dumps(list(files))

    @app.route('/dc/category_name', methods=["GET"])
    def get_category_name():
        return ConfigLoader.get_categories()
