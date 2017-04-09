#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# from User import *
from mod.config.logger import *


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
            'returnCode': 4,
            'action': 'addUser',
            'userId': user.user_name,
            'userType': 1
        }
        self.notify_callbacks(params)
        return True

    def remove_user(self, user):
        self.users.remove(user)
        logger.info("roomId:" + self.room_id + "userNum: " + str(len(self.users)))
        params = {
            'returnCode': 4,
            'action': 'removeUser',
            'userId': user.user_name,
            'userType': 1
        }
        self.notify_callbacks(params)
        return True

    def update_mind_map(self, mind_map, user_id):
        for user in self.users:
            if user_id == user.user_name:
                self.mind_map = mind_map
                params = {
                    'returnCode': 2,
                    'mindMap': mind_map
                }
                self.notify_callbacks(params)
                return True
        return False

    def get_mind_map(self):
        return self.mind_map

    def notify_callbacks(self, params):
        for user in self.users:
            callback = user.get_callback()
            callback(params)

    def get_member_list(self, user_id):
        logger.info(user_id)
        for user in self.users:
            if user_id == user.user_name:
                logger.info(self.member_list)
                return self.member_list
        return False

    def get_mind_start(self, user_id):
        logger.info(user_id)
        for user in self.users:
            if user_id == user.user_name:
                mind_start_info = {
                    'roomTitle': self.room_title,
                    'topicIntro': self.topic_intro
                }
                return mind_start_info
        return False