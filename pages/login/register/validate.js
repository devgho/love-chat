export default {
		username:{
			rules:[
				{
					required: true,
					errorMessage: '请填写用户名'
				},
				{
					minLength: 3,
					maxLength: 8,
					errorMessage: '{label}长度在 {minLength} 到 {maxLength} 个字之间'
				}
			],
			label:'用户名',
			validateTrigger:'submit'
		},
		password:{
			rules:[
				{
					required: true,
					errorMessage: '请填写密码'
				},
				{
					minLength: 6,
					maxLength: 18,
					errorMessage: '{label}长度在 {minLength} 到 {maxLength} 个字之间'
				}
			],
			label:'密码',
			validateTrigger:'submit'
		},
		ensure:{
			rules:[
				{
					required: true,
					errorMessage:"请填写确认密码"
				},
				{
					minLength: 6,
					maxLength: 18,
					errorMessage:"{label}长度在{minLength}到{maxLength}个字之间"
				},
				{
					validateFunction:function(rule,value,data,callback){
						if(value!=data.password){
							callback('两次输入密码不一致')
						};
						return true
					}
				},
			],
			label:"确认密码"
		},
		mobile:{
			rules:[
				{
					required: true,
					errorMessage:"请输入手机号码"
				},
				{
					minLength: 11,
					maxLength: 11,
					errorMessage:"请输入正确的手机号码"
				}
			]
		},
		avatar:{
			rules:[
				{
					required:true,
					errorMessage:"请上传头像"
				},
				{
					validateFunction:function(rule,value,data,callback){
						if(value==undefined){
							callback('请上传头像啊')
						};
						return true
					}
				}
			]
		}	
	}