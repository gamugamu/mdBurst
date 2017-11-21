var ROOT_DIRECTORY_API_SERVICE = "" // feed by main

class Node {
  constructor(parent) {
    this.childs   = [];
    this.parent   = parent;
    this.uid      = "";
    this.name     = "";
  }

  description(){
    console.log("name:", this.name, "childs", this.childs);
  }

  flattenedGraph(queue){
    queue.push(this)
    for (var i = 0; i < this.childs.length; i++) {
      var child = this.childs[i];
      child.flattenedGraph(queue);
    }
    return queue
  }
}

function hl_graph($http, callback) {
  $http({
    method:   'GET',
    url:      ROOT_DIRECTORY_API_SERVICE + '/dc/graph'
  }).then(function(response) {
    callback(make_graph(response.data))
  });
};

function hl_feed_graph(payload, graph, callback){
  console.log("hl_feed_graph");
  for (var node in graph) {
    if (payload.uid === graph[node].uid){
        graph[node].payload = decodeHtml(payload.payload)
        callback(node)
    }
  } // for
}

function make_graph(listMd){
  for (var property in listMd["graph"]) {
    if (listMd["graph"].hasOwnProperty(property)) {
      // do stuff
      var nodes       = [];
      var parentNode  = new Node();
      recurse(listMd["graph"][property], parentNode)
      return parentNode
    } // if
    return null
  } // for
}

function recurse(graph, parentNode){
  for(var [key, value] of Object.entries(graph)) {
    if(value instanceof Object){
      var node  = new Node(parentNode);
      node.uid  = value["uid"];
      node.name = key;
      parentNode.childs.push(node)

      if(Object.keys(value).length > 1) /* possède des enfants */{
        recurse(value, node)
      }
    } // if
  }// for
}
