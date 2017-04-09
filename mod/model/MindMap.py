#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json


class MindMap(object):
    def __init__(self):
        self.MindMap = []
        self.MindMap.append({
            'id': 'root',
            'childNodeIds': []
        })
    
    def index_node(self, node_id):
        for node in self.MindMap:
            if node['id'] == node_id:
                return self.MindMap.index(node)

    def insert_node(self, par_node_id, node_id, title, contain, creator_id):
        self.MindMap[self.index_node(par_node_id)]['childNodeIds'].append(node_id)
        self.MindMap.append({
            'id': node_id,
            'nodeInfo': {
                'id': node_id,
                'title': title,
                'contain': contain,
                'creator': creator_id
            },
            'parNodeId': par_node_id,
            'childNodeIds': []
        })
    
    def remove_node(self, node_id):
        node = self.MindMap[self.index_node(node_id)]   
        par_node_id = node['parNodeId']
        self.MindMap[self.index_node(par_node_id)]['childNodeIds'].remove(node_id)
        self.MindMap.remove(node)


if __name__ == '__main__':

    mind_map = MindMap()
    mind_map.insert_node('root', '1', '1', '1', '123')
    mind_map.insert_node('1', '2', '2', '2', '123')
    print(json.dumps(mind_map.MindMap))
    mind_map.remove_node('2')
    print(mind_map.MindMap)