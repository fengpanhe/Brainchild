#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# from . import *

import random

from mod.control.Room import Room
from mod.config.logger import *

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

    def update_mind_map(self, room_id, mind_map, user_id):
        logger.info(room_id + " " + mind_map + " " + user_id)
        if not (room_id in self.rooms):
            return False
        return self.rooms[room_id].update_mind_map(mind_map, user_id)

    def add_user(self, room_id, user):
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