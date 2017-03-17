import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.options


class room(object):
    roomID = 000000
    mindMap = ""
    callbacks = []

    def __init__(self,roomID,mindMap,callbacks):
        self.roomID = roomID
        self.mindMap = mindMap
        self.callbacks.append(callbacks)

    def addCallback(self,callback):
        self.callbacks.append(callback)

    def removeCallback(self,callback):
        self.callbacks.remove(callback)

    def updateMindMap(self,mindMap):
        self.mindMap = mindMap

    def get

class MindMaps(object):
    mapCount = 1
    maps = {
        "000000" : "json"
    }
    callbacks = []

    def register(self, callback):
        self.callbacks.append(callback)

    def unregister(self, callback):
        self.callbacks.remove(callback)

    def createMindMap(self):
        return 

    def deleteMindMap(self, mapID):
        self.maps.pop(mapID)

    
    


class IntexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")

class Application(tornado.web.Application):
    def __init__(self):

        handlers = [
            (r'/', IntexHandler),
            (r'/index', IntexHandler),
            (r'/login', LoginHandler)
        ]

        settings = {
            'template_path': 'templates',
            'static_path': 'static'
        }
        tornado.web.Application.__init__(self, handlers, **settings)

if __name__ == '__main__':
    tornado.options.parse_command_line()

    app = Application()
    server = tornado.httpserver.HTTPServer(app)
    server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()