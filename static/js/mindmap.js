// const ideaNodeHeight = 204;
// const ideaNodeWidth = 304;
const ideaNodeMarginRight = 80;
const ideaNodeMarginTop = 80;
const navHeight = 61;
var rootNode;
var firstLayer;
var user;

function Layer(level) {
    this.level = level;
    var parentLayer = getLayer(level - 1);
    this.parentLayer = parentLayer;
    parentLayer.childLayer = this;
    this.childNum = 1;
}

function IdeaNode(title, contain, creatorId) {
    this.creatorId = creatorId;
    this.title = title;
    this.contain = contain;
    this.childNum = 0;
    this.parentNode = null;
    this.level = 1;
    this.layerIndex = 1;
    this.supporterNum = 0;
    this.id = "root-node";
}

IdeaNode.prototype = {
    insertNode : function (node) {
        node.parentNode = this;
        node.level = this.level + 1;
        this["child" + ++this.childNum] = node;
        node.nodeIndex = this.childNum; //为父节点的第几个子节点
        node.layerIndex = 1; //为当前层第几个idea node    
        var currentLayer = getLayer(node.level);
        if (!currentLayer) {
            //为当前层第一个idea node
            currentLayer = new Layer(node.level);
        } else {
            node.layerIndex = ++currentLayer.childNum;
            firstLayer.maxChildNum = (currentLayer.childNum > firstLayer.maxChildNum) ? currentLayer.childNum : firstLayer.maxChildNum;
        }
        node.id = "layer" + (node.level) + "-" + (node.layerIndex);
        // 在导图中渲染节点
        createIdeaOnMap(node);
        // 更新节点中的subtreeHeight
        updateSubtreeHeight(this);
        // 根据实际情况调整整个导图各个节点的位置
        renderMindmap();
    },
    removeNode : function () {
        var parNode = this.parentNode;
        //删除自己对应的div
        var curNodeDiv = document.querySelector("#" + this.id);
        curNodeDiv.parentNode.removeChild(curNodeDiv);
        //删除父节点和自己的连线
        var lineFromPar = document.querySelector("#" + parNode.id + "-to-" + this.id);
        lineFromPar.parentNode.removeChild(lineFromPar);
        removeNodeInLayer(this.level, this.layerIndex);
        if (this.childNum !== 0) {
            //有子节点删除子节点
            while (this.childNum > 0) {
                var childNode = this.child1;
                childNode.removeNode();
            }
        }
        //解除父子关系
        var flag = 0;
        for (var n = 1; n <= parNode.childNum; n++) {
            if (parNode["child" + n].id === this.id && flag === 0)
                flag = n;
            if (flag > 0 && n > flag){
                parNode["child" + n].nodeIndex --;
                parNode["child" + (n - 1)] = parNode["child" + n];
            }
        }
        delete parNode["child" + parNode.childNum--];
        // 更新节点中的subtreeHeight
        updateSubtreeHeight(parNode);
        //调整剩余节点的位置
        renderMindmap();

    }
}

function removeNodeInLayer(level, layerIndex) {
    var curLayer = getLayer(level);
    if (level === 1)
        return;
    if (curLayer) {
        if (curLayer.childNum === 1) //当前层即将为空
            delete curLayer.parentLayer.childLayer;
        else {
            for (var n = layerIndex + 1; n <= curLayer.childNum; n++) {
                //调整layerIndex和id(div和line)
                var id = "layer" + level + "-" + n;
                var node = findNode(rootNode, id);
                var parNode = node.parentNode;
                var div = document.querySelector("#" + id);
                var lineFromPar = document.querySelector("#" + parNode.id + "-to-" + id);
                node.layerIndex--;
                node.id = "layer" + level + "-" + (n - 1);
                div.id = node.id;
                lineFromPar.id = parNode.id + "-to-" + node.id;
                for (var k = 1; k <= node.childNum; k++) {
                    var childNode = node["child" + k];
                    var lineToChild = document.querySelector("#" + "layer" + level + "-" + (layerIndex + 1) + "-to-" + childNode.id);
                    lineToChild.id = node.id + "-to-" + childNode.id;
                }
            }
            curLayer.childNum--;
            //更新maxChildNum
            if (curLayer.childNum + 1 === firstLayer.maxChildNum) {
                firstLayer.maxChildNum--;
                var layer = firstLayer;
                while (layer) {
                    if (layer.childNum > firstLayer.maxChildNum)
                        firstLayer.maxChildNum = layer.childNum;
                    layer = layer.childLayer;
                }
            }
        }
    }
}

