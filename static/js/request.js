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
    var host = 'ws:' + window.location.host + '/status/roomId=' + roomId + '&userName=' + userName;
    console.log(roomId + userName);
    var websocket = new WebSocket(host);

    websocket.onopen = function (evt) {
        params = {
            'roomId': roomId,
            'userId': userName
        }
        var memberList = requestMemberList(params);
        console.log(memberList);
    };
    websocket.onmessage = function (evt) {
        var returnData = JSON.parse(evt.data);
        switch (returnData['returnCode']) {
            case 2: //更新节点
                mindMapNode = JSON.parse(returnData['mindMap']);
                console.log(mindMapNode);
                addIdeaNode(mindMapNode['parentNode'], mindMapNode['ideaTitle'], mindMapNode['ideaIntro'], mindMapNode['userId']);
                break;
            case 3: //公告栏
                addNotice(returnData['notice']);
                break;
            case 4: //参与成员
                if (returnData['action'] == 'addUser') {
                    addMember(returnData['userId'], returnData['userType']);
                } else {
                    removeMember(returnData['userId']);
                }
                break;
            case 5: //最新动态
                var date = new Date();
                addNews(date.getHours(), date.getMinutes(), returnData['news']);
                break;
            default:
                break;
        }
    };
    websocket.onerror = function (evt) {};
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
                    alert('成功更新');
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
    var memberList = [];
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
                    memberList = JSON.parse(responseData['memberList']);
                    console.log(memberList);

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
    return memberList;
}