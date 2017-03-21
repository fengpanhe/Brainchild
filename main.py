import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.options

import random
import json
import string
import IPython

import logging

logging.basicConfig(filename='logger.log',level=logging.INFO)
logger = logging.getLogger(__name__)

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
    room_title = ""
    topic_intro = ""
    mind_map = ""
    # callbacks = []
    users = []

    def __init__(self, room_id, room_title, topic_intro, mind_map):
        self.room_id = room_id
        self.room_title = room_title
        self.topic_intro = topic_intro
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

    def create_room(self, room_title, topic_intro, mind_map):

        print("create_room:  room_title:" + room_title + " topic_intro:" + topic_intro + " mind_map:" + mind_map)
        logger.info("Rooms--create_room:  room_title:" + room_title + " topic_intro:" + topic_intro + " mind_map:" + mind_map)

        room_id = ""
        while True:
            for i in range(0, 6):
                room_id = room_id + random.choice('0123456789')
            if not (room_id in self.rooms):
                break
        self.rooms[room_id] = Room(room_id, room_title, topic_intro, mind_map)
        self.roomCount += 1
        return room_id

    def delete_room(self, room_id):
        logger.info("Rooms.delete_room:" + room_id)
        self.rooms.pop(room_id)
        self.roomCount -= 1

    def update_mind_map(self,room_id,mind_map):
        logger.info("Rooms.update_mind_map:" + room_id + " " + mind_map)
        if not (room_id in self.rooms):
            return False
        self.rooms[room_id].update_mind_map(mind_map)
        return True

    def add_user(self,room_id,user):
        logger.info("Rooms.add_user:" + room_id + " " + user.user_name)
        if not (room_id in self.rooms):
            return False
        self.rooms[room_id].add_user(user)
        return True

class IntexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")


class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")


class CreateRoomHandler(tornado.web.RequestHandler):
    def post(self):
        # IPython.embed()
        logger.info("CreateRoomHandler")
        returnVal = dict()
        user_id = self.get_body_argument("id")
        room_title = self.get_argument("roomTitle")
        topic_intro = self.get_argument("topicIntro")
        print("CreateRoomHandler:  user_id:" + user_id + " room_title:" + room_title + " topic_intro:" + topic_intro)
        room_id = self.application.rooms_manage.create_room(room_title, topic_intro, "")
        returnVal["returnCode"] = 1
        returnVal["roomId"] = room_id
        self.write(json.dumps(returnVal))


class JoinRoomHandler(tornado.web.RequestHandler):
    def post(self):
        logger.info("JoinRoomHandler")
        returnVal = dict() 
        user_id = self.get_argument("id")
        room_number = self.get_argument("roomNumber")
        personal_info = self.get_argument("personalInfo")
        print("JoinRoomHandler:  user_id:" + user_id + " room_number:" + room_number + " personal_info:" + personal_info)
        # room_id = self.application.rooms_manage.(room_title, topic_intro, "")
        returnVal["returnCode"] = 1
        # returnVal["roomId"] = room_id
        self.write(json.dumps(returnVal))


class UpdateMapHandler(tornado.web.RequestHandler):
    def post(self):
        logger.info("updateMapHandler")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        mind_map = self.get_argument("mindMap")
        if not self.application.rooms_manage.update_mind_map(room_id,mind_map):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        self.write(json.dumps(returnVal))


class MapStatusHandler(tornado.websocket.WebSocketHandler):
    def open(self,input):
        room_id = input.split('&')[0].split('=')[1]
        user_name = input.split('&')[1].split('=')[1]
        print("room_id = " + room_id + "user_name = " + user_name)
        self.user = User(user_name,self.callback)
        returnVal = dict()
        
        if not self.application.rooms_manage.add_user(room_id,self.user):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        self.write_message(returnVal)
        print("WebSocket opened")
        # self.application.rooms_manage.rooms[input]

    def on_close(self):
        print("WebSocket closed")
        # self.application.rooms.unregister(self.callback)

    def on_message(self, message):
        print(message)
        # self.application.rooms_manage.rooms[message]
        # pass
        
    def callback(self, mindMap):
        returnVal = dict()
        returnVal["returnCode"] = 2
        returnVal["mindMap"] = mindMap
        self.write_message(returnVal)


class Application(tornado.web.Application):
    def __init__(self):
        self.rooms_manage = Rooms()
        handlers = [
            (r'/', IntexHandler),
            (r'/index', IntexHandler),
            # (r'/login', LoginHandler),
            (r'/createRoom', CreateRoomHandler),
            (r'/joinRoom', JoinRoomHandler),
            (r'/updateMindMap', UpdateMapHandler),
            (r'/status/(\w+\=\w+\&\w+\=\w+)', MapStatusHandler)
            
        ]

        settings = {
            'template_path': 'templates',
            'static_path': 'static'
        }
        tornado.web.Application.__init__(self, handlers, **settings)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    print("开始监听")

    app = Application()
    server = tornado.httpserver.HTTPServer(app)
    server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()