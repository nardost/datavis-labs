from flask import Flask, send_from_directory, Response, json
import random
import itertools
app = Flask(__name__)

def random_links(number):
    nodes = [i for i in range(0, 26)]
    all_possible_links = list(itertools.combinations(nodes, 2))
    random.shuffle(all_possible_links)
    links = []
    for i in range(number):
        link = {"source": all_possible_links[i][0], "target": all_possible_links[i][1], "weight": random.randint(1, 100)}
        links.append(link)
    return links

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)

@app.route("/graph/<number>")
def get_json(number):
    letters = []
    alpha = 'A'
    for i in range(0, 26):
        letters.append(alpha)
        alpha = chr(ord(alpha) + 1)
    graph = {
        "nodes": [{"name": letter, "value": random.randint(0, 26)} for letter in letters],
        "links": random_links(int(number))
    }
    jsn = json.dumps(graph)
    resp = Response(jsn, status=200, mimetype='application/json')
    resp.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    resp.headers['Pragma'] = 'no-cache'
    resp.headers['Expires'] = '0'
    return resp
