const ideaNodeHeight = 204;
const ideaNodeWidth = 304;
const ideaNodeMarginRight = 80;
const ideaNodeMarginTop = 80;
const navHeight = 61;
var rootNode;
var firstLayer;
var user;

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
        //删除自己对应的div
        var curNodeDiv = document.querySelector("#"+this.id);
        curNodeDiv.parentNode.removeChild(curNodeDiv);
        //删除父节点和自己的连线
        var parNode = this.parentNode;
        var lineFromPar = document.querySelector("#"+parNode.id+"-to-"+this.id);
        lineFromPar.parentNode.removeChild(lineFromPar);
        removeNodeInLayer(this.level,this.layerIndex);
        if(this.childNum !== 0){
            //有子节点删除子节点
            while(this.childNum > 0){
                var childNode = this.child1;
                childNode.removeNode();
            }
        }
        //解除父子关系
        var flag = 0;
        for(var n=1;n<=parNode.childNum;n++){
            if(parNode["child"+n].id === this.id && flag === 0)
                flag = n;
            if(flag > 0 && n > flag)
                parNode["child"+(n-1)] = parNode["child"+n];
        }
        delete parNode["child"+(parNode.childNum--)];
        //调整剩余节点的位置
        adjustMindmap();
    }
}

function removeNodeInLayer(level,layerIndex){
    var curLayer = getLayer(level);
    if(level === 1 )
        return;
    if(curLayer){
        if(curLayer.childNum === 1)//当前层即将为空
            delete curLayer.parentLayer.childLayer;
        else{
            for(var n=layerIndex+1;n<=curLayer.childNum;n++){
                //调整layerIndex和id(div和line)
                var id = "layer"+level+"-"+n;
                var node = findNode(rootNode,id);
                var parNode = node.parentNode;
                var div = document.querySelector("#"+id);
                var lineFromPar = document.querySelector("#"+parNode.id+"-to-"+id);
                node.layerIndex --;
                node.id = "layer"+level+"-"+(n-1);
                div.id = node.id;
                lineFromPar.id = parNode.id+"-to-"+node.id;
                for(var k=1;k<=node.childNum;k++){
                    var childNode = node["child"+k]; 
                    var lineToChild = document.querySelector("#"+"layer"+level+"-"+(layerIndex+1)+"-to-"+childNode.id);
                    lineToChild.id = node.id+"-to-"+childNode.id;
                }
            }
            curLayer.childNum--;
            //更新maxChildNum
            if(curLayer.childNum+1 === firstLayer.maxChildNum){
                firstLayer.maxChildNum--;
                var layer = firstLayer;
                while(layer){
                    if(layer.childNum > firstLayer.maxChildNum)
                        firstLayer.maxChildNum = layer.childNum;
                    layer = layer.childLayer;
                }
            }
        }
    }
}
    
function initMindMap(){
    //to do:将当前页面的user信息保存到变量user中，测试直接用一个类来新建
    user = new User("韩梅梅",0);
    rootNode = new Node(document.querySelector("#topic-title").innerHTML,document.querySelector("#topic-intro").innerHTML);
    firstLayer = {
        level : 1,
        childNum : 1,
        maxChildNum : 1
    };
    createIdeaOnMap(rootNode);
    //添加拖拽功能
    var rdyToMove = false;
    var beginX,beginY;
    var workingArea = document.querySelector("#working-area");
    var mindmap = document.querySelector("#mindmap");
    workingArea.onmousedown = function(e){
        rdyToMove = true;
        beginX = e.screenX;
        beginY = e.screenY;
    }
    workingArea.onmousemove = function(e){
        if(rdyToMove){
            e.target.setAttribute("cursor","move")
            var dx = (e.screenX - beginX)*1;
            var dy = (e.screenY - beginY)*1;
            var x0 = mindmap.offsetLeft;
            var y0 = mindmap.offsetTop;
            mindmap.style.left = x0 + dx + "px";
            mindmap.style.top = y0 + dy + "px";
            beginX = e.screenX;
            beginY = e.screenY;
        }
    }
    workingArea.onmouseup = function(e){
        rdyToMove = false;
        e.target.setAttribute("cursor","default")
    }
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
    var addBtn = document.createElement("button");
    addBtn.className = "node-add-button";
    addBtn.id = ideaNode.id+"-add-btn";
    addBtn.innerHTML = "+";
    addBtn.onclick = onClickAddIdea;
    container.appendChild(addBtn);
    if(ideaNode.id !== "root-node"){       
        if(user.getUserType() === 0){
            //不为根节点且为管理员权限，为每个节点创建删除按钮
            var removeBtn = document.createElement("button");
            removeBtn.className = "node-remove-button";
            removeBtn.id = ideaNode.id+"-remove-btn";
            removeBtn.innerHTML = "-";
            removeBtn.onclick = onClickRemoveIdea;
            container.appendChild(removeBtn);
        }
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

function onClickAddIdea(e){
    //在点击了idea node上的添加按钮后的处理
    //to do:创建float-out-div，用户填写表单，添加确认按钮和取消按钮事件处理程序
    var body = document.querySelector("body");
    var floatOutDiv = document.createElement("div");
    floatOutDiv.className = "float-out-div";
    floatOutDiv.id = "create-room-form";
    floatOutDiv.innerHTML = "<div class=\"fod-title\">添加IDEA</div><div class=\"fod-container\"><form><label for=\"idea_title\">IDEA标题</label></p><input id=\"idea-title\" type=\"text\" placeholder=\"请简要概括你的idea\" required maxlength=\"15\"><p><label for=\"idea_intro\">IDEA简介</label></p><textarea id=\"idea-intro\" placeholder=\"再对你的idea添加几句描述吧~\" cols=\"30\" rows=\"10\" required maxlength=\"200\"></textarea></form><div class=\"fod-button-container\"><button class=\"fod-button fod-btn-confirm\" id=\"create-idea-confirm\">确定</button><button class=\"fod-button fod-btn-cancel\">取消</button></div></div>"
    body.insertBefore(floatOutDiv, body.childNodes[1]);
    var mask = document.querySelector("#fod-mask");
    mask.style.display = "block";
    document.querySelector("#create-idea-confirm").onclick = function(event){
        //在表单页点击了确认按钮
        var ideaTitle = document.querySelector("#idea-title").value;
        var ideaIntro = document.querySelector("#idea-intro").value;
        //to do:向服务器发送创建idea的请求
        var parNode = findNode(rootNode,e.target.parentNode.id);
        var childNode = new Node(ideaTitle,ideaIntro);
        parNode.insertNode(childNode);
        //移除表单页
        mask.style.display = "none";
        floatOutDiv.parentNode.removeChild(floatOutDiv);
    }
    document.querySelector(".fod-btn-cancel").onclick = function(event){
        //在表单页点击了取消按钮，移除表单页
        mask.style.display = "none";
        floatOutDiv.parentNode.removeChild(floatOutDiv);
    }
}
function onClickRemoveIdea(e){
    //在点击了idea node上的删除按钮后的处理
    var div = e.target.parentNode;
    var node = findNode(rootNode,div.id);
    node.removeNode();
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
            // var top = (mindmapHeight - maxHeight)/2 + (ideaNodeHeight + ideaNodeMarginTop)*(n-1);
            var marginTop = (maxHeight - (curLayer.childNum)*ideaNodeHeight)/(curLayer.childNum + 1);
            var top = (mindmapHeight - maxHeight)/2 + marginTop*n + ideaNodeHeight*(n-1);
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
    // newIdea4.removeNode();
    // newIdea2.removeNode();
}