function createIdeaOnMap(ideaNode) {
    var mindmap = document.querySelector("#mindmap");
    //在图中创建idea node
    var container = document.createElement("div");
    container.className = "node-container";
    container.id = ideaNode.id;
    var title = document.createElement("div"); //标题
    title.className = "node-title-container";
    title.innerHTML = ideaNode.title;
    container.appendChild(title);
    var contain = document.createElement("div"); //内容
    contain.className = "node-contain-container";
    contain.innerHTML = ideaNode.contain;
    container.appendChild(contain);
    mindmap.appendChild(container);
    var addBtn = document.createElement("button"); //添加节点按钮
    addBtn.className = "node-add-button";
    addBtn.id = ideaNode.id + "-add-btn";
    addBtn.innerHTML = "+";
    addBtn.onclick = onClickAddIdea;
    container.appendChild(addBtn);
    var voteBtn = document.createElement("button"); //点赞按钮
    voteBtn.className = "node-vote-button";
    voteBtn.id = ideaNode.id + "-vote-btn";
    voteBtn.innerHTML = "<i class=\"fa fa-thumbs-o-up\"></i>"
    voteBtn.onclick = onClickVoteBtn;
    title.appendChild(voteBtn);
    var supporterNum = document.createElement("span"); //点赞人数
    supporterNum.className = "node-supporter-num";
    supporterNum.id = ideaNode.id + "-sup-num";
    supporterNum.innerHTML = "0";
    title.appendChild(supporterNum);
    // 记录节点呈现出来的宽度和高度
    ideaNode.width = container.offsetWidth;
    ideaNode.height = container.offsetHeight;
    // 以该节点为根节点的子树的高度
    ideaNode.subtreeHeight = ideaNode.height;
    // 判断该层的最大宽度是否发生了变化
    updateLayerMaxWidth(ideaNode);

    if (ideaNode.id !== "root-node") {
        if (user.getUserType() === 0) {
            //不为根节点且为管理员权限，为每个节点创建删除按钮
            var removeBtn = document.createElement("button");
            removeBtn.className = "node-remove-button";
            removeBtn.id = ideaNode.id + "-remove-btn";
            removeBtn.innerHTML = "-";
            removeBtn.onclick = onClickRemoveIdea;
            container.appendChild(removeBtn);
        }
        //默认放到父节点正右方
        var parentNode = ideaNode.parentNode;
        var parentDiv = document.querySelector("#" + parentNode.id);
        // var parentDivRect = parentDiv.getBoundingClientRect();
        // container.style.left = (parentDiv.offsetLeft + ideaNodeWidth + ideaNodeMarginRight) + "px";
        // container.style.top = parentDiv.offsetTop + "px";
        //在SVG图像中画node之间的连线
        var svg = document.querySelector("svg");
        // var line = document.createElement("line");
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.id = ideaNode.parentNode.id + "-to-" + ideaNode.id;
        line.setAttribute("stroke", "rgb(68,114,196)");
        line.setAttribute("stroke-width", "2");
        line.setAttribute("x1", parentDiv.offsetLeft + parentNode.width);
        line.setAttribute("y1", parentDiv.offsetTop + parentNode.height/2);
        // line.setAttribute("x2", parentDiv.offsetLeft + ideaNodeWidth + ideaNodeMarginRight);
        // line.setAttribute("y2", parentDiv.offsetTop + ideaNodeHeight / 2);
        svg.appendChild(line);
    }else{
        console.log(container);
        container.style.top = document.querySelector("#working-area").offsetHeight/2 - container.offsetHeight/2 + "px";
    }
}
function updateSubtreeHeight(node){
    var nodeHeight = node.height;
    //计算子树应有的总高度（不含该节点本身）
    var subtreeHeight = 0 - ideaNodeMarginTop;
    for(var n=1;n<=node.childNum;n++){
        subtreeHeight += ideaNodeMarginTop + node["child"+n].subtreeHeight;
    }
    node.childrenMaxHeight = subtreeHeight; //以该节点为根节点的子树总高度（不含该节点本身）
    subtreeHeight = (subtreeHeight>nodeHeight) ? subtreeHeight : nodeHeight; 
    if(node.subtreeHeight !== subtreeHeight){
        //该节点的subtreeHeight发生了变化
        node.subtreeHeight = subtreeHeight;
        if(node.parentNode){
            //不为根节点，向上层节点调整subtreeHeight
            updateSubtreeHeight(node.parentNode);
        }else{
            //调整完根节点，判断图是否超过了容器
            var mindmap = document.querySelector("#mindmap");
            var svg = document.querySelector("svg");
            var curHeight = mindmap.offsetHeight;
            var maxHeight = rootNode.subtreeHeight + 2*ideaNodeMarginTop;
            if(maxHeight > curHeight){
                //调整#mindmap和svg的大小
                mindmap.style.height = maxHeight + "px";
                svg.style.height = maxHeight + "px";
                svg.setAttribute("height", maxHeight);
                //调整根节点位置（使其始终垂直居中于容器）
                var rootNodeDiv = document.querySelector("#root-node");
                rootNodeDiv.style.top = maxHeight/2 - rootNodeDiv.offsetHeight/2 + "px";
                console.log(rootNodeDiv.style.top);
                //调整#mindmap位置使得在用户眼中图的位置未变
                mindmap.style.top = parseFloat(mindmap.style.top) - (maxHeight - curHeight)/2 + "px"; 
            }
        }
    }
}
function updateLayerMaxWidth(node){
    var layer = getLayer(node.level);
    if(layer.childNum === 1){
        //为当前层第一个节点
        layer.maxWidth = node.width;
    }else{
        layer.maxWidth = (node.width > layer.maxWidth) ? node.width : layer.maxWidth;
    }
    //图的宽度是否超过了容器
    var curLayer = firstLayer;
    var maxWidth = ideaNodeMarginRight; //全图最大宽度
    while(curLayer){
        maxWidth += curLayer.maxWidth + ideaNodeMarginRight;
        curLayer = curLayer.childLayer;
    }
    var mindmap = document.querySelector("#mindmap");
    var curWidth = mindmap.offsetWidth;
    if(maxWidth > curWidth){
        mindmap.style.width = maxWidth + "px";
        svg.style.width = maxWidth + "px";
        svg.setAttribute("width", maxWidth);
    }
}
function renderMindmap() {
    //只有根节点
    if (rootNode.childNum === 0){
        return;
    }
    //调整根节点和子节点的连线
    var rootNodeDiv = document.querySelector("#root-node");
    for (var k = 1; k <= rootNode.childNum; k++) {
        var childNode = rootNode["child" + k];
        var lineToChild = document.querySelector("#" + "root-node" + "-to-" + childNode.id);
        lineToChild.setAttribute("x1", rootNodeDiv.offsetLeft + rootNode.width);
        lineToChild.setAttribute("y1", rootNodeDiv.offsetTop + rootNode.height / 2);
    }
    //调整其他节点
    var curLayer = getLayer(2);
    while (curLayer) {
        for (var n = 1; n <= curLayer.childNum; n++) {
            var curId = "layer" + curLayer.level + "-" + n;
            var curNode = findNode(rootNode, curId);
            var parNode = curNode.parentNode;
            var parId = parNode.id;
            var parNodeDiv = document.querySelector("#" + parId);
            var curNodeDiv = document.querySelector("#" + curId);
            //根据前一个兄弟节点和父节点计算其y方向位置
            var top;
            if(curNode.nodeIndex === 1){
                top = parNodeDiv.offsetTop + parNodeDiv.offsetHeight/2 - parNode.childrenMaxHeight/2; //起始位置
            }else{
                var previousSibling = parNode["child"+(curNode.nodeIndex-1)]; //前一个兄弟节点
                previousSiblingDiv = document.querySelector("#"+previousSibling.id);
                top = previousSiblingDiv.offsetTop + previousSiblingDiv.offsetHeight/2 + previousSibling.subtreeHeight/2 
                      + ideaNodeMarginTop + curNode.subtreeHeight/2 - curNodeDiv.offsetHeight/2;
            }
            //根据父节点位置和当前层最大宽度计算其x方向位置
            var left = parNodeDiv.offsetLeft + parNode.width/2 + curLayer.parentLayer.maxWidth/2 + ideaNodeMarginRight;
            //调整节点位置
            curNodeDiv.style.left = left + "px";
            curNodeDiv.style.top = top + "px";
            // 调整和父节点连线的终点以及和子节点连线的起点
            var lineFromParent = document.querySelector("#" + parId + "-to-" + curId);
            lineFromParent.setAttribute("x2", left);
            lineFromParent.setAttribute("y2", top + curNode.height/2);
            for (var k = 1; k <= curNode.childNum; k++) {
                var childNode = curNode["child" + k];
                var lineToChild = document.querySelector("#" + curId + "-to-" + childNode.id);
                lineToChild.setAttribute("x1", left + curNode.width);
                lineToChild.setAttribute("y1", top + curNode.height / 2);
            }
        }
        curLayer = curLayer.childLayer;
    }
}

