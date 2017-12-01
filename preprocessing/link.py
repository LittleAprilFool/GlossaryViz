import json

linkList = []

def calculateLink(node):
  for i in range(len(node)):
    for j in range(i+1, len(node)):
      if node[i]['term'] == node[j]['term']:
        link = {}
        link['source'] = i
        link['target'] = j
        linkList.append(link)


def write_file():
  obj = open('link-middle.json', 'wb')
  json.dump(linkList, obj)
  obj.close

def start(file):
  with open(file) as node_data:
    node = json.load(node_data)
    calculateLink(node)
    write_file()

start('node-middle.json')