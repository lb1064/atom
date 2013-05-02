/*
 * 通讯录管理主列表（获取所有的通讯录）
 * 
 */
{
    path:[
    {"name":"通讯录管理","value":"dea59067-6b95-463a-a885-266813cebe40"}
    ],
    role:{
    	show:true,
    	impower:true
    },
	data:[
			{
				uuid : 'mybookuuid' ,
				name:'我的通讯录',
				remark:'这是我的通讯录',
				type:'1' , //1个人  2 组织  3团队
				creator:'郑赞欢',
				creatTim:'2011-12-18',
				role:{
			    	show:true,
			    	impower:false
    			}
			},
			{
				uuid : 'myteamuuid' ,
				name:'我的团队',
				remark:'这是我的团队',
				type:'3' , //1个人  2 组织  3团队
				creator:'郑赞欢',
				creatTim:'2011-12-18',
				role:{
			    	show:true,
				    impower:false
    			}
			},
			{
				uuid : 'gsoftuuid' ,
				name:'中科天翔',
				remark:'中科天翔',
				type:'2' , //1个人  2 组织  3团队
				creator:'王飞',
				creatTim:'2011-12-18',
				role:{
			    	show:true,
				    impower:true
    			}
    		},
			{
				uuid : 'whgsoftuuid',
				name:'武汉中科天翔',
				remark:'武汉中科天翔',
				type:'2' , //1个人  2 组织  3团队
				creator:'王飞',
				creatTim:'2011-12-18',
				role:{
			    	show:true,
				    impower:false
    			}
			}
		]
		
}
