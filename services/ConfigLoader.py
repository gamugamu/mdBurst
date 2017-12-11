# coding: utf8
import ConfigParser
import json

configParser = ConfigParser.RawConfigParser()
configParser.read("mdBurstConfig.txt")

def get(configName):
    return configParser.get('Config_url', configName).replace('"', "")

def get_categories():
    categories = configParser.get('categorie', 'categorie').replace('"', "")
    return json.dumps(categories.split(","))
