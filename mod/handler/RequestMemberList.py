from mod.handler.config import *
class RequestMemberList(tornado.web.RequestHandler):
    def post(self):
        logger.info("RequestMemberList")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        user_id = self.get_argument("userId")
        result = self.application.rooms_manage.get_room_member_list(room_id,user_id)
        if not result:
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
            returnVal['memberList'] = json.dumps(result)
        self.write(json.dumps(returnVal))