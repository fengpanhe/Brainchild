from mod.handler.config import *


class VoteActionHandler(tornado.web.RequestHandler):
    def post(self):
        logger.info("VoteActionHandler")
        returnVal = dict()

        room_id = self.get_argument("roomId")
        user_id = self.get_argument("userId")
        action = self.get_argument("action")
        node_id = self.get_argument("nodeId")
        
        rooms_manage = self.application.rooms_manage
        if rooms_manage.vote_action(room_id, user_id, action, node_id):
            returnVal["returnCode"] = 1
        else:
            returnVal["returnCode"] = 0
        self.write(json.dumps(returnVal))