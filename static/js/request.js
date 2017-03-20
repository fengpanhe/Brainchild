function createRoomRequest(params) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    xmlhttp.open('POST', '/createRoom');
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function () {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200)) {
            var res = JSON.parse(xmlhttp.responseText);
            switch (res.returnCode){
                case 1:
                    alert('创建成功: 房间ID为' + res.roomId);
                    return true;
                case 0:
                    alert('创建失败');
                    return false;
                default:
                 alert('未知错误');
                return false;
            }
        }
    }
}

function joinRoomRequest(params) {
    var xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    
    xmlhttp.open('POST', '/joinRoom');
    xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xmlhttp.send(params);
    xmlhttp.onreadystatechange = function () {
        if ((xmlhttp.readyState === 4) && (xmlhttp.status === 200)) {
            var res = JSON.parse(xmlhttp.responseText);
            switch (res.returnCode){
                case 1:
                    alert('成功加入');
                    return true;
                case 0:
                    alert('创建失败');
                    return false;
                default:
                 alert('未知错误');
                return false;
            }
        }
    }
}