#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json


class MindMap(object):
    def __init__(self):
        self.mind_map = []
        self.mind_map.append({
            'id': 'root',
            'childNodeIds': []
        })
    
    def index_node(self, node_id):
        for node in self.mind_map:
            if node['id'] == node_id:
                return self.mind_map.index(node)

    def get_node(self, node_id):
        for node in self.mind_map:
            if node['id'] == node_id:
                return node

    def insert_node(self, par_node_id, node_id, title, contain, creator_id):
        self.mind_map[self.index_node(par_node_id)]['childNodeIds'].append(node_id)
        self.mind_map.append({
            'id': node_id,
            'nodeInfo': {
                'id': node_id,
                'title': title,
                'contain': contain,
                'creator': creator_id,
                'supporterNum': 0
            },
            'parNodeId': par_node_id,
            'childNodeIds': []
        })
    
    def remove_node(self, node_id):
        node = self.mind_map[self.index_node(node_id)]   
        par_node_id = node['parNodeId']
        self.mind_map[self.index_node(par_node_id)]['childNodeIds'].remove(node_id)
        self.mind_map.remove(node)
    
    def get_node_supporterNum(self, node_id):
        node = self.get_node(node_id)
        return node['nodeInfo']['supporterNum']

    def add_vote(self, node_id):
        node = self.get_node(node_id)
        node['nodeInfo']['supporterNum'] += 1

    def sub_vote(self, node_id):
        node = self.get_node(node_id)
        node['nodeInfo']['supporterNum'] -= 1

if __name__ == '__main__':

    mind_map = MindMap()
    mind_map.insert_node('root', '1', '1', '1', '123')
    mind_map.insert_node('1', '2', '2', '2', '123')
    print(mind_map.get_node_supporterNum('1'))
    print(str(mind_map.get_node_supporterNum('2')))
    mind_map.add_vote('1')
    print(str(mind_map.get_node_supporterNum('1')))
    print(str(mind_map.get_node_supporterNum('2')))
    print(json.dumps(mind_map.mind_map))
    mind_map.remove_node('2')
    print(mind_map.mind_map)