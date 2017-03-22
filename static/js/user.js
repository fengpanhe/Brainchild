function User(id,type){
    var user_id = id;
    var user_type = type; //0为管理员 1为用户
    //to do:向服务器请求当前页面的用户id
    //to do:向服务器请求当前页面的用户类型
    this.getUserId = function(){
        return user_id;
    }; 
    this.getUserType = function(){
        return user_type;
    } ;
}