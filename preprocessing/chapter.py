import json

newChapter = []

def updateChapter(node):
  for section in node:
    if section["section_id"] =="0":
      section["section_id"] = "Section "+ section["chapter_id"].split(' ')[1]+".0"

    section["id"] = float(section["section_id"].split(' ')[1])

    print int(section["chapter_id"].split(' ')[1]) < 5
    print section["id"]
    if int(section["chapter_id"].split(' ')[1]) < 5:
      newChapter.append(section)
  
  sorted(newChapter, key=lambda k: k.get('id', 0), reverse=True)

    
    

def write_file():
  obj = open('chapter4.json', 'wb')
  json.dump(newChapter, obj)
  obj.close

def start(file):
  with open(file) as node_data:
    node = json.load(node_data)
    updateChapter(node)
    write_file()

start('chapter.json')