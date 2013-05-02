
new (function(){
	var me = this;
	var uuid;//获取公告内容服务后台返回的uuid
	var content;//获取公告内容服务后台返回的content
	var userGrid;//左边的GRID
	var label2;//公告textArea
	var label3;//公告提示label
	var row1;//左边区域
	var row2;//右边区域
	var textSize;//容量大小的文本框
	var comboUnit;//容量的单位的选择框
	var calendar;//日历上传组件
	var lifeTips;//生活小贴士
	var otherContact;//其他联系人
	var impEmailBook;//邮件联系人
	var licence;//licence
	var calendarBtn;//日历上传按钮组件
	var clearBtn;//系统公告清除公告按钮组件
	var noticeBtn;//系统公告发布公告按钮组件
	var lifeTipsBtn;//生活小贴士上传按钮组件
	var otherContactBtn;//其他联系人上传按钮组件
	var impEmailBookBtn;//邮件联系人上传按钮组件
	var licenceBtn;//licence上传按钮组件
	var maxUserNumber;//最大用户数
	var impowerType;//授权类型label
	var impowerTime;//授权时间
	var machineCode;//机器码
	var statusData = [
		{text:'KB',value:'KB'},
		{text:'MB',value:'MB'},
		{text:'GB',value:'GB'}
	]
	this.mod = new Gframe.module.Module({
	});
	
	this.mod.defaultView = function(params){
		parentParams = params;
		me.openView(parentParams);
	};
	this.mod.defaultView = function(params){
		me.mod.open({
			key:'setManagerView',
			id:'setManagerView',
			xtype:'form',
			mode:'loop'	,
			track:[
				{name:'设置'}
			],
			fields:[
			],
			initMethod:function(mod){
				row1 = new Rowbar({rows:[],align:'top'},{width:'max',height:630});
				rowBlank = new Rowbar({rows:[],align:'top'},{width:30,height:630});
				row2 = new Rowbar({rows:[],align:'top'},{width:'max',height:630});
				me.getUserDate();
			}
		});
	}
	
	this.getUserDate = function(){
		mc.send({
			service:$sl.guserManager_config_config_getUserList.service,
			method:$sl.guserManager_config_config_getUserList.method,
			params:{
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				me.createUserManager(data.data);
				var form = me.mod.get('setManagerView');
				var col = new Colbar({cols:[],align:'left'},{width:'max',height:630});
				col.addItem(row1);
				col.addItem(rowBlank);
				col.addItem(row2);
				form.addItem(col);
				form.update();
				//回填网盘容量
				me.setSize();
				//初始化license设置
				me.initGetLincenceData();
				calendarBtn.setEnabled(false);
				//clearBtn.setEnabled(false);
				noticeBtn.setEnabled(false);
				lifeTipsBtn.setEnabled(false);
				otherContactBtn.setEnabled(false);
				impEmailBookBtn.setEnabled(false);
				licenceBtn.setEnabled(false);
				calendarBtn.set("cursor","auto");
				noticeBtn.set("cursor","auto");
				lifeTipsBtn.set("cursor","auto");
				otherContactBtn.set("cursor","auto");
				impEmailBookBtn.set("cursor","auto");
				licenceBtn.set("cursor","auto");
			}
		})
	}
	//创建左边的GRID
	this.createUserManager = function(userData){
		var form = me.mod.get('setManagerView');
		userGrid = new Gframe.controls.GridPanel({
			checkbox:false,
			borderHidden:false,
			usePage:false,
			data:userData,
			colnums:[
				{header:'',width:20,textAlign:'left',mapping:'sys',renderer:me.changUser},
				{header:'用户名',width:'max',textAlign:'left',mapping:'loginName'},
				{header:'姓名',width:'max',textAlign:'left',mapping:'name'},
				{header:'邮箱',width:'max',textAlign:'left',mapping:'email'},
				{type:'act',bts:[
						{name:'编辑',value:'编辑',imgCls:'edit_btn',handler:me.editUser},
						{name:'删除',value:'删除',imgCls:'delete_btn',handler:me.deleteUser}
					]}
			]
		},{width:'max',height:'max',border:1});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:'max',height:25});
		var colbar2 = new Colbar({cols:[],align:'left'},{width:'max',height:'max'});
		var labenbsp = new Gframe.controls.Label({width:10,height:20});
		var label = new Gframe.controls.Label({value:'用户管理',width:150,height:20,textCls:'title_font'});
		var addBtmLabel = new Gframe.controls.Label({value:'',width:25,height:25,textCls:'addBasic_btn',title:'添加用户',handler:me.addUser});
		var brokenCol = new Colbar({cols:[]},{width:'max',height:2});
		var brokenLabel = new Gframe.controls.Label({value:'',width:'max',height:2,textCls:'broken_black'});
		
		brokenCol.addItem(brokenLabel);
		colbar1.addItem(labenbsp);
		colbar1.addItem(label);
		colbar1.addItem(new Blank({width:'max'}));
		colbar1.addItem(addBtmLabel);
		colbar2.addItem(userGrid);
		
		row1.addItem(colbar1);
		row1.addItem(brokenCol);
		row1.addItem(colbar2);
		row1.addItem(new Blank({height:10}));
		
		//创建左边的form区域
		me.createNoticeForm();
		mc.send({
			service:$sl.guserManager_config_config_getNoticeContent.service,
			method:$sl.guserManager_config_config_getNoticeContent.method,
			params:{
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				uuid = data.uuid;
				content = data.content;
				label2.setValue(content);
				var content = label2.getValue();
				var leaveLength = 100 - (content.length);
				label3.setValue("可输入" + leaveLength + "字");
				noticeBtn.setEnabled(true);
			},
			failure:function(){
				noticeBtn.setEnabled(true);
				return true;
			}
		});
		me.createVolumeForm();
		me.createImportForm();
		me.createLicenceForm();
	}
	
	//系统公告
	this.createNoticeForm = function(){
		var label1 = new Gframe.controls.Label({value:'发公告',width:150,height:20,textCls:'title_font'});
		label2 = new Gframe.controls.TextArea({value:'',width:'max',height:'max',textCls:'title_font',textAlign:'left',handler:function(e,o){
			o.setValue("");
			label3.setValue("可输入" + 100 + "个字");
		},onTextChange:function(e,o){
			var content = label2.getValue();
			var leaveLength = 100 - (content.length);
			label3.setValue("可输入" + leaveLength + "个字");
			if(leaveLength < 0){
				label3.setValue("已超过" + (0-leaveLength) + "字");
				noticeBtn.setEnabled(false);
			}else{
				noticeBtn.setEnabled(true);
			}
		}});
		label3 = new Gframe.controls.Label({width:'max',height:20,textCls:'show_font',textAlign:'right'});
		clearBtn = new Gframe.controls.Button({value:'清除',width:60,height:24,cursor:'pointer',textCls:'uploadimg_btn',handler:function(){
			label2.setValue("");
		}});
		noticeBtn = new Gframe.controls.Button({value:'发布',width:60,height:24,cursor:'pointer',handler:me.noticeText,textCls:'uploadimg_btn'});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		var colbar2 = new Colbar({cols:[],align:'left'},{width:500,height:80});
		var colbar4 = new Colbar({cols:[],align:'left'},{width:500,height:10});
		var brokenCol = new Colbar({cols:[]},{width:'max',height:2});
		var brokenLabel = new Gframe.controls.Label({value:'',width:'max',height:2,textCls:'broken_black'});
		brokenCol.addItem(brokenLabel);
		colbar1.addItem(label1);
		colbar2.addItem(new Blank({width:40}));
		colbar2.addItem(label2);
		colbar2.addItem(new Blank({width:20}));
		var rowb = new Rowbar({rows:[],align:'bottom'},{width:60,height:'max'});
		rowb.addItem(clearBtn);
		rowb.addItem(new Blank({width:10}));
		rowb.addItem(noticeBtn);
		var colbar3 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		colbar2.addItem(rowb);
		colbar2.addItem(new Blank({width:20}));
		colbar3.addItem(label3);
		colbar3.addItem(new Blank({width:100}));
		row2.addItem(colbar1);
		row2.addItem(brokenCol);
		row2.addItem(colbar4);
		row2.addItem(colbar2);
		row2.addItem(colbar3);
	}
	
	//创建右边的FORM-网盘容量部分
	this.createVolumeForm = function(){
		var label1 = new Gframe.controls.Label({value:'网盘容量设置',width:150,height:20,textCls:'title_font'});
		var label2 = new Gframe.controls.Label({value:'网盘容量：',width:150,textCls:'title_font',textAlign:'right'});
		var label3 = new Gframe.controls.Label({value:'全局网盘容量设置',width:150,height:20,textCls:'show_font'});
		textSize = new Gframe.controls.TextField({textAlign:'left',name:'rank',leftHidden:true,width:150,textAlign:'right'});
		comboUnit = new Gframe.controls.ComboBox({textAlign:'left',name:'rank',data:statusData,displayField:'text',displayValue:'value',width:100});
		var botton = new Gframe.controls.Button({value:'保存',width:60,height:30,textAlign:'center',cursor:'pointer',handler:me.submitSize,textCls:'uploadimg_btn'});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		var colbar2 = new Colbar({cols:[],align:'left'},{width:500,height:30});
		var colbar3 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		var colbar4 = new Colbar({cols:[],align:'left'},{width:500,height:10});
		var brokenCol = new Colbar({cols:[]},{width:'max',height:2});
		var brokenLabel = new Gframe.controls.Label({value:'',width:'max',height:2,textCls:'broken_black'});
		brokenCol.addItem(brokenLabel);
		colbar1.addItem(label1);
		colbar2.addItem(label2);
		colbar2.addItem(textSize);
		colbar2.addItem(new Blank({width:10}));
		colbar2.addItem(comboUnit);
		colbar2.addItem(new Blank({width:10}));
		colbar2.addItem(botton);
		colbar3.addItem(new Blank({width:150}));
		colbar3.addItem(label3);
		row2.addItem(colbar1);
		row2.addItem(brokenCol);
		row2.addItem(colbar4);
		row2.addItem(colbar2);
		row2.addItem(colbar3);
	}
	
	this.changUser = function(v,record,o){
		record.set('useLimit',false);
		if(v==true||v=='true'){
			record.set('title','管理员');
			return '<span class="people_img" style="width:16px; height:16px;">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		}else{
			return '';
		}
	}
	
	//创建右边的FORM-导入模版部分
	this.createImportForm = function(){
		var label1 = new Gframe.controls.Label({value:'导入',width:150,height:20,textCls:'title_font'});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		colbar1.addItem(label1);
		row2.addItem(colbar1);
		
		var brokenCol = new Colbar({cols:[]},{width:'max',height:2});
		var brokenLabel = new Gframe.controls.Label({value:'',width:'max',height:2,textCls:'broken_black'});
		brokenCol.addItem(brokenLabel);
		row2.addItem(brokenCol);
		
		var colbar4 = new Colbar({cols:[],align:'left'},{width:500,height:10});
		row2.addItem(colbar4);
		
		var label2 = new Gframe.controls.Label({value:'组织日历：',width:150,textCls:'title_font',textAlign:'right'});
		calendar = new Gframe.controls.DirectUpload({textAlign:'left',name:'rank',success:function(){calendarBtn.setEnabled(true)},label:'浏览'},{width:200});
		calendarBtn = new Gframe.controls.Button({value:'上传',width:60,height:30,textCls:'uploadimg_btn',handler:function(){me.uplodaFile('1')},cursor:'pointer',textAlign:'center'});
		var botton2 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:function(){me.downFile('1');},cursor:'pointer'});
		var colbar2 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar2.addItem(label2);
		colbar2.addItem(calendar);
		colbar2.addItem(new Blank({width:10}));
		colbar2.addItem(calendarBtn);
		colbar2.addItem(new Blank({width:10}));
		colbar2.addItem(botton2);
		row2.addItem(colbar2);
		
		var label21 = new Gframe.controls.Label({value:'生活小贴士：',width:150,textCls:'title_font',textAlign:'right'});
		lifeTips = new Gframe.controls.DirectUpload({textAlign:'left',name:'rank',success:function(){lifeTipsBtn.setEnabled(true)},label:'浏览'},{width:200});
		lifeTipsBtn = new Gframe.controls.Button({value:'上传',width:60,height:30,textCls:'uploadimg_btn',handler:function(){me.uplodaFile('2')},cursor:'pointer',textAlign:'center'});
		var botton21 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:function(){me.downFile('2');},cursor:'pointer'});
		var colbar21 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar21.addItem(label21);
		colbar21.addItem(lifeTips);
		colbar21.addItem(new Blank({width:10}));
		colbar21.addItem(lifeTipsBtn);
		colbar21.addItem(new Blank({width:10}));
		colbar21.addItem(botton21);
		row2.addItem(colbar21);
		
		
		var label22 = new Gframe.controls.Label({value:'其他联系人：',width:150,textCls:'title_font',textAlign:'right'});
		otherContact = new Gframe.controls.DirectUpload({textAlign:'left',name:'rank',success:function(){otherContactBtn.setEnabled(true)},label:'浏览'},{width:200});
		otherContactBtn = new Gframe.controls.Button({value:'上传',width:60,height:30,textCls:'uploadimg_btn',handler:function(){me.uplodaFile('3')},cursor:'pointer',textAlign:'center'});
		var botton22 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:function(){me.downFile('3');},cursor:'pointer'});
		var colbar22 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar22.addItem(label22);
		colbar22.addItem(otherContact);
		colbar22.addItem(new Blank({width:10}));
		colbar22.addItem(otherContactBtn);
		colbar22.addItem(new Blank({width:10}));
		colbar22.addItem(botton22);
		row2.addItem(colbar22);
		
		
		var label23 = new Gframe.controls.Label({value:'domino邮件联系人：',width:150,textCls:'title_font',textAlign:'right'});
		impEmailBook = new Gframe.controls.DirectUpload({textAlign:'left',name:'emaileContactFile',label:'浏览',success:function(){impEmailBookBtn.setEnabled(true)},itemId:'emaileContactFile'},{width:200});
		impEmailBookBtn = new Gframe.controls.Button({value:'上传',width:60,height:30,textCls:'uploadimg_btn',handler:function(){me.uplodaFile('4')},cursor:'pointer',textAlign:'center'});
		var botton23 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:function(){me.downFile('4');},cursor:'pointer'});
		var colbar23 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar23.addItem(label23);
		colbar23.addItem(impEmailBook);
		colbar23.addItem(new Blank({width:10}));
		colbar23.addItem(impEmailBookBtn);
		colbar23.addItem(new Blank({width:10}));
		colbar23.addItem(botton23);
		row2.addItem(colbar23);
	}
	
	
	//创建右边的FORM-licence设置
	this.createLicenceForm = function(){
		var label1 = new Gframe.controls.Label({value:'软件授权信息 ',width:150,height:20,textCls:'title_font'});
		var colbar1 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		colbar1.addItem(label1);
		row2.addItem(colbar1);
		
		var brokenCol = new Colbar({cols:[]},{width:'max',height:2});
		var brokenLabel = new Gframe.controls.Label({value:'',width:'max',height:2,textCls:'broken_black'});
		brokenCol.addItem(brokenLabel);
		row2.addItem(brokenCol);
		
		var colbar4 = new Colbar({cols:[],align:'left'},{width:500,height:10});
		row2.addItem(colbar4);
		
	
		/*var label21 = new Gframe.controls.Label({value:'服务器IP：',width:150,height:20,textCls:'title_font',textAlign:'right'});
		IP = new Gframe.controls.Label({value:'ceshi',width:'max',height:20,textAlign:'left'});
		var colbar21 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar21.addItem(label21);
		colbar21.addItem(IP);
		row2.addItem(colbar21);
		var label22 = new Gframe.controls.Label({value:'机器码：',width:150,height:20,textCls:'title_font',textAlign:'right'});
		strMac = new Gframe.controls.Label({value:'ceshi',width:'max',height:20,textAlign:'left'});
		var colbar22 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar22.addItem(label22);
		colbar22.addItem(strMac);
		row2.addItem(colbar22);
		
		var label25 = new Gframe.controls.Label({value:'CPU个数：',width:150,height:20,textCls:'title_font',textAlign:'right'});
		cpuNum = new Gframe.controls.Label({value:'ceshi',width:'max',height:20,textAlign:'left'});
		var colbar25 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar25.addItem(label25);
		colbar25.addItem(cpuNum);
		row2.addItem(colbar25);*/
		
		var label23 = new Gframe.controls.Label({value:'过期天数：',width:150,height:20,textCls:'title_font',textAlign:'right'});
		endDate = new Gframe.controls.Label({width:'max',height:20,textAlign:'left'});
		var colbar23 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar23.addItem(label23);
		colbar23.addItem(endDate);
		row2.addItem(colbar23);
	
		
		var label24 = new Gframe.controls.Label({value:'最大用户数：',width:150,height:20,textCls:'title_font',textAlign:'right'});
		var colbar24 = new Colbar({cols:[],align:'left'},{width:500,height:20});
		userNum = new Gframe.controls.LabelPlus({width:'max',height:30,textAlign:'left',afterSetValue:function(value,h){
					             var form = me.mod.get('setManagerView');
                                colbar24.set('height', h+3);
                                form.resize();
					        }});
		colbar24.addItem(label24);
		colbar24.addItem(userNum);
		row2.addItem(colbar24);
	
		
		var colbar77 = new Colbar({cols:[],align:'left'},{width:500,height:10});
		row2.addItem(colbar77);
		
		var label235 = new Gframe.controls.Label({value:'重新上传：',width:150,height:30,textCls:'title_font',textAlign:'right'});
		licence = new Gframe.controls.DirectUpload({textAlign:'left',name:'rank',label:'浏览',success:function(){licenceBtn.setEnabled(true)}},{width:200});
		licenceBtn = new Gframe.controls.Button({value:'上传',width:60,height:30,textCls:'uploadimg_btn',handler:function(){me.uplodaFile('5')},cursor:'pointer',textAlign:'center'});
	//	var botton235 = new Gframe.controls.Label({value:'模版下载',width:60,height:30,textCls:'alable',handler:function(){me.downFile('5');},cursor:'pointer'});
		var colbar235 = new Colbar({cols:[],align:'left'},{width:500,height:36});
		colbar235.addItem(label235);
		colbar235.addItem(licence);
		colbar235.addItem(new Blank({width:10}));
		colbar235.addItem(licenceBtn);
		colbar235.addItem(new Blank({width:10}));
	//	colbar235.addItem(botton235);
		row2.addItem(colbar235);
		
	}
	//编辑用户
	this.editUser = function(e,o){
		me.mod.remoteOpen({
			url:'modules/guserManager/config/editUser.js',
			params:{
				refreshFn:me.refreshFn,
				uuid:o.get('data').loginName
			}
		})
	}
	//添加用户
	this.addUser = function(e,o){
		me.mod.remoteOpen({
			url:'modules/guserManager/config/addUser.js',
			params:{
				refreshFn:me.refreshFn
			}
		})
	}
	
	this.deleteUser = function(e,o){
		me.mod.confirm({
            text:'删除用户将无法恢复，您确定删除该用户吗？',
            handler:function (confirm) {
                if (confirm) {
                    mc.send({
                        service:$sl.guserManager_config_config_delUser.service,
                        method:$sl.guserManager_config_config_delUser.method,
                        params:{
                            uuid:o.get('data').uuid
                        },
                        success:function (response) {
                            var d = util.parseJson(response.responseText);
                            if (d.success) {
                                me.mod.alert({
                                    text:d.msg,
                                    level:'info',
                                    delay:3000
                                });
                                me.refreshFn();
                            }
                        }
                    })
                }
            }
        })
	}
	
	//保存网盘容量大小
	this.submitSize = function(){
		mc.send({
			service:$sl.guserManager_config_config_setNetDiskCapacity.service,
			method:$sl.guserManager_config_config_setNetDiskCapacity.method,
			params:{
				maxSize:textSize.getValue(),
				unit:comboUnit.getValue()
			},
			success:function(response){
				var d = util.parseJson(response.responseText);
                if (d.success) {
                    me.mod.alert({
                        text:d.msg,
                        level:'info',
                        delay:3000
                    });
                }
			}
		})
	}
	
	//设置网盘大小
	this.setSize = function(){
			mc.send({
			service:$sl.guserManager_config_config_getContextNetDiskCapacity.service,
			method:$sl.guserManager_config_config_getContextNetDiskCapacity.method,
			params:{
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				textSize.setValue(data.maxSize);
				comboUnit.setValue(data.unit);
			}
		})
	}
	//下载模版
	this.downFile = function(i){
		var url = '';
		switch(i){
			case '1'://日历
				url = 'modules/guserManager/config/templateFile/calendar.xls';
				break;
			case '2'://生活小贴士
				url = 'modules/guserManager/config/templateFile/lifeTips.xls';
				break;
			case '3'://其他联系人
				url = 'modules/guserManager/config/templateFile/otherContact.xls';
				break;
			case '4'://邮件联系人
				url = 'modules/guserManager/config/templateFile/impEmailBook.xls';
				break;
			case '5'://licence
				url = 'modules/guserManager/config/templateFile/licence.xls';
				break;
			default:
				url = 'modules/guserManager/config/templateFile/impEmailBook.xls';
				break;
		}
		mc.download(null,url);
	}
	
	//发布公告
	this.noticeText = function(e,o){
		var noticeContent = label2.getValue();
		if(noticeContent.length > 100){
//			me.mod.alert({
//							text : "输入字数超过100个！",
//							level : 'error',
//							delay : 3000
//						});
//			return;
			//noticeBtn.setEnabled(false);
		}
		noticeBtn.setEnabled(false);
		mc.send({
			service:$sl.guserManager_config_config_saveorUpdateNotice.service,
			method:$sl.guserManager_config_config_saveorUpdateNotice.method,
			params:{
				uuid:uuid,
				content:noticeContent
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if (data.success) {
					me.mod.alert({
								text : data.msg,
								level : 'info',
								delay : 3000
							});
					noticeBtn.setEnabled(true);
				}
			},
			failure:function(){
				noticeBtn.setEnabled(true);
				return true;
			}
		})
	}
	
	//上传模版
	this.uplodaFile = function(i){
		
		var fileUuid = '';
		var btn;
		var textFile;
		var service = $sl.guserManager_config_config_sysImpData.service;
		var method = $sl.guserManager_config_config_sysImpData.method;
		switch(i){
			case '1'://日历
				textFile = calendar;
				btn = calendarBtn;
				break;
			case '2'://生活小贴士
				textFile = lifeTips;
				btn = lifeTipsBtn;
				break;
			case '3'://其他联系人
				textFile = otherContact;
				btn = otherContactBtn;
				break;
			case '4'://邮件联系人
				textFile = impEmailBook;
				btn = impEmailBookBtn;
				break;
			case '5'://licence
				textFile = licence;
				btn = licenceBtn;
				service = $sl.guserManager_config_config_impSetLicence.service;
				method = $sl.guserManager_config_config_impSetLicence.method;
				break;
//			default:
//				textFile = calendar;
//				btn = calendarBtn;
//				service = sl.guserManager_config_config_impEmailBook.service;
//				method = sl.guserManager_config_config_impEmailBook.method;
//				break;
		}
		fileUuid = textFile.getUploadInfo().uuid;
		btn.setEnabled(false);
		btn.set("cursor","auto");
		
		mc.send({
			service:service,
			method:method,
			params:{
				type:i,
				fileUuid:fileUuid
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				if (data.success) {
					me.mod.alert({
								text : data.msg,
								level : 'info',
								delay : 3000
							});
					textFile.reset();
//					btn.setEnabled(true);
				}
				if(i == '5'){
					me.setLicence(data);
				}
			},
			failure:function(){
				btn.set("cursor","pointer");
				btn.setEnabled(true);
				return true;
			}
		})
	}
	
	
	
	//获取初始化Licence设置
	this.initGetLincenceData = function(){
		
		mc.send({
			service:$sl.guserManager_config_config_getSetLicenceInfo.service,
			method:$sl.guserManager_config_config_getSetLicenceInfo.method,
			params:{
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				me.setLicence(data);
			}
		})
	}
	
	//刷新Licence设置
	this.setLicence = function(data){
		if(data){
			
			var time=data.endDate;
			var timeyear = new Date();
            var timeArr = time.split('-');
            timeyear.setFullYear(timeArr[0],timeArr[1],timeArr[2]);
			var ts = timeyear - new Date();
			var tsDay=parseInt(ts / 1000 / 60 / 60 / 24);
            endDate.setValue(tsDay+"天");
			userNum.setValue(data.userNum);
		}
	}
	//刷新grid
	this.refreshFn = function(){
		mc.send({
			service:$sl.guserManager_config_config_getUserList.service,
			method:$sl.guserManager_config_config_getUserList.method,
			params:{
			},
			success:function(response){
				var data = util.parseJson(response.responseText);
				userGrid.setData(data);
				mc.fireEvent(userGrid.get('id'),'load');
			}
		})
	} 
});