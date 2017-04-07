from mod.handler.config import *
class CreateRoomHandler(tornado.web.RequestHandler):
    def post(self):
        # IPython.embed()
        user_id = self.get_body_argument("id")
        room_title = self.get_argument("roomTitle")
        topic_intro = self.get_argument("topicIntro")

        logger.info(self.__class__.__name__ + ":user_id:" + user_id + " room_title:" + room_title + " topic_intro:" + topic_intro)

        returnVal = dict()
        room_id = self.application.rooms_manage.create_room(room_title, topic_intro, "",user_id)
        returnVal["returnCode"] = 1
        returnVal["roomId"] = room_id
        self.write(json.dumps(returnVal))