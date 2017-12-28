# coding: utf8
import Dbb
import time

#by date
def select_category_to_file(file_name, category):
    Dbb.add_for_sorting(category, file_name, "date", time.time())
    Dbb.sadd("META_" + file_name, category)

def get_file_category(file_name):
    return Dbb.smembers(key="META_"+file_name)


# by date
def get_files_for_category(category, start, num):
    list_by_date = Dbb.sort(
        member  = category,
        by      = "*->date",
        desc    = True,
        start   = start,
        num     = num)
    return list_by_date

# by tag
def set_tag_to_file(file_name, tag):
    Dbb.sadd("TAG_" + tag, file_name)
    Dbb.sadd("TAGGED_" + file_name, tag)

def get_files_by_tag(tag):
    return Dbb.smembers(key="TAG_" + tag)

def get_tags_from_file(file_name):
    return Dbb.smembers(key="TAGGED_" + file_name)
