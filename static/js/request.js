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
                    alert('创建成功: 房间ID为' + responseData['roomId']);
                    console.log(responseData['roomId']);
                    // id = params.slice(params.search('=') + 1, params.search('&'));
                    requestMapStatus(responseData['roomId'], params['id']);
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
                    requestMapStatus(params['roomId'], params['id']);
                    alert('成功加入');
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
    var host = 'ws://localhost:8000/status/roomId=' + roomId + '&userName=' + userName;
    // var host = 'ws://localhost:8000/status/id=ida&asd=asd';
    console.log(roomId + userName);
    var websocket = new WebSocket(host);

    websocket.onopen = function (evt) {};
    websocket.onmessage = function (evt) {
        var returnData = JSON.parse(evt.data);
        console.log(returnData);
        alert(returnData["mindMap"]);
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