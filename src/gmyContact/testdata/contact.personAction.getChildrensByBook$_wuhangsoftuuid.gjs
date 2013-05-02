{
data:[
		 {
			  uuid:'1',
              path:'路径1',
			  name:'武汉研发部',//节点名称
			  type:'2',//如果1表示人；2表示该数据是组
			  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'group',//’group’’contact’
			  children:[
			  		{
			  		  uuid:'1.1',
		              path:'路径1.1',
					  name:'武汉研发部一',//节点名称
					  type:'2',//如果1表示人；2表示该数据是组
					  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
			          xtype:'group',//’group’’contact’
					  children:[
					  	{
						 uuid:'1.1.1',
             			 path:'路径1.1.1',
			 			 name:'节点1.1.1',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '宗明亮',
	          			 dataObj:{
									id : 'zml_id' ,
									username : '宗明亮' ,
									realName : '宗明亮' ,
									alt:'风雨倾城',
									sign:'我是宗明亮,这是我的签名',
									dept:'研发部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'wangfei@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
						},
					  {
						 uuid:'1.1.2',
             			 path:'路径1.1.2',
			 			 name:'节点1.1.2',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '田军' ,
	          			 dataObj:{
									id : 'tj_id' ,
									username : '田军' ,
									realName : '田军' ,
									alt:'风雨倾城',
									sign:'我是田军,这是我的签名',
									dept:'研发部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'tianjun@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
							
						}]
			  		},					
						{
			  		  uuid:'1.2',
		              path:'路径1.2',
					  name:'武汉研发部二',//节点名称
					  type:'2',//如果1表示人；2表示该数据是组
					  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
			          xtype:'group',//’group’’contact’
					  children:[
					  	{
						 uuid:'1.2.1',
             			 path:'路径1.2.1',
			 			 name:'节点1.2.1',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '王飞',
	          			 dataObj:{
									id : 'zml_id' ,
									username : '王飞' ,
									realName : '王飞' ,
									alt:'王飞',
									sign:'我是王飞,这是我的签名',
									dept:'研发部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'wangfei@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
						},
						{
						 uuid:'1.2.2',
             			 path:'路径1.2',
			 			 name:'节点1.2',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '李小兵' ,
	          			 dataObj:{
									id : 'lxb_id' ,
									username : '李小兵' ,
									realName : '李小兵' ,
									alt:'风雨倾城',
									sign:'我是李小兵,这是我的签名',
									dept:'研发部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'tianjun@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
							
						}
					  ]
				}			
			]
		    },
		    {
			  uuid:'2',
              path:'路径2',
			  name:'武汉综合部',//节点名称
			  type:'2',//如果1表示人；2表示该数据是组
			  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'group',//’group’’contact’
			  children:[
					{
						 uuid:'2.1',
             			 path:'路径2.1',
			 			 name:'节点2.1',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '杜超',
	          			 dataObj:{
									id : 'duchao_id' ,
									username : '杜超' ,
									realName : '杜超' ,
									alt:'风雨倾城',
									sign:'我是杜超,这是我的签名',
									dept:'综合部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'wangfei@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
					},
					{
						 uuid:'2.2',
             			 path:'路径2.2',
			 			 name:'节点2.2',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '周霞',
	          			 dataObj:{
									id : 'zxia_id' ,
									username : '周霞' ,
									realName : '周霞' ,
									alt:'风雨倾城',
									sign:'我是周霞,这是我的签名',
									dept:'后台开发',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'wangfei@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
					}
				]
		    },
		     {
			  uuid:'3',
              path:'路径3',
			  name:'武汉测试部',//节点名称
			  type:'2',//如果1表示人；2表示该数据是组
			  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'group',//’group’’contact’
			  children:[
					{
						 uuid:'3.1',
             			 path:'路径3.1',
			 			 name:'节点3.1',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '黄朝娇',
	          			 dataObj:{
									id : 'hcj_id' ,
									username : '黄朝娇' ,
									realName : '黄朝娇' ,
									alt:'风雨倾城',
									sign:'我是黄朝娇,这是我的签名',
									dept:'测试部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'zhouxia@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
					},
					{
						 uuid:'3.2',
             			 path:'路径3.2',
			 			 name:'节点3.2',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '孙思',
	          			 dataObj:{
									id : 'sunsi_id' ,
									username : '孙思' ,
									realName : 'sunsi' ,
									alt:'风雨倾城',
									sign:'我是孙思,这是我的签名',
									dept:'测试部',
									phone:'1386767676',
									tel:'027-88888888',
									fax:'027-88888888',
									email : 'zhouxia@gsoft.com.cn' ,
									homepage : 'www.gsoft.com.cn' ,
									state : '在线' ,
									init : function(){Contact.call(this);}
								}
					}
				]
		    },
		     {
			  uuid:'4',
              path:'路径4',
			  name:'节点4',//节点名称
			  type:'1',//如果1表示人；2表示该数据是组
			  isLeaf:true,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'contact',//’group’’contact’
	          realName : '武汉胡艺',
  			 dataObj:{
						id : 'hy_id' ,
						username : '武汉胡艺' ,
						realName : '武汉胡艺' ,
						alt:'风雨倾城',
						sign:'我是胡艺,这是我的签名',
						dept:'研发部',
						phone:'1386767676',
						tel:'027-88888888',
						fax:'027-88888888',
						email : 'zhouxia@gsoft.com.cn' ,
						homepage : 'www.gsoft.com.cn' ,
						state : '在线' ,
						init : function(){Contact.call(this);}
					}
		    },
		      {
			  uuid:'5',
              path:'路径5',
			  name:'节点5',//节点名称
			  type:'1',//如果1表示人；2表示该数据是组
			  isLeaf:true,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'contact',//’group’’contact’
	          realName : '武汉应可',
  			 dataObj:{
						id : 'wujialins_id' ,
						username : '武汉应可' ,
						realName : '武汉应可' ,
						alt:'风雨倾城',
						sign:'我是武汉应可,这是我的签名',
						dept:'后台开发',
						phone:'1386767676',
						tel:'027-88888888',
						fax:'027-88888888',
						email : 'zhouxia@gsoft.com.cn' ,
						homepage : 'www.gsoft.com.cn' ,
						state : '在线' ,
						init : function(){Contact.call(this);}
					}
		}
 ]
}