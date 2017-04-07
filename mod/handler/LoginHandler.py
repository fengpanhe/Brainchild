from mod.handler.config import *
class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")