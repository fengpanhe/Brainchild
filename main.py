#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from mod.control.User import *
from mod.control.Room import *
from mod.control.Rooms import *

from mod.handler.CreateRoomHandler import *
from mod.handler.IndexHandler import *
from mod.handler.JoinRoomHandler import *
from mod.handler.LoginHandler import *
from mod.handler.MapStatusHandler import *
from mod.handler.RequestMemberList import *
from mod.handler.RequestMindStartInfo import *
from mod.handler.RoomHandler import *
from mod.handler.UpdateMapHandler import *

import tornado.web
import tornado.websocket
import tornado.httpserver
import tornado.ioloop
import tornado.options


import json
import string
import IPython

class Application(tornado.web.Application):
    def __init__(self):
        self.rooms_manage = Rooms()
        handlers = [
            (r'/', IndexHandler),
            (r'/index', IndexHandler),
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
