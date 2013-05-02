[{
	"uuid" : "gsoft-endmailApp",
	"name" : "写邮件",
	"alt" : "写邮件快捷方式组",
	"img" : "testimg/fajianxiang.png", 
	"url" : "modules/gem/sendmail.js", 
	"init" : function() {
		Button.call(this);
	}
},{
	"uuid" : "receivebox01",
	"name" : "收件箱",
	"alt" : "收件箱快捷方式",
	"img" : "testimg/shoujianxiang.png",
	"url":"modules/gem/receivebox.js",
	"path":[{name:"邮件中心"},{name:"收件箱"}],
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "fa101c61-defa-44d7-bc79-aa2a5c76be052",
	"name" : "新浪微博",
	"alt" : "新浪微博",
	"img" : "testimg/xinlangweibo.png",
	"url" : "modules/gdc/docshortcut.js",
	"actType" : 'shortcut',
	"type" : 2,
	"path" : '/互联网应用/新浪微博',
	"init" : function() {
		Button.call(this);
	}
} , {
	"uuid" : "fa101c61-defa-44d7-bc79-aa2a5c76be051",
	"name" : "文档中心",
	"alt" : "文档中心快捷方式",
	"img" : "testimg/more_app.png",
	"bts" : [{
				"uuid" : "doc-001",
				"name" : "我的文档",
				"alt" : "我的收文快捷方式",
				"img" : "testimg/wodewendang.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/我的文档',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-002",
				"name" : "我的模板",
				"alt" : "我的发文快捷方式",
				"img" : "testimg/wodemoban.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/我的模板',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-003",
				"name" : "我的音乐",
				"alt" : "发件箱快捷方式",
				"img" : "testimg/wodeyinyue.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/我的音乐',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-004",
				"name" : "我的视频",
				"alt" : "收件箱快捷方式",
				"img" : "testimg/wodeshipin.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/我的视频',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-005",
				"name" : "我的相册",
				"alt" : "我的收文快捷方式",
				"img" : "testimg/wodexiangce.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/我的相册',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-006",
				"name" : "已发送",
				"alt" : "我的发文快捷方式",
				"img" : "testimg/wodefawen.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/文件传递/已发送',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-007",
				"name" : "已接收",
				"alt" : "发件箱快捷方式",
				"img" : "testimg/wodeshouwen.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/文件传递/已收到',
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "doc-008",
				"name" : "我的订阅",
				"alt" : "收件箱快捷方式",
				"img" : "testimg/wodedingyue.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/订阅夹',
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "doc-009",
				"name" : "回收站",
				"alt" : "邮件发送快捷方式",
				"img" : "testimg/lijixiang.png",
				"url" : "modules/gdc/docshortcut.js",
				"actType" : 'shortcut',
				"path" : '/个人文件夹/回收站',
				"init" : function() {
					Button.call(this);
				}
	}],
	"init" : function() {
		Folder.call(this);
		this.setProperty('height',300);
	}
}
]