from mod.handler.config import *
class JoinRoomHandler(tornado.web.RequestHandler):
    def post(self):
        
        returnVal = dict() 
        user_id = self.get_argument("id")
        room_id = self.get_argument("roomId")
        personal_info = self.get_argument("personalInfo")
        logger.info("JoinRoomHandler:  user_id:" + user_id + " room_id:" + room_id + " personal_info:" + personal_info)
        # room_id = self.application.rooms_manage.(room_title, topic_intro, "")
        returnVal["returnCode"] = 1
        # returnVal["roomId"] = room_id
        self.write(json.dumps(returnVal))