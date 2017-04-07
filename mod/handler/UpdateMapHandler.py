from mod.handler.config import *
class UpdateMapHandler(tornado.web.RequestHandler):
    def post(self):
        logger.info("updateMapHandler")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        mind_map = self.get_argument("mindMap")
        user_id = self.get_argument("userId")
        if not self.application.rooms_manage.update_mind_map(room_id,mind_map,user_id):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        self.write(json.dumps(returnVal))