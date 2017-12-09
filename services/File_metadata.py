# coding: utf8
import Dbb
import time

#by date
def select_category_to_file(file_name, category):
    print "TIME ", time.time()
    Dbb.add_for_sorting(category, file_name, "date", time.time())
    user            = Dbb.collection_for_Key(typeKey=Type.USER.name, key=user_id)
    user["group"]   = Dbb.removedValue(user["group"], group_id)
    Dbb.sadd("META_" + file_name, category)

def get_file_meta(file_name):
    return Dbb.smember(key=file_name):


# by date
def get_file_for_category(category, start, num):
    list_by_date = Dbb.sort(
        member  = category,
        by      = "*->date",
        desc    = True,
        start   = start,
        num     = num)
    return list_by_date
