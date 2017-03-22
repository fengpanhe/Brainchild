const ideaNodeHeight = 204;
const ideaNodeWidth = 304;
const ideaNodeMarginRight = 80;
const ideaNodeMarginTop = 80;
const navHeight = 61;
var rootNode;
var firstLayer;

function Layer(level){
    this.level = level;
    var parentLayer = getLayer(level - 1);
    this.parentLayer = parentLayer;
    parentLayer.childLayer = this;
    this.childNum = 1;
}
function Node(title,contain){
    this.childNum = 0;
    this.title = title;
    this.contain = contain;
    this.parentNode = null;
    this.level = 1;
    this.layerIndex = 1;
    this.id = "root-node";

    this.insertNode = function(node){
        node.parentNode = this;
        node.level = this.level + 1;
        this["child" + ++this.childNum] = node;
        node.layerIndex = 1; //为当前层第几个idea node    
        var currentLayer = getLayer(node.level);
        if(!currentLayer){
            //为当前层第一个idea node
            currentLayer = new Layer(node.level);
        }else{
            node.layerIndex = ++currentLayer.childNum;
            firstLayer.maxChildNum = (currentLayer.childNum > firstLayer.maxChildNum) ? currentLayer.childNum : firstLayer.maxChildNum;
        }
        node.id ="layer" + (node.level) + "-" + (node.layerIndex);
        createIdeaOnMap(node);
    }
    this.removeNode = function(){
        if(this.childNum === 0){
            //无子节点，移除对应div
            var curNodeDiv = document.querySelector("#"+this.id);
            curNodeDiv.parentNode.removeChild(curNodeDiv);
        }else{
            //删除子节点
            var childNum = this.childNum;
            for(var n=1;n<=childNum;n++){
                var childNode = this["child"+n];
                var lineToChild = document.querySelector("#"+this.id+"-to-"+childNode.id);
                lineToChild.parentNode.removeChild(lline);
                childNode.removeNode();
                delete this["child"+n];
            }
            //删除父节点和自己的连线
            var parNode = this.parentNode;
            var lineFromPar = document.querySelector("#"+parNode.id+"-to-"+this.id);
            lineFromPar.parentNode.removeChild(lineFromPar);
            //删除自己
        }
    }
    // var parentNode = findNode(rootNode,document.querySelector(".parent-idea").id);
    // this.level = parentNode.level + 1;
    // this.parentNode = parentNode;
    // parentNode["child" + ++parentNode.childNum] = this;

    
}
function initMindMap(){
    // rootNode = {
    //   level : 1,
    //   childNum : 0,
    //   layerIndex : 1,
    //   id : "root-node",
    //   title : document.querySelector("#topic-title").innerHTML,
    //   contain : document.querySelector("#topic-intro").innerHTML  
    // };
    rootNode = new Node(document.querySelector("#topic-title").innerHTML,document.querySelector("#topic-intro").innerHTML);
    firstLayer = {
        level : 1,
        childNum : 0,
        maxChildNum : 1
    };
    createIdeaOnMap(rootNode);
}

function findNode(root,id){
	var currentNode = root;
	if(currentNode.id == id)
		return currentNode;
	for(var n=0;n<currentNode.childNum;n++){
		var child = currentNode["child"+(n+1)];
		var res = findNode(child,id);
        if(res)
            return res;
	}
	return null;
}
function getLayer(level){
    var target = firstLayer;
    while(level!==1){
        target = target.childLayer;
        level--;
    }
    return target;
}
function createIdeaOnMap(ideaNode){
    var mindmap = document.querySelector("#mindmap");
    //在图中创建idea node
    var container = document.createElement("div");
    container.className = "node-container";
    container.id = ideaNode.id;
    var title = document.createElement("div");
    title.className = "node-title-container";
    title.innerHTML = ideaNode.title;
    container.appendChild(title);
    var contain = document.createElement("div");
    contain.className = "node-contain-container";
    contain.innerHTML = ideaNode.contain;
    container.appendChild(contain);
    mindmap.appendChild(container);
    if(ideaNode.id !== "root-node"){       
        //默认放到父节点正右方
        var parentDiv = document.querySelector("#"+ideaNode.parentNode.id);
        var parentDivRect = parentDiv.getBoundingClientRect();
        container.style.left = (parentDivRect.left + ideaNodeWidth+ ideaNodeMarginRight) +"px";
        container.style.top = parentDivRect.top - navHeight + "px";
        //在SVG图像中画node之间的连线
        var svg = document.querySelector("svg");
        // var line = document.createElement("line");
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.id = ideaNode.parentNode.id + "-to-" + ideaNode.id;
        line.setAttribute("stroke","rgb(68,114,196)");
        line.setAttribute("stroke-width","2");
        line.setAttribute("x1",parentDivRect.left + ideaNodeWidth);
        line.setAttribute("y1",parentDivRect.top - navHeight + ideaNodeHeight/2);
        line.setAttribute("x2",parentDivRect.left + ideaNodeWidth + ideaNodeMarginRight);
        line.setAttribute("y2",parentDivRect.top - navHeight + ideaNodeHeight/2);
        svg.appendChild(line);
        // 根据实际情况调整整个导图各个节点的位置
        adjustMindmap();
    }
}

function adjustMindmap(){
    //只有根节点，不用调整
    if(rootNode.childNum === 0)
        return;
    var maxHeight = firstLayer.maxChildNum*ideaNodeHeight + (firstLayer.maxChildNum - 1)*ideaNodeMarginTop;
    var mindmapHeight = document.querySelector("#mindmap").clientHeight;
    var curLayer = getLayer(2);
    while(curLayer){
        //调整每层所有节点的y方向的分布
        for(var n=1;n<=curLayer.childNum;n++){
            var curId = "layer"+curLayer.level+"-"+n;
            var curNode = findNode(rootNode,curId);
            var parNode = curNode.parentNode;
            var parId = parNode.id;
            var curNodeDiv = document.querySelector("#"+curId);
            var top = (mindmapHeight - maxHeight)/2 + (ideaNodeHeight + ideaNodeMarginTop)*(n-1);
            curNodeDiv.style.top = top + "px";
            // 调整和父节点连线的终点以及和子节点连线的起点
            var lineToParent = document.querySelector("#" + parId + "-to-" + curId);
            lineToParent.setAttribute("y2",top + ideaNodeHeight/2);
            for(var k=1;k<=curNode.childNum;k++){
                var childNode = curNode["child"+k];
                var lineToChild = document.querySelector("#" + curId + "-to-" + childNode.id);
                lineToChild.setAttribute("y1",top + ideaNodeHeight/2);
            }
            
        }
        curLayer = curLayer.childLayer;
    }
}

window.onload = function(){
    initMindMap();
    // var rootNodeDiv = document.querySelector("#"+rootNode.id);
    var newIdea1 = new Node("IDEA TITLE","劝君更尽一杯酒");
    var newIdea2 = new Node("IDEA TITLE","西出阳关无故人");
    var newIdea3 = new Node("IDEA TITLE","醉卧沙场君莫笑");
    var newIdea4 = new Node("IDEA TITLE","古来征战几人回");
    var newIdea5 = new Node("IDEA TITLE","天阶夜色凉如水");
    rootNode.insertNode(newIdea1);
    rootNode.insertNode(newIdea2);
    newIdea2.insertNode(newIdea3);
    newIdea1.insertNode(newIdea4);
    newIdea1.insertNode(newIdea5);
}
