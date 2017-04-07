from mod.handler.config import *
class RequestMindStartInfo(tornado.web.RequestHandler):
    def post(self):
        logger.info("RequestMindStartInfo")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        user_id = self.get_argument("userId")
        result = self.application.rooms_manage.get_room_mind_start(room_id,user_id)
        if not result:
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
            returnVal['mindStartInfo'] = json.dumps(result)
        self.write(json.dumps(returnVal))