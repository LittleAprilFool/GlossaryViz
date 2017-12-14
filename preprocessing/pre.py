import json

nodeList = []

def count_occurrences(word, sentence):
  num = 0
  for sen in sentence:
    if word.islower():
      num = num + sen.lower().count(word.lower())
    else:
      num = num + sen.count(word)
    # the counting function is not perfect
  return num

def calculate_node(chapter, glossary):
  for chapter_item in chapter:
    for glossary_item in glossary:
      number = count_occurrences(glossary_item['term'], chapter_item['content'])
      if number!=0:
        node = {}
        node['chapter_int'] = chapter_item['chapter_int']
        node['section_int'] = chapter_item['section_int'] 
        node['chapter_id'] = chapter_item['chapter_id']
        node['section_id'] = chapter_item['section_id']
        node['term'] = glossary_item['term']
        node['number'] = number
        nodeList.append(node)

def write_file():
  obj = open('node-chapter22.json', 'wb')
  json.dump(nodeList, obj)
  obj.close

def order(chapter):
  for chapter_item in chapter:
    chapter_item['chapter_int'] = chapter_item['chapter_id'].split(' ')[1]
    if (len(chapter_item['section_id'].split('.'))==1):
      chapter_item['section_int'] = "0"
    else:
      chapter_item['section_int'] = chapter_item['section_id'].split('.')[1]
  chapter = sorted(chapter, key=lambda k: k['chapter_int'])
  return chapter

def start(file1, file2):
  with open(file1) as chapter_data:
    with open(file2) as glossary_data:
      chapter = json.load(chapter_data)
      glossary = json.load(glossary_data)
      newchapter = order(chapter)
      calculate_node(newchapter, glossary)
      write_file()

start('chapter22.json','glossary.json')