function onClickAddIdea(e) {
    //在点击了idea node上的添加按钮后的处理
    //弹出表单页填写idea的标题和内容
    var body = document.querySelector("body");
    var floatOutDiv = document.createElement("div");
    floatOutDiv.className = "float-out-div";
    floatOutDiv.id = "create-room-form";
    floatOutDiv.innerHTML = "<div class=\"fod-title\">添加IDEA</div><div class=\"fod-container\"><form><label for=\"idea_title\">IDEA标题</label></p><input id=\"idea-title\" type=\"text\" placeholder=\"请简要概括你的idea\" required maxlength=\"15\"><p><label for=\"idea_intro\">IDEA简介</label></p><textarea id=\"idea-intro\" placeholder=\"再对你的idea添加几句描述吧~\" cols=\"30\" rows=\"10\" required maxlength=\"200\"></textarea></form><div class=\"fod-button-container\"><button class=\"fod-button fod-btn-confirm\" id=\"create-idea-confirm\">确定</button><button class=\"fod-button fod-btn-cancel\">取消</button></div></div>"
    body.insertBefore(floatOutDiv, body.childNodes[1]);
    var mask = document.querySelector("#fod-mask");
    mask.style.display = "block";
    document.querySelector("#create-idea-confirm").onclick = function (event) {
        //在表单页点击了确认按钮
        var ideaTitle = document.querySelector("#idea-title").value;
        var ideaIntro = document.querySelector("#idea-intro").value;
        //向服务器发送创建idea的请求
        var mindmapNode = {
            'action': 'addNode',
            'parentNode': e.target.parentNode.id,
            'ideaTitle': ideaTitle,
            'ideaIntro': ideaIntro,
            'userId': userName
        };
        var params = {
            'roomId': roomId,
            'mindMap': JSON.stringify(mindmapNode),
            'userId': userName
        };
        updateMindMap(params);

        //移除表单页
        mask.style.display = "none";
        floatOutDiv.parentNode.removeChild(floatOutDiv);
    }
    document.querySelector(".fod-btn-cancel").onclick = function (event) {
        //在表单页点击了取消按钮，移除表单页
        mask.style.display = "none";
        floatOutDiv.parentNode.removeChild(floatOutDiv);
    }
}


