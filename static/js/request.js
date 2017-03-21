function createRoomRequest(params) {
    // var xmlhttp;
    // if (window.XMLHttpRequest) {
    //     xmlhttp = new XMLHttpRequest();
    // } else {
    //     xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    // }

    // xmlhttp.open('POST', '/createRoom');
    // xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // xmlhttp.send(params);
    // xmlhttp.onreadystatechange = function () {
    //     if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200)) {
    //         var res = JSON.parse(xmlhttp.responseText);
    //         switch (res.returnCode) {
    //             case 1:
    //                 alert('创建成功: 房间ID为' + res.roomId);
    //                 console.log(res.roomId);
    //                 id = params.slice(params.search('=') + 1, params.search('&'));
    //                 requestMapStatus(res.roomId, id);
    //                 return res.roomId;
    //             case 0:
    //                 alert('创建失败');
    //                 return false;
    //             default:
    //                 alert('未知错误');
    //                 return false;
    //         }
    //     }
    // }

    $.ajax({
        type: 'POST',
        url: '/createRoom',
        data: params,
        dataType:'json'
    });
}

function joinRoomRequest(params) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xmlhttp.open('POST', '/joinRoom');
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function () {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200)) {
            var res = JSON.parse(xmlhttp.responseText);
            switch (res.returnCode) {
                case 1:
                    alert('成功加入');
                    return true;
                case 0:
                    alert('加入失败');
                    return false;
                default:
                    alert('未知错误');
                    return false;
            }
        }
    }
}

function requestMapStatus(roomId, userName) {
    var host = 'ws://localhost:8000/status/roomId=' + roomId + '&userName=' + userName;
    // var host = 'ws://localhost:8000/status/id=ida&asd=asd';
    console.log(roomId + userName);
    var websocket = new WebSocket(host);

    websocket.onopen = function (evt) {};
    websocket.onmessage = function (evt) {
        alert(evt.data);
    };
    websocket.onerror = function (evt) {};
}