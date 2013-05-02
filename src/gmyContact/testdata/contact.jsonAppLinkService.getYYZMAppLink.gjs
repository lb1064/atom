[{
	"uuid" : "fa101c61-defa-44d7-bc79-aa2a5c76be053",
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
}, {
	"uuid" : "mailCenter024",
	"name" : "邮件中心",
	"alt" : "邮件中心快捷方式",
	"img" : "testimg/mailmore.png",
	"bts" : [  {
				"uuid" : "email_01",
				"name" : "收件箱",
				"alt" : "收件箱",
				"img" : "testimg/shoujianxiang.png",
				"url" : 'modules/gem/receivebox.js',
				//"url" : 'modules/gmail/receive/receivebox.js',// 新版
				"path" : [{
							name : '邮件中心'
						}, {
							name : '收件箱'
						}],				
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "gsoft-endmailApp",
				"name" : "写邮件",
				"path" : [{
							name : '邮件中心'
						}, {
							name : '发件箱'
						}],
				"alt" : "写邮件快捷方式组",
				"img" : "testimg/fajianxiang.png",
				"url" : "modules/gem/sendmail.js",
				//"url" : "modules/gmail/draft/sendmail.js",// 新版
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "email_03",
				"name" : "发件箱",
				"alt" : "发件箱快捷方式",
				"img" : "testimg/fajianxiang.png",
				"url" : "modules/gem/senderbox.js",
				//"url" : "modules/gmail/outbox/senderbox.js",//新版
				"path" : [{
							name : '邮件中心'
						}, {
							name : '发件箱'
						}],
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "email_04",
				"name" : "草稿箱",
				"alt" : "草稿箱",
				"img" : "testimg/caogaoxiang.png",
				"url" : 'modules/gem/draft.js',
				//"url" : 'modules/gmail/draft/draft.js',//新版
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "email_05",
				"name" : "已发件箱",
				"alt" : "已发件箱快捷方式",
				"img" : "testimg/sendedmail.png",
				"url" : "modules/gem/sendedbox.js",
				//"url" : "modules/gmail/outedbox/sendedbox.js",//新版
				"path" : [{
							name : '邮件中心'
						}, {
							name : '已发件箱'
						}],
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "email_06",
				"name" : "邮箱设置",
				"alt" : "邮箱设置",
				"img" : "testimg/zhanghaoshezhi.png",
				"url" : 'modules/gem/emailSet.js',
				//"url":'modules/gmail/conf/main.js',//新版测试 田军
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "email_07",
				"name" : "回收站",
				"alt" : "回收站",
				"img" : "testimg/yishanchu.png",
				"url" : "modules/gem/deletebox.js",
				//"url" : "modules/gmail/recycle/deletebox.js",//新版
				"path" : [{
							name : '邮件中心'
						}, {
							name : '回收站'
						}],
				"init" : function() {
					Button.call(this);
				}
			}, {
				"uuid" : "email_08",
				"name" : "我的文件夹",
				"alt" : "我的文件夹",
				"img" : "testimg/zhanghaoshezhi.png",
				"url" : "modules/gem/mycustomfolder.js",
				//"url" : "modules/gmail/custom/configMyfolders.js",//新版 tianjun
				"path" : [{
							name : '邮件中心'
						}, {
							name : '我的文件夹'
						}],
				"init" : function() {
					Button.call(this);
				}
			}
		],
	"init" : function() {
		Folder.call(this);
		this.setProperty('height',210);
	}
},
{
	"uuid" : "mailCenter024",
	"name" : "会员管理",
	"alt" : "会员管理中心快捷方式",
	"img" : "testimg/mailmore.png",
	"bts" : [  
			{
				"name" : "会员申报",
				"alt" : "会员申报",
				"img" : "testimg/qiyehuiyuan.png",
				"url" : "modules/gmember/common/shenBao.js",
				"path" : "会员申报",
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "act_testapp_action1",
				"name" : "入会审批",
				"alt" : "入会审批",
				"img" : "testimg/qiyehuiyuan.png",
				"url" : "modules/gmember/rhsp/memberApproval.js",
				"path" : "入会审批",
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "act_testapp_action2",
				"name" : "会费缴纳",
				"alt" : "会费缴纳",
				"img" : "testimg/huifeijiaona.png",
				"url" : "modules/gmember/hfjn/hfjn.js",
				"path" : "会费缴纳",
				"init" : function() {
					Button.call(this);
				}
			},{
				"uuid" : "act_testapp_action3",
				"name" : "会员管理",
				"alt" : "会员管理",
				"img" : "testimg/fajianxiang.png",
				"url" : "modules/gmember/hygl/membermgr.js",
				"path" : "会员管理",
				"init" : function() {
					Button.call(this);
				}
			}
		],
	"init" : function() {
		Folder.call(this);
		this.setProperty('height',210);
	}
},{
	"uuid" : "act_testapp_action1",
	"name" : "会议管理",
	"alt" : "会议管理",
	"img" : "testimg/qiyehuiyuan.png",
	"url" : "modules/gmeeting/hygl/gmeeting.js",
	"path" : "会议管理",
	"init" : function() {
		Button.call(this);
	}
},{
	"uuid" : "resum_testapp_action3",
	"name" : "招聘管理",
	"alt" : "招聘管理",
	"img" : "testimg/qiyehuiyuan.png",
	"url" : "modules/gresume/demo/resumlist.js",
	"path" : "招聘管理",
	"init" : function() {
		Button.call(this);
	}
},{
	"uuid" : "act_testapp_action1",
	"name" : "入会审批",
	"alt" : "企业会员管理",
	"img" : "testimg/qiyehuiyuan.png",
	"url" : "modules/gmember/rhsp/memberApproval.js",
	"path" : "入会审批",
	"init" : function() {
		Button.call(this);
	}
},{
	"uuid" : "act_testapp_action1",
	"name" : "会议管理",
	"alt" : "会议管理",
	"img" : "testimg/qiyehuiyuan.png",
	"url" : "modules/gmeeting/hygl/gmeeting.js",
	"path" : "会议管理",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "act_testapp_action2",
	"name" : "会费缴纳",
	"alt" : "会费缴纳",
	"img" : "testimg/huifeijiaona.png",
	"url" : "modules/gmember/hfjn/hfjn.js",
	"path" : "会费缴纳",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "act_appms_appRegister3",
	"name" : "日程管理",
	"alt" : "日程管理",
	"img" : "testimg/richengguanli.png",
	"url" : "modules/gcd/workschedule.js",
	"path" : "工作日程列表",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "app_testapp4",
	"name" : "修改个人信息",
	"alt" : "修改个人信息",
	"img" : "testimg/tongxunluguanli.png",
	"url" : "modules/gdc/lxrgl.js",
	"path" : "通讯录管理",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "act_testapp_action15",
	"name" : "活页夹管理",
	"alt" : "活页夹管理",
	"img" : "testimg/huoyejia.png",
	"url" : "modules/gdc/leafletFold.js",
	"path" : "活页管理列表",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "act_testapp_action16",
	"name" : "会议管理",
	"alt" : "会议管理",
	"img" : "testimg/huiyiguanli.png",
	"url" : "modules/gcm/hygl.js",
	"path" : "会议安排",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "fa101c61-defa-44d7-bc79-aa2a5c76be0754",
	"name" : "个人应用",
	"alt" : "我的文档快捷方式",
	"img" : "testimg/gerenyingyong.png",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "app_appms85",
	"name" : "应用管理",
	"alt" : "应用管理",
	"img" : "testimg/yingyongguanli.png",
	"url" : "modules/gapp/appmanage.js",
	"init" : function() {
		Button.call(this);
	}
}, {
	"uuid" : "act_appms_appRegister96",
	"name" : "快捷方式管理",
	"alt" : "快捷方式管理",
	"img" : "testimg/yingyongzhuce.png",
	"url" : "modules/gapp/applinkmanage.js",
	"init" : function() {
		Button.call(this);
	}
}, 
	{
	"uuid" : "contactlist99",
	"name" : "个人通讯录",
	"alt" : "个人通讯录",
	"img" : "testimg/tongxunluguanli.png",
	"url" : "modules/gcu/contactlist.js",
	"path" : "个人通讯录",
	"init" : function() {
		Button.call(this);
	}
},
	{
	"uuid" : "contactlist100",
	"name" : "通讯录管理",
	"alt" : "通讯录管理",
	"img" : "testimg/yingyongzhuce.png",
	"url" : "modules/gcontact/contactTonXun/gcontactTonXun.js",
	"init" : function() {
		Button.call(this);
	}
}
]