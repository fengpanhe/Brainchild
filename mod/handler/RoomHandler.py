from mod.handler.config import *
class RoomHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./room.html")