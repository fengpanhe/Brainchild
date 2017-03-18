import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.options

import random
import string

class Room(object):
    roomID = ""
    mindMap = ""
    callbacks = []

    def __init__(self,roomID,mindMap):
        self.roomID = roomID
        self.mindMap = mindMap
        # self.callbacks.append(callbacks)

    def addCallback(self,callback):
        self.callbacks.append(callback)

    def removeCallback(self,callback):
        self.callbacks.remove(callback)

    def updateMindMap(self,mindMap):
        self.mindMap = mindMap
        self.notifyCallbacks()

    def getMindMap(self):
        return self.MindMap

    def notifyCallbacks(self):
        for callback in self.callbacks:
            callback(self.getMindMap())

class Rooms(object):
    roomCount = 0
    rooms = {}

    def createRoom(self):
        roomId = ""
        while True:
            for i in range(0,6):
                roomId = roomId + random.choice('0123456789')
            if not (roomId in self.rooms):
                break
        self.rooms[roomId] = Room(roomId, "")
        return roomId

    def deleteRoom(self, mapID):
        self.maps.pop(mapID)

    
    


class IntexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")

class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")

class mapStatusHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        self.application.shoppingCart.register(self.callback)

    def on_close(self):
        self.application.shoppingCart.unregister(self.callback)

    def on_message(self, message):
        pass
        
    def callback(self, mindMap):
        self.write_message('{"inventoryCount":"%d"}' % count)

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