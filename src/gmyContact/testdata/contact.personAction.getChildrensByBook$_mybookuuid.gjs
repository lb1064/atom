{
data:[
		 {
			  uuid:'1',
              path:'路径1',
			  name:'我的联系人',//节点名称
			  type:'2',//如果1表示人；2表示该数据是组
			  isLeaf:false,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'group',//’group’’contact’
	          
			  children:[
					{
						 uuid:'1.1',
             			 path:'路径1.1',
			 			 name:'节点1.1',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '王飞',
	          			 dataObj:{
									id : 'wangfei_id' ,
									username : '王飞KKKKKK' ,
									realName : '王飞' ,
									alt:'风雨倾城',
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
						 uuid:'1.2',
             			 path:'路径1.2',
			 			 name:'节点1.2',   //节点名称
			  			 type:'1',   //如果1表示人；2表示该数据是组
			  			 isLeaf:false,  //如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          			 xtype:'contact',  //’group’’contact’
	          			 realName : '田军' ,
	          			 dataObj:{
									id : 'tianjun_id' ,
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
							
					}
				]
		    },
		    {
			  uuid:'2',
              path:'路径2',
			  name:'常用联系人',//节点名称
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
	          			 realName : '马涛',
	          			 dataObj:{
									id : 'matao_id' ,
									username : '马涛' ,
									realName : '马涛' ,
									alt:'风雨倾城',
									sign:'我是马涛,这是我的签名',
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
			  name:'最近联系人',//节点名称
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
	          			 realName : '周霞',
	          			 dataObj:{
									id : 'zhouxia_id' ,
									username : '周霞' ,
									realName : '周霞' ,
									alt:'风雨倾城',
									sign:'我是周霞,这是我的签名',
									dept:'人事部',
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
	          			 realName : '朱凯',
	          			 dataObj:{
									id : 'zhouxia_id' ,
									username : '朱凯' ,
									realName : '朱凯' ,
									alt:'风雨倾城',
									sign:'我是朱凯,这是我的签名',
									dept:'研发部',
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
	          realName : '黄凯锋',
  			 dataObj:{
						id : 'huangjkaifeng_id' ,
						username : '黄凯锋' ,
						realName : '黄凯锋' ,
						alt:'风雨倾城',
						sign:'我是黄凯锋,这是我的签名',
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
	          realName : '应可',
  			 dataObj:{
						id : 'yingke_id' ,
						username : '应可' ,
						realName : '应可' ,
						alt:'风雨倾城',
						sign:'我是应可,这是我的签名',
						dept:'后台开发',
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
			  uuid:'6',
              path:'路径6',
			  name:'节点6',//节点名称
			  type:'1',//如果1表示人；2表示该数据是组
			  isLeaf:true,//如果为true，表示该组下面还有子节点；否则表示该组下面没有子节点
	          xtype:'contact',//’group’’contact’
	          realName : '郑赞欢',
  			 dataObj:{
						id : 'zengzanhuan_id' ,
						username : '郑赞欢' ,
						realName : '郑赞欢' ,
						alt:'风雨倾城',
						sign:'我是郑赞欢,这是我的签名',
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