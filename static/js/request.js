function createRoomRequest(params) {
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/createRoom",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);

            switch (responseData['returnCode']) {
                case 1:
                    console.log('创建成功: 房间ID为' + responseData['roomId']);
                    indexParams = {
                        'code': 'createRoom',
                        'userName': params['id'],
                        'roomTitle': params['roomTitle'],
                        'topicIntro': params['topicIntro'],
                        'roomId': responseData['roomId']
                    }
                    document.cookie = 'code=' + 'createRoom';
                    document.cookie = 'userName=' + params['id'];
                    document.cookie = 'roomTitle=' + params['roomTitle'];
                    document.cookie = 'topicIntro=' + params['topicIntro'];
                    document.cookie = 'roomId=' + responseData['roomId'];
                    var url = '/room';
                    $.ajax({
                        type: 'get',
                        url: url,
                        complete: function () {
                            location.href = url
                        }
                    });
                    return responseData['roomId'];
                case 0:
                    alert('创建失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}



function joinRoomRequest(params) {
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/joinRoom",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);

            switch (responseData['returnCode']) {
                case 1:
                    var storage = window.localStorage;
                    indexParams = {
                        'code': 'joinRoom',
                        'userName': params['id'],
                        'roomId': params['roomId']
                    }
                    document.cookie = 'code=' + 'joinRoom';
                    document.cookie = 'userName=' + params['id'];
                    document.cookie = 'roomId=' + params['roomId'];
                    var url = '/room'
                    $.ajax({
                        type: 'get',
                        url: url,
                        complete: function () {
                            location.href = "room"
                        }
                    });
                    console.log('成功加入');
                    return true;
                case 0:
                    alert('加入失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}

function requestMapStatus(roomId, userName) {
    var host = 'ws://' + window.location.host + '/status/roomId=' + roomId + '&userName=' + userName;
    console.log(roomId + userName);
    var websocket = new WebSocket(host);

    websocket.addEventListener('open', function(e){
        //请求更新成员列表
        requestMemberList({
            'roomId': roomId,
            'userId': userName
        });
        requestMindStartInfo({
            'roomId': roomId,
            'userId': userName
        });
    });

    websocket.addEventListener('message', function(e){
        var returnData = JSON.parse(e.data);
        switch (returnData['returnCode']) {
            case 2: //更新节点
                mindMapNode = JSON.parse(returnData['mindMap']);
                console.log(mindMapNode);
                if (mindMapNode['action'] == 'addNode') {
                    addIdeaNode(mindMapNode['parentNode'], mindMapNode['ideaTitle'], mindMapNode['ideaIntro'], mindMapNode['userId']);
                    // addNews(mindMapNode['userId'] + '添加了' + mindMapNode['ideaTitle']);
                }else{
                    console.log(mindMapNode['nodeId']);
                    removeIdeaNode(mindMapNode['nodeId']);
                }

                break;
            case 3: //公告栏
                addNotice(returnData['notice']);
                break;
            case 4: //参与成员
                if (returnData['action'] == 'addUser') {
                    if (userName != returnData['userId']) {
                        addMember(returnData['userId'], returnData['userType']);
                    }

                } else {
                    removeMember(returnData['userId']);
                }
                break;
            case 5: //最新动态
                addNews(returnData['news']);
                break;
            case 6: //点赞
                var nodeId = returnData['nodeId'];
                var action = returnData['action'];
                voteIdea(nodeId,action)
                break;
            default:
                break;
        }
    });

    websocket.addEventListener('error', function(e){});
}


function updateMindMap(params) {
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/updateMindMap",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);

            switch (responseData['returnCode']) {
                case 1:
                    console.log('成功更新');
                    return true;
                case 0:
                    alert('加入失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}

function requestMemberList(params) {
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/requestMemberList",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);
            switch (responseData['returnCode']) {
                case 1:
                    var memberList = [];
                    memberList = JSON.parse(responseData['memberList']);
                    // console.log(memberList);
                    for (var i = 0; i < memberList.length; i++) {
                        addMember(memberList[i], 1);
                    }
                    break;
                case 0:
                    alert('requestMemberList失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}


function requestMindStartInfo(params) {
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/requestMindStartInfo",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);
            switch (responseData['returnCode']) {
                case 1:
                    mindStartInfo = JSON.parse(responseData['mindStartInfo']);
                    roomTitle = mindStartInfo['roomTitle'];
                    topicIntro = mindStartInfo['topicIntro'];
                    initMindMap();
                    break;
                case 0:
                    alert('requestMindStartInfo失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}

function requestVoteAction(params){
    console.log(params);
    $.ajax({
        type: 'POST',
        url: "/requestVoteAction",
        data: params,
        dataType: 'json',
        success: function (responseData, textStatus, jqXHR) {
            console.log("make success");
            console.log(responseData);

            switch (responseData['returnCode']) {
                case 1:
                    console.log('成功更新');
                    return true;
                case 0:
                    alert('加入失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        },
        error: function (responseData, textStatus, errorThrown) {
            console.log("make error");
            alert('POST failed.');
        }
    });
}