function onClickRemoveIdea(e) {
    //在点击了idea node上的删除按钮后的处理
    var mindmapNode = {
        'action': 'removeNode',
        'nodeId': e.target.parentNode.id,
    };
    var params = {
        'roomId': roomId,
        'mindMap': JSON.stringify(mindmapNode),
        'userId': userName
    };
    updateMindMap(params);
    // var node = findNode(rootNode, div.id);
    // node.removeNode();
}

function onClickVoteBtn(e){
    //点击了点赞按钮
    var nodeId,action;
    if(e.target.className === "node-vote-button"){
        nodeId = e.target.id.slice(0,-9);
    }else{
        nodeId = e.target.parentNode.id.slice(0, -9);
    }
    var ideaNode = findNode(rootNode,nodeId);
    var voteBtn = document.querySelector("#" + nodeId + "-vote-btn");
    //点赞按钮icon变化
    var i = voteBtn.firstChild;
    if(i.classList.contains("fa-thumbs-o-up")){
        // 尚未点赞，点赞数加一
        action = "vote";
        i.classList.remove("fa-thumbs-o-up");
        i.classList.add("fa-thumbs-up");
        // var supNum = ++ideaNode.supporterNum;
        //to do:向服务器发送点赞信息，调用界面更新函数
        // voteIdea(nodeId,supNum);
    }else{
        // 已经点赞，取消点赞
        action = "cancel-vote";
        i.classList.add("fa-thumbs-o-up");
        i.classList.remove("fa-thumbs-up");
        // var supNum = --ideaNode.supporterNum;
        //to do:向服务器取消点赞信息，调用界面更新函数
        // voteIdea(nodeId,supNum);
    }
    var params = {
        'roomId': roomId,
        'action': action,
        'nodeId': nodeId,
        'userId': userName
    };
    requestVoteAction(params);
}

