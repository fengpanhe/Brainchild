from mod.handler.config import *

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")