# Brainchild

改变了一下目录结构
由于解析字体时后端的目录会有问题.

```
.
├── static              
│   ├── css             //css
│   ├── fonts           //fonts
│   └── js              //js
└── templates           //html
    ├── img
    └── index.html
```
### 注意
填写static目录下的文件路径时使用如下方式

```
        <link href="{{static_url("css/index.css")}}" rel="stylesheet">
        <link href="{{static_url("css/room_info.css")}}" rel="stylesheet">
        <link rel="stylesheet" href="{{static_url("css/font-awesome.min.css")}}"/>
        <script src="{{static_url("js/create_room.js")}}"></script>

```
或
```
        <link href="static/css/index.css" rel="stylesheet">
```
总之文件都是以我的main.py所在目录为起始目录来加载文件.推荐用前者.

### BUG