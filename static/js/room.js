var roomNumber;
function initRoom(){
    //info div点击按钮隐藏功能
    var hiddeBtns = document.querySelectorAll(".info-div-btn");
    for(var n=0;n<hiddeBtns.length;n++){
        hiddeBtns[n].onclick = function(e){
            var btn = e.target;
            var infoDiv = btn.parentNode;
            if(btn.classList.contains("info-div-btn-hidde")){
                //点击时info div处于隐藏状态
                btn.classList.remove("info-div-btn-hidde");
                infoDiv.style.right = "40px";
                infoDiv.style.opacity = "1.0";
                btn.style.transform = "";
            }else{
                //点击时info div处于非隐藏状态
                btn.classList.add("info-div-btn-hidde");
                infoDiv.style.right = "-22%";
                infoDiv.style.opacity = "0.7";
                btn.style.transform = "rotate(180deg)";
            }
        }
    }
    //to do: 获取房间号
    roomNumber = document.querySelector("#room-number-message").innerHTML;
    
    console.log(window.roomNumber);
    // document.querySelector("#topic-intro").innerHTML = "[房间号"+roomNumber+"]:邀请同伴加入吧~";
    addNotice("邀请同伴加入吧~");
    //to do: 初始化成员列表
}
function addMember(id,type){
    //成员列表添加成员
    var li = document.createElement("li");
    li.classList.add("contributor");
    if(type === 1) //管理员类型的用户
        li.classList.add("admin");
    else if(type === 2) //为当页用户
        li.classList.add("me");
    li.innerHTML = "<i class=\"fa fa-user-circle\"></i> " + id;
    var ul = document.getElementById("contributor-container").getElementsByTagName("ul")[0];
    ul.appendChild(li);
}
function addNotice(notice){
    //发布公告
    var noticeDiv = document.querySelector("#topic-intro");
    noticeDiv.innerHTML = "<strong>[ 房间号"+roomNumber+" ] :</strong> " + notice;
}
function addNews(hour,minute,news){
    var ul = document.getElementById("news-container").getElementsByTagName("ul")[0];
    var li = document.createElement("li");
    li.innerHTML = "["+hour+":"+minute+"] " + news;
    ul.appendChild(li);
}
