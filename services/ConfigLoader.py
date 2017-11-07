import ConfigParser


configParser = ConfigParser.RawConfigParser()
configParser.read("mdBurstConfig.txt")

def get(configName):
    return configParser.get('Config_url', configName).replace('"', "")
