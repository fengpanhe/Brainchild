function initFODs() {
	var body = document.getElementsByTagName("body")[0];
	var createRoomBtn = document.getElementById("create-mindmap");
	/*点击创建房间按钮*/
	createRoomBtn.onclick = function (e) {
		var floatOutDiv = document.createElement("div");
		floatOutDiv.className = "float-out-div";
		floatOutDiv.id = "create-room-form";
		floatOutDiv.innerHTML = "<div class=\"fod-title\">创建房间</div><div class=\"fod-container\"><form><p><label for=\"creator_id\">你的ID</label></p><input id=\"master-id\" type=\"text\" placeholder=\"ID(15个字以内)\" required maxlength=\"15\"><p><label for=\"room_title\">房间名</label></p><input id=\"room-title\" type=\"text\" placeholder=\"房间名(15个字以内)\" required maxlength=\"15\"><p><label for=\"topic_intro\">话题简介</label></p><textarea id=\"topic-intro\" placeholder=\"简介(200字以内)\" cols=\"30\" rows=\"10\" required maxlength=\"200\"></textarea></form><div class=\"fod-button-container\"><button class=\"fod-button fod-btn-confirm\" id=\"create-room-confirm\">确定</button><button class=\"fod-button fod-btn-cancel\">取消</button></div></div>"
		body.insertBefore(floatOutDiv, body.childNodes[1]);
		var mask = document.getElementById("fod-mask");
		mask.style.display = "block";
		/*在创建房间信息输入页面点击确认按钮*/
		var createRoomConfirm = document.getElementById("create-room-confirm");
		createRoomConfirm.onclick = function (e) {
			var id = document.getElementById("master-id").value.trim();
			var roomTitle = document.getElementById("room-title").value.trim();
			var topicIntro = document.getElementById("topic-intro").value.trim();
			if (id === "" || roomTitle === "" || topicIntro === "") {
				alert("请将信息填写完整!")
			} else {
				mask.style.display = "none";
				body.removeChild(floatOutDiv);
			}
			// to do:向服务器发送创建房间的信息和请求
			// var childDocument = roomWindow.document;
			// var p = childDocument.createElement("p");
			// p.className = "message";
			// p.id = "room-number-message";
			// p.innerHTML = "123";
			// childDocument.body.appendChild(p);
			// roomWindow.document.write("<p class=\"message\" id=\"room-number-message\">123</p>");
			// roomWindow.roomNumber = "123";
			var params = {
				'id': id,
				'roomTitle': roomTitle,
				'topicIntro': topicIntro
			};
			var roomId = createRoomRequest(params);
			
			// to do:跳转到工作界面
		}
		/*在创建房间信息输入页面点击取消按钮*/
		var createRoomCancel = document.getElementsByClassName("fod-btn-cancel")[0];
		createRoomCancel.onclick = function (e) {
			mask.style.display = "none";
			body.removeChild(floatOutDiv);
		}
	};
	/*点击加入房间按钮*/
	var joinWorkBtn = document.getElementById("join-work");
	joinWorkBtn.onclick = function (e) {
		var floatOutDiv = document.createElement("div");
		floatOutDiv.className = "float-out-div";
		floatOutDiv.id = "join-work-form";
		floatOutDiv.innerHTML = "<div class=\"fod-title\">加入工作</div><div class=\"fod-container\"><form><p><label for=\"worker_id\">你的ID</label></p><input id=\"worker-id\" type=\"text\" placeholder=\"ID(15个字以内)\" required maxlength=\"15\"><p><label for=\"room_number\">房间号</label></p><input id=\"room-number\" type=\"text\" placeholder=\"房间号\" required maxlength=\"15\"><p><label for=\"personal_info\">验证信息</label></p><textarea id=\"personal-info\" placeholder=\"请输入验证信息以供管理员审核(200字以内)\" cols=\"30\" rows=\"10\" required maxlength=\"200\"></textarea></form><div class=\"fod-button-container\"><button class=\"fod-button fod-btn-confirm\" id=\"join-work-confirm\">确定</button><button class=\"fod-button fod-btn-cancel\">取消</button></div></div>"
		body.insertBefore(floatOutDiv, body.childNodes[1]);
		var mask = document.getElementById("fod-mask");
		mask.style.display = "block";
		/*在加入工作信息输入页面点击确认按钮*/
		var joinWorkConfirm = document.getElementById("join-work-confirm");
		joinWorkConfirm.onclick = function (e) {
			var id = document.getElementById("worker-id").value.trim();
			var roomNumber = document.getElementById("room-number").value.trim();
			var personalInfo = document.getElementById("personal-info").value.trim();
			if (id === "" || roomNumber === "" || personalInfo === "") {
				alert("请将信息填写完整!")
			} else {
				mask.style.display = "none";
				body.removeChild(floatOutDiv);

			}
			console.log("b");
			var params = {
				'id': id,
				'roomId': roomNumber,
				'personalInfo': personalInfo

			};
			joinRoomRequest(params);
			// to do:跳转到工作界面
		}
		var joinWorkCancel = document.getElementsByClassName("fod-btn-cancel")[0];
		joinWorkCancel.onclick = function (e) {
			mask.style.display = "none";
			body.removeChild(floatOutDiv);
		}
	}
}

function initNavMenu(){
	//在小尺寸屏幕上的导航栏菜单按钮功能
	var menu = document.querySelector("#menu"); 
	menu.onclick = function(e){
		var nav = menu.parentNode;
		nav.classList.toggle("expand");
		//改图标为关闭
		var icon = menu.firstChild;
		if(icon.classList.contains("fa-bars")){
			icon.classList.remove("fa-bars");
			icon.classList.add("fa-times");
		}else{
			icon.classList.add("fa-bars");
			icon.classList.remove("fa-times");			
		}
	};
}

$(document).ready(function(){
	initFODs();
	initNavMenu();
})