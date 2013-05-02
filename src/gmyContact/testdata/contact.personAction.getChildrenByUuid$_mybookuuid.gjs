{
      total:6,
	  path:[
	     {"name":"通讯录管理",value:""},
    	{"name":"我的通讯录","value":"mybookuuid"}    	
	   ],
	   role:{
	   		show:true,
	   		impower:true
	   },
   data:[
		{
			uuid : 'myrelateduuid' ,
			name:'我的联系人' , //当type为1的时候，//存在职称的时候需要拼接
			type:'2',//如果1表示人；2表示该数据是组创建人：
			email:'',
			jid:'',
			phone:'',
			remark:'我的联系人',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			role:{
		   		show:true,
		   		impower:false
	   		}
		},
		{
			uuid : '常用联系人uuid' ,
			name:'常用联系人' , //当type为1的时候，//存在职称的时候需要拼接
			type:'2',//如果1表示人；2表示该数据是组创建人：
			email:'',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			jid:'',
			phone:'',
			remark:'常用联系人',
			role:{
		   		show:true,
		   		impower:false
	   		}
		},
		{
			uuid : '最近联系人uuid' ,
			name:'最近联系人' , //当type为1的时候，//存在职称的时候需要拼接
			type:'2',//如果1表示人；2表示该数据是组创建人：
			email:'',
			jid:'',
			phone:'',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			remark:'最近联系人',
			role:{
		   		show:true,
		   		impower:false
	   		}
		},
		{
			uuid : 'frienduuid' ,
			name:'我的好友' , //当type为1的时候，//存在职称的时候需要拼接
			type:'2',//如果1表示人；2表示该数据是组创建人：
			email:'',
			jid:'',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			phone:'',
			remark:'我的好友',
			role:{
		   		show:true,
		   		impower:true
	   		}
		},
			{
			uuid : 'tongshiuuid' ,
			name:'我的同事' , //当type为1的时候，//存在职称的时候需要拼接
			type:'2',//如果1表示人；2表示该数据是组创建人：
			email:'',
			jid:'',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			phone:'',
			remark:'我的同事',
			role:{
		   		show:true,
		   		impower:true
	   		}
		},
			{
			uuid : '王飞的uuid' ,
			name:'王飞' , //当type为1的时候，//存在职称的时候需要拼接
			type:'1',//如果1表示人；2表示该数据是组创建人：
			email:'wanfei@163.com',
			jid:'22222',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			phone:'136787878',
			remark:'工程师',
			role:{
		   		show:true,
		   		impower:true
	   		}
		},
		{
			uuid : '郑赞欢的uuid' ,
			name:'郑赞欢' , //当type为1的时候，//存在职称的时候需要拼接
			type:'1',//如果1表示人；2表示该数据是组创建人：
			email:'wanfei@163.com',
			jid:'22222',
			bookType:'1',//  1标识个人通讯录   2、标识组织通讯  3标识团队通讯录
			phone:'136787878',
			remark:'工程师',
			role:{
		   		show:true,
		   		impower:true
	   		}
		}
					
]
}