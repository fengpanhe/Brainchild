import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.options

import random
import string


class User(object):
    user_name = ""
    callback = ""

    def __init__(self, name, callback):
        self.user_name = name
        self.callback = callback

    def get_callback(self):
        return self.callback


class Room(object):
    room_id = ""
    room_name = ""
    room_des = ""
    mind_map = ""
    # callbacks = []
    users = []

    def __init__(self, room_id, room_name, room_des, mind_map):
        self.room_id = room_id
        self.room_name = room_name
        self.room_des = room_des
        self.mind_map = mind_map
        # self.callbacks.append(callbacks)

    def add_user(self, user):
        self.users.append(user)

    def remove_user(self, user):
        self.users.remove(user)

    def update_mind_map(self, mind_map):
        self.mind_map = mind_map
        self.notify_callbacks()

    def get_mind_map(self):
        return self.mind_map

    def notify_callbacks(self):
        for user in self.users:
            callback = user.get_callback()
            callback(self.get_mind_map())


class Rooms(object):
    roomCount = 0
    rooms = {}

    def create_room(self, room_name, room_des, mind_map):
        room_id = ""
        while True:
            for i in range(0, 6):
                room_id = room_id + random.choice('0123456789')
            if not (room_id in self.rooms):
                break
        self.rooms[room_id] = Room(room_id, room_name, room_des, mind_map)
        self.roomCount += 1
        return room_id

    def delete_room(self, room_id):
        self.rooms.pop(room_id)
        self.roomCount -= 1


class IntexHandler(tornado.web.RequestHandler):

    def get(self):
        self.render("./index.html")


class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")


class mapStatusHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        self.application
        # self.application.rooms_manage.rooms[input]

    def on_close(self):
        self.application.rooms.unregister(self.callback)

    def on_message(self, message):
        pass
        
    def callback(self, mindMap):
        self.write_message('{"inventoryCount":"%d"}')


class Application(tornado.web.Application):
    def __init__(self):
        rooms_manage = Rooms()
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