function initMindMap() {
    user = new User(userName, userType);
    rootNode = new IdeaNode(roomTitle, topicIntro, "房主");
    firstLayer = {
        level: 1,
        childNum: 1,
        maxChildNum: 1
    };
    createIdeaOnMap(rootNode);
    //添加拖拽功能
    var rdyToMove = false;
    var beginX, beginY;
    var workingArea = document.querySelector("#working-area");
    var mindmap = document.querySelector("#mindmap");
    if(document.documentElement.clientWidth > 756){
        workingArea.onmousedown = function (e) {
            rdyToMove = true;
            beginX = e.screenX;
            beginY = e.screenY;
        }
        workingArea.onmousemove = function (e) {
            if (rdyToMove) {
                e.target.setAttribute("cursor", "move")
                var dx = (e.screenX - beginX) * 1;
                var dy = (e.screenY - beginY) * 1;
                var x0 = mindmap.offsetLeft;
                var y0 = mindmap.offsetTop;
                mindmap.style.left = x0 + dx + "px";
                mindmap.style.top = y0 + dy + "px";
                beginX = e.screenX;
                beginY = e.screenY;
            }
        }
        workingArea.onmouseup = function (e) {
            rdyToMove = false;
            e.target.setAttribute("cursor", "default")
        }
    }else{
        //触屏拖动支持
        workingArea.addEventListener('touchstart', function(e){
            console.log("touchstart");
            rdyToMove = true;
            beginX = e.touches[0].screenX;
            beginY = e.touches[0].screenY;
        });
        workingArea.addEventListener('touchmove', function(e){
            console.log("touchmove");
            if (rdyToMove) {
                e.target.setAttribute("cursor", "move")
                var dx = (e.touches[0].screenX - beginX) * 1;
                var dy = (e.touches[0].screenY - beginY) * 1;
                var x0 = mindmap.offsetLeft;
                var y0 = mindmap.offsetTop;
                mindmap.style.left = x0 + dx + "px";
                mindmap.style.top = y0 + dy + "px";
                beginX = e.touches[0].screenX;
                beginY = e.touches[0].screenY;
            }
        });
        workingArea.addEventListener('touchend', function(e){
            console.log("touchend");
            rdyToMove = false;
            e.target.setAttribute("cursor", "default")
        });
    }
        //添加缩放功能
        var sx = 100;
        var sy = 100;
        document.querySelector("#scale-map-expand").onclick = function (e) {
            sx += 10;
            sy += 10;
            mindmap.style.transform = "scale(" + (sx / 100) + "," + (sy / 100) + ")";
        };
        document.querySelector("#scale-map-compress").onclick = function (e) {
            if(sx - 10 > 0){
                sx -= 10;
                sy -= 10;
                mindmap.style.transform = "scale(" + (sx / 100) + "," + (sy / 100) + ")";
            }
        };
}

function findNode(root, id) {
    var currentNode = root;
    if (currentNode.id == id)
        return currentNode;
    for (var n = 0; n < currentNode.childNum; n++) {
        var child = currentNode["child" + (n + 1)];
        var res = findNode(child, id);
        if (res)
            return res;
    }
    return null;
}

function getLayer(level) {
    var target = firstLayer;
    while (level !== 1) {
        target = target.childLayer;
        level--;
    }
    return target;
}

