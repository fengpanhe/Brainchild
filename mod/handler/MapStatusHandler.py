from mod.handler.config import *
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