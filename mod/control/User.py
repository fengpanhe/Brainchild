#!/usr/bin/env python3
# -*- coding: utf-8 -*-


class User(object):
    # user_name = ""
    # callback = ""

    def __init__(self, name, callback):
        self.user_name = name
        self.user_id = name
        self.callback = callback

    def get_callback(self):
        return self.callback