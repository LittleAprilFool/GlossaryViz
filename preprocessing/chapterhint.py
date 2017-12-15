import json
from copy import copy

def super_find(sentence, word):
  sentence = sentence.upper()
  word = word.upper()
  
  pos = len(sentence)

  if sentence.startswith(word+" "):
    pos0 = 0
    if pos0 < pos:
      pos = pos0
  if sentence.endswith(" "+word):
    pos0 = len(sentence) - len(word)
    if pos0 < pos:
      pos = pos0
  if sentence.find(" "+word+" ") != -1:
    pos0 = sentence.find(" "+word+" ")+ 1
    if pos0 < pos:
      pos = pos0
  if sentence.find(" "+word+".") != -1:
    pos0 = sentence.find(" " + word + ".")+1
    if pos0 < pos:
      pos = pos0
  if sentence.find(" "+word+",") != -1:
    pos0 = sentence.find(" " + word + ",")+1
    if pos0 < pos:
      pos = pos0

  if pos==len(sentence):
    pos = -1
  
  return pos

def smart_find(sentence, word):
    indexGroup = []
    tmpsentence = sentence
    eeindex = 0
    while(super_find(tmpsentence, word)!=-1):
      start_index = super_find(tmpsentence, word)
      end_index = start_index + len(word)
      indexGroup.append(start_index + eeindex)
      tmpsentence = tmpsentence[end_index:]
      eeindex += end_index
    newsentence = sentence
    for i in indexGroup[::-1]:
      newsentence = newsentence[:i] + "<span class='mark-"+ word.replace(' ', '_') + " mark'>"+newsentence[i:i+len(word)] + "</span>" + newsentence[i+len(word):]
    return newsentence

def calculateHint(chapter, glossary):
  for term in glossary:
    for achapter in chapter:
      for index, sentence in enumerate(achapter['content']):
        newsentence = smart_find(sentence, term['term'])
        achapter['content'][index] = newsentence
  return chapter
  


def write_file(newChapter):
  print newChapter
  obj = open('chapter-hint-full.json', 'wb')
  json.dump(newChapter, obj)
  obj.close

def start(file1, file2):
  with open(file1) as chapter_data:
    with open(file2) as glossary_data:
      chapter = json.load(chapter_data)
      glossary = json.load(glossary_data)
      newChapter = calculateHint(chapter, glossary)
      write_file(newChapter)

start('chapter-full.json', 'glossary.json')