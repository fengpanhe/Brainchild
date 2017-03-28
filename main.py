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
import sys

logging.basicConfig(stream=sys.stdout)
logger = logging.getLogger()
handler = logging.StreamHandler()
formatter = logging.Formatter(
        '%(asctime)s %(name)s %(levelname)s %(pathname)s  %(lineno)d %(funcName)s %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)



class User(object):
    # user_name = ""
    # callback = ""

    def __init__(self, name, callback):
        self.user_name = name
        self.callback = callback

    def get_callback(self):
        return self.callback


class Room(object):
    # room_id = ""
    # room_title = ""
    # topic_intro = ""
    # mind_map = ""
    # creator_id = ""
    # users = []
    # member_list = []

    def __init__(self, room_id, room_title, topic_intro, mind_map, creator_id):
        self.room_id = room_id
        self.room_title = room_title
        self.topic_intro = topic_intro
        self.mind_map = mind_map
        self.creator_id = creator_id
        self.users = []
        self.member_list = []
        # self.callbacks.append(callbacks)

    def add_user(self, user):
        self.users.append(user)
        self.member_list.append(user.user_name)
        logger.info("roomId:" + self.room_id + "userNum: " + str(len(self.users)))
        params = {
            'returnCode'   : 4,
            'action'       : 'addUser',
            'userId'       : user.user_name,
            'userType'     : 1
        }
        self.notify_callbacks(params);
        return True

    def remove_user(self, user):
        self.users.remove(user)
        logger.info("roomId:" + self.room_id + "userNum: " + str(len(self.users)))
        params = {
            'returnCode'   : 4,
            'action'       : 'removeUser',
            'userId'       : user.user_name,
            'userType'     : 1
        }
        self.notify_callbacks(params);
        return True

    def update_mind_map(self, mind_map,user_id):
        for user in self.users:
            if user_id == user.user_name:
                self.mind_map = mind_map
                params = {
                    'returnCode'   : 2,
                    'mindMap'      : mind_map
                }
                self.notify_callbacks(params)
                return True
        return False
        

    def get_mind_map(self):
        return self.mind_map

    def notify_callbacks(self,params):
        for user in self.users:
            callback = user.get_callback()
            callback(params)

    def get_member_list(self,user_id):
        logger.info(user_id);
        for user in self.users:
            if user_id == user.user_name:
                logger.info(self.member_list);
                return self.member_list
        return False

    def get_mind_start(self,user_id):
        logger.info(user_id);
        for user in self.users:
            if user_id == user.user_name:
                mind_start_info = {
                    'roomTitle' : self.room_title,
                    'topicIntro' : self.topic_intro
                }
                return mind_start_info
        return False
                

class Rooms(object):
    # roomCount = 0
    # rooms = {}
    def __init__(self):
        self.roomCount = 0
        self.rooms = {}

    def create_room(self, room_title, topic_intro, mind_map, creator_id):
        room_id = ""
        while True:
            for i in range(0, 6):
                room_id = room_id + random.choice('0123456789')
            if not (room_id in self.rooms):
                break
        self.rooms[room_id] = Room(room_id, room_title, topic_intro, mind_map, creator_id)
        self.roomCount += 1
        logger.info("roomNum: " + str(self.rooms))
        return room_id

    def delete_room(self, room_id):
        logger.info("room_id:" + room_id)
        self.rooms.pop(room_id)
        self.roomCount -= 1
        logger.info("roomNum: " + str(len(self.rooms)))

    def update_mind_map(self,room_id,mind_map,user_id):
        logger.info(room_id + " " + mind_map + " " + user_id)
        if not (room_id in self.rooms):
            return False
        return self.rooms[room_id].update_mind_map(mind_map,user_id)

    def add_user(self,room_id,user):
        logger.info(room_id + " " + user.user_name)
        if not (room_id in self.rooms):
            return False
        self.rooms[room_id].add_user(user)
        return True

    def remove_user(self, room_id, user):
        logger.info(room_id + " " + user.user_name)
        if not (room_id in self.rooms):
            return False
        self.rooms[room_id].remove_user(user)
        return True


    def get_room_member_list(self, room_id, user_id):
        logger.info(room_id + " " + user_id)
        if not (room_id in self.rooms):
            return False
        return self.rooms[room_id].get_member_list(user_id)

    def get_room_mind_start(self, room_id, user_id):
        logger.info(room_id + " " + user_id)
        if not (room_id in self.rooms):
            return False
        return self.rooms[room_id].get_mind_start(user_id)
        

class IntexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")


class LoginHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./index.html")


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

class RoomHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("./room.html")


class UpdateMapHandler(tornado.web.RequestHandler):
    def post(self):
        logger.info("updateMapHandler")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        mind_map = self.get_argument("mindMap")
        user_id = self.get_argument("userId")
        if not self.application.rooms_manage.update_mind_map(room_id,mind_map,user_id):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        self.write(json.dumps(returnVal))

class RequestMemberList(tornado.web.RequestHandler):
    def post(self):
        logger.info("RequestMemberList")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        user_id = self.get_argument("userId")
        result = self.application.rooms_manage.get_room_member_list(room_id,user_id)
        if not result:
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
            returnVal['memberList'] = json.dumps(result)
        self.write(json.dumps(returnVal))

class RequestMindStartInfo(tornado.web.RequestHandler):
    def post(self):
        logger.info("RequestMindStartInfo")
        returnVal = dict()
        room_id = self.get_argument("roomId")
        user_id = self.get_argument("userId")
        result = self.application.rooms_manage.get_room_mind_start(room_id,user_id)
        if not result:
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
            returnVal['mindStartInfo'] = json.dumps(result)
        self.write(json.dumps(returnVal))

class MapStatusHandler(tornado.websocket.WebSocketHandler):
    def open(self,input):
        self.room_id = input.split('&')[0].split('=')[1]
        user_name = input.split('&')[1].split('=')[1]
        print("room_id = " + self.room_id + "user_name = " + user_name)
        self.user = User(user_name,self.callback)
        returnVal = dict()
        
        if not self.application.rooms_manage.add_user(self.room_id,self.user):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        self.write_message(returnVal)
        print("WebSocket opened")
        # self.application.rooms_manage.rooms[input]

    def on_close(self):
        returnVal = dict()
        if not self.application.rooms_manage.remove_user(self.room_id,self.user):
            returnVal["returnCode"] = 0
        else:
            returnVal["returnCode"] = 1
        print("WebSocket closed")
        # self.application.rooms.unregister(self.callback)

    def on_message(self, message):
        print(message)
        # self.application.rooms_manage.rooms[message]
        # pass
        
    def callback(self, params):
        # returnVal = dict()
        # returnVal["returnCode"] = 2
        # returnVal["mindMap"] = mindMap
        self.write_message(params)


class Application(tornado.web.Application):
    def __init__(self):
        self.rooms_manage = Rooms()
        handlers = [
            (r'/', IntexHandler),
            (r'/index', IntexHandler),
            # (r'/login', LoginHandler),
            (r'/createRoom', CreateRoomHandler),
            (r'/joinRoom', JoinRoomHandler),
            (r'/room', RoomHandler),
            (r'/requestMemberList', RequestMemberList),
            (r'/requestMindStartInfo', RequestMindStartInfo),
            (r'/updateMindMap', UpdateMapHandler),
            (r'/status/(\w+\=\w+\&\w+\=\w+)', MapStatusHandler)
            
        ]

        settings = {
            'template_path': 'templates',
            'static_path': 'static',
            'debug': True
        }
        tornado.web.Application.__init__(self, handlers, **settings)

if __name__ == '__main__':
    tornado.options.parse_command_line()
    print("开始监听")

    app = Application()
    server = tornado.httpserver.HTTPServer(app)
    server.listen(8000)
    tornado.ioloop.IOLoop.instance().start()
