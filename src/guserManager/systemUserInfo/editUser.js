/**
 * 编辑用户信息
 */
new (function () {

    var me = this;

    this.mod = new Gframe.module.RemoteModule({});

    var getData;
    var obj, getform;
    this.mod.defaultView = function (params) {
        //getData = params.sendData;
        obj = params.obj;
        getform = params.form;
        me.mod.main.open({
            id:'editUserInfo_id',
            xtype:'form',
            mode:'loop',
            track:[
                {name:'个人资料', handler:function () {
                    me.mod.main.defaultView();
                }},
                {name:'修改资料'}
            ],
            acts:{
                track:[
                    {name:'确定', value:'确定', handler:me.submitFoem},
                    {name:'取消', value:'取消', handler:function () {
                        var form = me.mod.main.get('editUserInfo_id');
                        form.reset();
                        me.mod.main.defaultView();
                    }}
                ]
            },
            fields:[
                {height:33, cols:[
                    {xtype:'blank', width:30},
                    {xtype:'label', top:6, textAlign:'left', textCls:'tree_label', value:'联系信息：', width:80}
                ]},
                {height:2, cols:[
                    {xtype:'blank', width:30},
                    {xtype:'label', textAlign:'left', textCls:'broken_black', width:'max'},
                    {xtype:'blank', width:36}
                ]},
                {height:10, cols:[
                ]},
                {height:40, cols:[
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'办公电话：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'officePhone_id', name:'officePhone', width:'max'},
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'手机：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'mobile_id', name:'mobile', width:'max'},
                    {xtype:'blank', width:20}
                ]},
                {height:40, cols:[
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'家庭电话：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'homePhone_id', name:'homePhone', width:'max'},
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'电子邮箱：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'email_id', name:'email', width:'max'},
                    {xtype:'blank', width:20}
                ]},
                {height:40, cols:[
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'家庭地址：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'familyAddress_id', name:'familyAddress', width:'max'},
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'邮编：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'homePostage_id', name:'homePostage', width:'max'},
                    {xtype:'blank', width:20}
                ]},
                {height:40, cols:[
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'通讯地址：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'postAddress_id', name:'postAddress', width:'max'},
                    {xtype:'blank', width:20},
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'邮编：', width:80},
                    {xtype:'blank', width:5},
                    {xtype:'text', leftHidden:true, itemId:'postage_id', name:'postage', width:'max'},
                    {xtype:'blank', width:20}
                ]}
            ],
            initMethod:function (mod) {
                var form = me.mod.main.get('editUserInfo_id');
                if (mainCol) {
                    form.removeItemById(mainCol.get('id'));
                }
                var officePhone_id = form.getByItemId('officePhone_id');
                var mobile_id = form.getByItemId('mobile_id');
                var homePhone_id = form.getByItemId('homePhone_id');
                var email_id = form.getByItemId('email_id');
                var familyAddress_id = form.getByItemId('familyAddress_id');
                var homePostage_id = form.getByItemId('homePostage_id');
                var postAddress_id = form.getByItemId('postAddress_id');
                var postage_id = form.getByItemId('postage_id');
                //数据回填
                mc.send({
                    service:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.service,
                    method:$sl.guserManager_systemUserInfo_viewUserInfo_defaultView.method,
                    params:{
                        //uuid:lineData.uuid
                    },
                    success:function (response) {
                        getData = util.parseJson(response.responseText);
                        if (getData) {
                            getData.person.officePhone = getData.person.officePhone || '';
                            getData.person.mobile = getData.person.mobile || '';
                            getData.person.homePhone = getData.person.homePhone || '';
                            getData.person.email = getData.person.email || '';
                            getData.person.familyAddress = getData.person.familyAddress || '';
                            getData.person.homePostage = getData.person.homePostage || '';
                            getData.person.postAddress = getData.person.postAddress || '';
                            getData.person.postage = getData.person.postage || '';

                            officePhone_id.setValue(getData.person.officePhone);
                            mobile_id.setValue(getData.person.mobile);
                            homePhone_id.setValue(getData.person.homePhone);
                            email_id.setValue(getData.person.email);
                            familyAddress_id.setValue(getData.person.familyAddress);
                            homePostage_id.setValue(getData.person.homePostage);
                            postAddress_id.setValue(getData.person.postAddress);
                            postage_id.setValue(getData.person.postage);

                            me.createPanel(getData);

                        }
                    }
                });
            }
        });
    }

    var mainCol;
    this.createPanel = function (data) {
        var form = me.mod.main.get('editUserInfo_id');
        var image = new Gframe.controls.Image({src:'', borderHidden:true, borderHover:false}, {width:110, height:110});
        var hrefurl;
        var upload = new Gframe.controls.DirectUpload({
            success:function (data) {
                var o = upload.getUploadInfo();
                var pictureUrl = mc.downloadurl + '?g_userName=' + mc.username + '&g_token=' + mc.token + '&uuid=' + (o.uuid);
                image.setImgUrl(pictureUrl);
            },
            startUp:function () {
            },
            leftHidden:true
        }, {width:65, height:33, label:'上传', name:'photoUuid'});
        var uploadCol = new Colbar({cols:[], align:'center'}, {height:33, width:100});
        uploadCol.addItem(upload);
        mainCol = new Colbar({cols:[], align:'left'}, {width:'max', height:330});
        var row1 = new Rowbar({rows:[]}, {width:110, height:330});
        var row2 = new Rowbar({rows:[]}, {width:'max', height:150});
        row1.addItem(image);
        row1.addItem(uploadCol);


        var labelTitleUser = new Gframe.controls.Label({textAlign:'left', textCls:'tree_label', width:120, value:'个性签名'});
        var lineLabel0 = new Gframe.controls.Label({textAlign:'right', textCls:'broken_black', width:'max'});
        var linecol = new Colbar({cols:[], align:'left'}, {height:2});
        linecol.addItem(new Blank({width:40}));
        linecol.addItem(lineLabel0);
        linecol.addItem(new Blank({width:36}));
        var label = new Gframe.controls.Label({width:75, height:36, value:'个性签名：', textCls:'title_font', textAlign:'left'});
        var textarea = new Gframe.controls.TextArea({width:'max', height:100, name:'personalSign'});
        var col2 = new Colbar({cols:[], align:'left'}, {width:'max', height:100});
//        var col3 = new Colbar({cols:[], align:'left'}, {width:'max', height:70});

        data.remark = data.remark || '';
        col2.addItem(new Blank({width:40}));
        col2.addItem(label);
        col2.addItem(textarea);
        col2.addItem(new Blank({width:20}));

        row2.addItem(new Colbar({cols:[new Blank({width:40}), labelTitleUser], align:'left'}, {height:30}));
        row2.addItem(linecol);
        row2.addItem(new Colbar({cols:[], align:'left'}, {height:10}));
        row2.addItem(col2);
//        row2.addItem(col3);
        var row3 = new Rowbar({rows:[]}, {width:'max', height:330});
        row3.addItem(me.createUser(data));
        row3.addItem(new Rowbar({rows:[]}, {width:'max', height:20}));
        row3.addItem(me.createPerson(data));
        mainCol.addItem(row1);
        mainCol.addItem(row3);
        form.addItem(1, mainCol);
        form.addItem(2, new Colbar({cols:[row2], align:'left'}, {width:'max', height:150}));
        form.update();
        //初始化
        data.user.personalSign = data.user.personalSign || '';
        textarea.setValue(data.user.personalSign);
        if (data.person.photoUuid) {
            hrefurl = mc.downloadurl + '?g_userName=' + mc.username + '&g_token=' + mc.token + '&uuid=' + data.person.photoUuid;
            image.setImgUrl(hrefurl);
        } else {
            hrefurl = 'adapter/images/man01.png';
        }
        image.setImgUrl(hrefurl);
    };

    this.createUser = function (data) {
        var row = new Rowbar({rows:[]}, {width:'max', height:100});
        var labelTitleUser = new Gframe.controls.Label({textAlign:'left', textCls:'tree_label', width:120, value:'用户信息'});
        var lineLabel0 = new Gframe.controls.Label({textAlign:'right', textCls:'broken_black', width:'max'});
        var linecol = new Colbar({cols:[], align:'left'}, {height:2});
        linecol.addItem(new Blank({width:40}));
        linecol.addItem(lineLabel0);
        linecol.addItem(new Blank({width:36}));

        var colbar0 = new Colbar({cols:[], align:'left'}, {height:30, width:'max'});
        var colbar1 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaAcount = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'账号：'});
        var acountValue = new Gframe.controls.Label({textAlign:'left'});
        acountValue.setValue(data.user.loginName);
        colbar0.addItem(new Blank({width:40}));
        colbar0.addItem(labelTitleUser);
        colbar1.addItem(labelaAcount);//120
        colbar1.addItem(new Blank({width:40}));//5
        colbar1.addItem(acountValue);

        var colbar2 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'电子邮箱：'});
        var labelaPhone = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'手机：'});
        var valueEmail = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.user.email = data.user.email || '';
        data.user.mobile = data.user.mobile || '';
        valueEmail.setValue(data.user.email);
        valuePhone.setValue(data.user.mobile);
        colbar2.addItem(labelaEmail);//120
        colbar2.addItem(new Blank({width:5}));//5
        colbar2.addItem(valueEmail);
        colbar2.addItem(new Blank({width:5}));//5
        colbar2.addItem(labelaPhone);//120
        colbar2.addItem(new Blank({width:5}));//5
        colbar2.addItem(valuePhone);
        row.addItem(colbar0);
        row.addItem(linecol);
        row.addItem(new Colbar({cols:[], align:'left'}, {height:10}));
        row.addItem(colbar1);
        row.addItem(colbar2);
        return row;
    };

    this.createPerson = function (data) {
        var row = new Rowbar({rows:[]}, {width:'max', height:230});
        var jblank = new Blank({width:5});
        var colbar3 = new Colbar({cols:[], align:'left'}, {height:30, width:'max'});
        var labelTitleUser3 = new Gframe.controls.Label({textAlign:'left', textCls:'tree_label', width:120, value:'个人信息'});
        colbar3.addItem(new Blank({width:40}));
        colbar3.addItem(labelTitleUser3);

        var lineLabel3 = new Gframe.controls.Label({textAlign:'right', textCls:'broken_black', width:'max'});
        var linecol3 = new Colbar({cols:[], align:'left'}, {height:2});
        linecol3.addItem(new Blank({width:40}));
        linecol3.addItem(lineLabel3);
        linecol3.addItem(new Blank({width:36}));


        var colbar4 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail3 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'姓名：'});
        var labelaPhone3 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'性别：'});
        var valueEmail3 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone3 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.person.name = data.person.name || '';
        data.person.sex = data.person.sex || '';
        valueEmail3.setValue(data.person.name);
        if (data.person.sex === 'M') {
            valuePhone3.setValue('男');
        } else if (data.person.sex === 'W') {
            valuePhone3.setValue('女');
        }
        colbar4.addItem(labelaEmail3);//120
        colbar4.addItem(jblank);//5
        colbar4.addItem(valueEmail3);
        colbar4.addItem(jblank);//5
        colbar4.addItem(labelaPhone3);//120
        colbar4.addItem(jblank);//5
        colbar4.addItem(valuePhone3);

        var colbar5 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail5 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'部门：'});
        var labelaPhone5 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'职务：'});
        var valueEmail5 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone5 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.person.depName = data.person.depName || '';
        data.person.headShip = data.person.headShip || '';
        valueEmail5.setValue(data.person.depName);
        valuePhone5.setValue(data.person.headShip);
        colbar5.addItem(labelaEmail5);//120
        colbar5.addItem(jblank);//5
        colbar5.addItem(valueEmail5);
        colbar5.addItem(jblank);//5
        colbar5.addItem(labelaPhone5);//120
        colbar5.addItem(jblank);//5
        colbar5.addItem(valuePhone5);

        var colbar6 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail6 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'职级：'});
        var labelaPhone6 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'入职时间：'});
        var valueEmail6 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone6 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.person.rank = data.person.rank || '';
        data.person.entryTime = data.person.entryTime || '';
        valueEmail6.setValue(data.person.rank);
        valuePhone6.setValue(data.person.entryTime);
        colbar6.addItem(labelaEmail6);//120
        colbar6.addItem(jblank);//5
        colbar6.addItem(valueEmail6);
        colbar6.addItem(jblank);//5
        colbar6.addItem(labelaPhone6);//120
        colbar6.addItem(jblank);//5
        colbar6.addItem(valuePhone6);

        var colbar7 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail7 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'生日：'});
        var labelaPhone7 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'民族：'});
        var valueEmail7 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone7 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.person.birthday = data.person.birthday || '';
        data.person.nation = data.person.nation || '';
        valueEmail7.setValue(data.person.birthday);
        valuePhone7.setValue(data.person.nation);
        colbar7.addItem(labelaEmail7);//120
        colbar7.addItem(jblank);//5
        colbar7.addItem(valueEmail7);
        colbar7.addItem(jblank);//5
        colbar7.addItem(labelaPhone7);//120
        colbar7.addItem(jblank);//5
        colbar7.addItem(valuePhone7);

        var colbar8 = new Colbar({cols:[], align:'left'}, {height:36, width:'max'});
        var labelaEmail8 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'政治面貌：'});
        var labelaPhone8 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', width:120, value:'籍贯：'});
        var valueEmail8 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        var valuePhone8 = new Gframe.controls.Label({textAlign:'left', width:'max'});
        data.person.face = data.person.face || '';
        data.person.nativePlace = data.person.nativePlace || '';
        valueEmail8.setValue(data.person.face);
        valuePhone8.setValue(data.person.nativePlace);
        colbar8.addItem(labelaEmail8);//120
        colbar8.addItem(jblank);//5
        colbar8.addItem(valueEmail8);
        colbar8.addItem(jblank);//5
        colbar8.addItem(labelaPhone8);//120
        colbar8.addItem(jblank);//5
        colbar8.addItem(valuePhone8);
        row.addItem(colbar3);
        row.addItem(linecol3);
        row.addItem(new Colbar({cols:[], align:'left'}, {height:10}));
        row.addItem(colbar4);
        row.addItem(colbar5);
        row.addItem(colbar6);
        row.addItem(colbar7);
        row.addItem(colbar8);
        return row;
    };


    this.submitFoem = function () {
        var form = me.mod.main.get('editUserInfo_id');
        var person = {}, user = {};
        var o = form.serializeForm();
        for (var p in o) {
            if (p === 'personalSign') {
                user['personalSign'] = o.personalSign;
            } else {
                person[p] = o[p] || '';
            }
        }
        form.submit({
            service:$sl.guserManager_systemUserInfo_viewUserInfo_editUserInfo.service,
            method:$sl.guserManager_systemUserInfo_viewUserInfo_editUserInfo.method,
            params:{
                user:util.json2str(user),
                person:util.json2str(person)
            },
            success:function (response) {
                var data = util.parseJson(response.responseText);
                if (data.success) {
                    me.mod.main.alert({
                        text:data.msg,
                        level:'info',
                        delay:2000
                    });
                    form.reset();
                    form.removeItemById(mainCol.get('id'));
                    getMyUserInfo();
                    me.mod.main.defaultView();
                }
            }
        });
    }
});