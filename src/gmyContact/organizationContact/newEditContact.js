/**
 * 编辑通讯录,新建通讯录
 */
new (function () {

    var me = this;

    this.mod = new Gframe.module.RemoteModule({
        expandView:{
            'rolesTree':{
                title:'请选择人员',
                create:function (params) {
                    personTree = new Treebar({});
                    personTree.handler = function (node) {
                        var record = {
                            name:node.options.name,
                            uuid:node.options.uuid
                        };
                        var form = me.mod.main.get('newEdit_id');
//                        var textplus = form.getByItemId('roleText_id');
                        var textplus = CompMgr.getComp('roleText_id');
                        textplus.setValue(record);
                        textplus.update();
                    };
                    return personTree;
                },
                initMethod:function (params) {
                    mc.send({
                        service:$sl.guserManager_allUsers_getSelectDeptsTree.service,
                        method:$sl.guserManager_allUsers_getSelectDeptsTree.method,
                        params:{
                        },
                        success:function (response) {
                            mc.fireEvent(personTree.get('id'), 'loadData', {obj:response.responseText});
                        }
                    });
                }
            }
        }
    });

    var uuid;
    var lineData;
    var obj;
    this.mod.defaultView = function (params) {
        uuid = params.uuid || '';
        lineData = params.lineData || undefined;
        obj = params.obj || undefined;
        me.mod.main.open({
            id:'newEdit_id',
            xtype:'form',
            mode:'pop',
            width:550,
            height:340,
            title:'新建行政通讯录',
            fields:[
                {height:40, cols:[
                    {xtype:'label', top:6, textAlign:'right', textCls:'title_font', value:'来源：', width:70},
                    {xtype:'blank', width:5},
                    {xtype:'radiogroup', itemId:'radiogroup', radios:[
                        {displayValue:'新建行政通讯录', value:1, checked:true, width:140},
                        {displayValue:'从人员管理导入', value:2, width:130},
                        {displayValue:'从本地导入', value:3, width:130}
                    ]},
                    {xtype:'blank', width:20}
                ]}
            ],
            initMethod:function (mod) {
                me.createCheck(1);
                var form = me.mod.main.get('newEdit_id');
                var radiogroup = form.getByItemId('radiogroup');
                radiogroup.addListener('click', function () {
                    me.createCheck(radiogroup.getCheckedRadio().getValue());
                });

            }
        });
    };


    this.createCheck = function (value) {
        me.mod.main.closeExpandView('rolesTree');
        switch (value) {
            case 1:
                me.editContact();
                break;
            case 2:
                me.createContact();
                break;
            case 3:
                me.importContact();
                break;
        }

    };


    this.editContact = function () {
        var form = me.mod.main.get('newEdit_id');
        form.removeItem(2);
        form.update();

        var colMain = new Colbar({cols:[], align:'left'}, {width:'max', height:280});
        var rowMain = new Rowbar({rows:[]}, {width:'max', height:320});

        var col1 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
        var label1 = new Gframe.controls.Label({top:6, textAlign:'right', textCls:'title_font', value:'名称：', width:70});
        var text1 = new Gframe.controls.TextField({top:5, textAlign:'left', itemId:'name_id', leftHidden:true, name:'name', width:'max'});

        col1.addItem(new Blank({width:10}));
        col1.addItem(label1);
        col1.addItem(new Blank({width:5}));
        col1.addItem(text1);
        col1.addItem(new Blank({width:70}));
        rowMain.addItem(col1);


        var col2 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
        var label2 = new Gframe.controls.Label({top:6, textAlign:'right', textCls:'title_font', value:'排序：', width:70});
        var text2 = new Gframe.controls.TextField({top:5, textAlign:'left', itemId:'sort_id', leftHidden:true, name:'sort', width:'max'});

        col2.addItem(new Blank({width:10}));
        col2.addItem(label2);
        col2.addItem(new Blank({width:5}));
        col2.addItem(text2);
        col2.addItem(new Blank({width:70}));
        rowMain.addItem(col2);


        var col3 = new Colbar({cols:[], align:'left'}, {width:'max', height:30});
        var label3 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'show_font ', value:'*数字越大，排序越靠前', width:'max'});

        col3.addItem(new Blank({width:85}));
        col3.addItem(label3);
        rowMain.addItem(col3);


        var col4 = new Colbar({cols:[], align:'left'}, {width:'max', height:90});
        var label4 = new Gframe.controls.Label({top:6, textAlign:'right', textCls:'title_font', value:'备注：', width:70});
        var text4 = new Gframe.controls.TextArea({top:5, textAlign:'left', height:70, itemId:'remark_id', leftHidden:true, name:'remark', width:'max'});

        col4.addItem(new Blank({width:10}));
        col4.addItem(label4);
        col4.addItem(new Blank({width:5}));
        col4.addItem(text4);
        col4.addItem(new Blank({width:70}));
        rowMain.addItem(col4);


        var col5 = new Colbar({cols:[], align:'left'}, {width:'max', height:36, top:30});
        var button1 = new Gframe.controls.Button({value:'确定', width:100, handler:me.confirmUpdate});
        var button2 = new Gframe.controls.Button({ value:'取消', width:100, handler:function () {
            var form = me.mod.main.get('newEdit_id');
            form.reset();
            me.mod.main.popMgr.close('newEdit_id');
        }});

        col5.addItem(new Blank({width:140}));
        col5.addItem(button1);
        col5.addItem(new Blank({width:20}));
        col5.addItem(button2);
        col5.addItem(new Blank({width:70}));


        rowMain.addItem(col5);

        colMain.addItem(rowMain);
        form.addItem(2, colMain);
        form.update();
    };

    this.createContact = function () {
        var form = me.mod.main.get('newEdit_id');
        form.removeItem(2);
        form.update();


        var colMain = new Colbar({cols:[], align:'left'}, {width:'max', height:280});
        var rowMain = new Rowbar({rows:[]}, {width:'max', height:320});

        var col1 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
        var label1 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', value:'名称：', width:70});
        var text1 = new Gframe.controls.TextField({leftHidden:true, name:'name', width:'max'});

        col1.addItem(new Blank({width:10}));
        col1.addItem(label1);
        col1.addItem(new Blank({width:5}));
        col1.addItem(text1);
        col1.addItem(new Blank({width:70}));
        rowMain.addItem(col1);


        var col2 = new Colbar({cols:[], align:'left'}, {width:'max', height:36});
        var label2 = new Gframe.controls.Label({textAlign:'right', value:'生成范围：', textCls:'title_font', width:75});
        var text2 = new Gframe.controls.TextFieldPlus({width:'max', name:'members', listeners:({
            'click':function () {
                me.mod.main.showExpandView('rolesTree');
            }
        }),
            defaultField:'name',
            fields:['uuid', 'name']});

        CompMgr.addComp('roleText_id', text2);


        col2.addItem(new Blank({width:5}));
        col2.addItem(label2);
        col2.addItem(new Blank({width:5}));
        col2.addItem(text2);
        col2.addItem(new Blank({width:65}));
        rowMain.addItem(col2);


        var col3 = new Colbar({cols:[], align:'left'}, {width:'max', height:30});
        var label3 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', value:'排序：', width:70});
        var text3 = new Gframe.controls.TextField({leftHidden:true, name:'sort', width:'max'});

        col3.addItem(new Blank({width:10}));
        col3.addItem(label3);
        col3.addItem(new Blank({width:5}));
        col3.addItem(text3);
        col3.addItem(new Blank({width:70}));
        rowMain.addItem(col3);


        var col4 = new Colbar({cols:[], align:'left'}, {width:'max', height:25});
        var label4 = new Gframe.controls.Label({top:2, textAlign:'left', textCls:'show_font ', value:'*数字越大，排序越靠前', width:'max'});

        col4.addItem(new Blank({width:85}));
        col4.addItem(label4);
        rowMain.addItem(col4);


        var col5 = new Colbar({cols:[], align:'left'}, {width:'max', height:80});
        var label5 = new Gframe.controls.Label({textAlign:'right', textCls:'title_font', value:'备注：', width:70});
        var text5 = new Gframe.controls.TextArea({height:'70', name:'remark', leftHidden:true, width:'max'});

        col5.addItem(new Blank({width:10}));
        col5.addItem(label5);
        col5.addItem(new Blank({width:5}));
        col5.addItem(text5);
        col5.addItem(new Blank({width:70}));
        rowMain.addItem(col5);


        var col6 = new Colbar({cols:[], align:'left'}, {width:'max', height:36, top:10});
        var button1 = new Gframe.controls.Button({value:'确定', width:100, handler:me.confirmEdit});
        var button2 = new Gframe.controls.Button({ value:'取消', width:100, handler:function () {
            var form = me.mod.main.get('newEdit_id');
            form.reset();
            me.mod.main.popMgr.close('newEdit_id');
            me.mod.main.closeExpandView('rolesTree');
        }});

        col6.addItem(new Blank({width:140}));
        col6.addItem(button1);
        col6.addItem(new Blank({width:20}));
        col6.addItem(button2);
        col6.addItem(new Blank({width:70}));


        rowMain.addItem(col6);

        colMain.addItem(rowMain);
        form.addItem(2, colMain);
        form.update();
    };


    this.importContact = function () {
        var form = me.mod.main.get('newEdit_id');
        form.removeItem(2);
        form.update();

        var colMain = new Colbar({cols:[], align:'left'}, {width:'max', height:280});
        var rowMain = new Rowbar({rows:[]}, {width:'max', height:320});

        var col1 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
        var label1 = new Gframe.controls.Label({top:6, textAlign:'right', textCls:'title_font', value:'导入来源：', width:90});
        var upload = new Gframe.controls.DirectUpload({
            success:function () {
                var bu = CompMgr.getComp('confirmImport');
                bu.setEnabled(true);
            }
        }, {width:'max', label:'浏览', name:'uuid'});

        col1.addItem(new Blank({width:10}));
        col1.addItem(label1);
        col1.addItem(new Blank({width:5}));
        col1.addItem(upload);
        col1.addItem(new Blank({width:70}));
        rowMain.addItem(col1);


        var col2 = new Colbar({cols:[], align:'left'}, {width:'max', height:40});
        var label2 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'title_font', value:'excel模板导入指引：', width:'max'});

        col2.addItem(new Blank({width:80}));
        col2.addItem(label2);
        col2.addItem(new Blank({width:70}));
        rowMain.addItem(col2);


        var col3 = new Colbar({cols:[], align:'left'}, {width:'max', height:30});
        var label3 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'show_font ', value:'1：按规定的模板制作excel表格', width:'200'});
        var button3 = new Gframe.controls.Button({textCls:'alable',value:'模板下载', width:100, handler:me.downImport});
        col3.addItem(new Blank({width:80}));
        col3.addItem(label3);
        col3.addItem(button3);
        rowMain.addItem(col3);


        var col4 = new Colbar({cols:[], align:'left'}, {width:'max', height:90});
        var label4 = new Gframe.controls.Label({top:6, textAlign:'left', textCls:'show_font', value:'2：“浏览”→“确定”', width:'200'});

        col4.addItem(new Blank({width:80}));
        col4.addItem(label4);
        col4.addItem(new Blank({width:70}));
        rowMain.addItem(col4);


        var col5 = new Colbar({cols:[], align:'left'}, {width:'max', height:36, top:30});
        var button1 = new Gframe.controls.Button({value:'确定', enabled:false, width:100, handler:me.confirmImport});
        CompMgr.addComp('confirmImport', button1);

        var button2 = new Gframe.controls.Button({ value:'取消', width:100, handler:function () {
            var form = me.mod.main.get('newEdit_id');
            form.reset();
            me.mod.main.popMgr.close('newEdit_id');
        }});

        col5.addItem(new Blank({width:140}));
        col5.addItem(button1);
        col5.addItem(new Blank({width:20}));
        col5.addItem(button2);
        col5.addItem(new Blank({width:70}));


        rowMain.addItem(col5);

        colMain.addItem(rowMain);
        form.addItem(2, colMain);
        form.update();
    };


    //提交
    this.confirmUpdate = function () {
        var form = me.mod.main.get('newEdit_id');
        var o = form.serializeForm();
        if (!o.uuid) {
            o.uuid = uuid;
        }
        form.submit({
            service:$sl.gcontact_organizationContact_editContact_confirmUpdate.service,
            method:$sl.gcontact_organizationContact_editContact_confirmUpdate.method,
            params:o,
            success:function (response) {
                var data = util.parseJson(response.responseText);
                if (data.success) {
                    me.mod.main.alert({
                        text:data.msg,
                        level:'info',
                        delay:2000
                    });
                    me.mod.main.popMgr.close('newEdit_id');
                    form.reset();
                    me.mod.main.getNavigation().initMethod({type:'2'});
                    obj.refreshGrid();
                }
            }
        });
    };

    this.downImport = function () {
        mc.send({
            service:$sl.gcontact_organizationContact_newEditContact_downImport.service,
            method:$sl.gcontact_organizationContact_newEditContact_downImport.method,
            params:{
            },
            success:function (response) {
                var obj = util.parseJson(response.responseText);
                if (!Atom.isEmpty(obj) && !Atom.isEmpty(obj.uuid)) {
                    mc.download(obj.uuid);
                }
            }
        });

    };

    this.confirmImport = function () {
        var form = me.mod.main.get('newEdit_id');
        var o = form.serializeForm();
        form.submit({
            service:$sl.gcontact_organizationContact_newEditContact_EditContact.service,
            method:$sl.gcontact_organizationContact_newEditContact_EditContact.method,
            params:o,
            success:function (response) {
                var data = util.parseJson(response.responseText);
                if (data.success) {
                    me.mod.main.alert({
                        text:data.msg,
                        level:'info',
                        delay:2000
                    });
                    me.mod.main.popMgr.close('newEdit_id');
                    form.reset();
                    me.mod.main.getNavigation().initMethod({type:'2'});
                    obj.refreshGrid();
                }
            }
        });
    };


    this.confirmEdit = function () {
        var form = me.mod.main.get('newEdit_id');
        var da = form.serializeForm();
        var text = CompMgr.getComp('roleText_id');
//        var text = form.getByItemId('roleText_id');
        if (!da.parentUuid) {
            var puuids = util.parseJson(text.getValue());
            //console.log('puuids:',puuids);
            if (puuids.length) {
                da.parentUuid = puuids[0].uuid;
            }
        }
        delete da['members'];
        form.submit({
            service:$sl.gcontact_personContact_contactFolder_createContactFromDept.service,
            method:$sl.gcontact_personContact_contactFolder_createContactFromDept.method,
            params:da,
            success:function (response) {
                var data = util.parseJson(response.responseText);
                if (data.success) {
                    me.mod.main.alert({
                        text:data.msg,
                        level:'info',
                        delay:2000
                    });
                    me.mod.main.popMgr.close('newEdit_id');
                    form.reset();
                    me.mod.main.getNavigation().initMethod({type:'2'});
                    obj.refreshGrid();
                }
            }
        });
    };

});