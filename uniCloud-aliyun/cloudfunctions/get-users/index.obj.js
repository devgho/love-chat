// 开发文档: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
module.exports = {
	async get_all(){
		const db = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const all_users = await db.collection("uni-id-users").get()
		let user_list = []
		for(let i of all_users.data){
			let user_dict = {
				"uuid":i._id,
				"name":i.username,
				"avatar":i.avatar,
				"password":i.password
			}
			user_list.push(user_dict)
		}
		return user_list
	},
	async get_groups(userId){
		const db = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const gp_ct = await db.collection("group-chat").where({
			follow_uid:userId
		}).getTemp()
		const user_groups = await db.collection(gp_ct,"group").get()
		const group_list = []
		const mine_group = await db.collection("group").where({
			master:userId
		}).get()
		for (let i of mine_group.data){
			let dict = {
					uuid:i._id,
					name:i.name,
					avatar:i.avatar,
					profile:i.profile,
					master:i.master,
					"userList": ['08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a', 'fdee46b0-4b01-4590-bdba-6586d7617f95',
						'33c3693b-dbb0-4bc9-99c6-fa77b9eb763f'
					]
				}
			group_list.push(dict)
		}
		for (let i of user_groups.data){
			let dict = {
				uuid:i.group_uid[0]._id,
				name:i.group_uid[0].name,
				avatar:i.group_uid[0].avatar,
				profile:i.group_uid[0].profile,
				master:i.group_uid[0].master
			}
			group_list.push(dict)
		}
		
		return group_list
		// return mine_group
	},
	async get_group_id(id){
		const db = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const group = await db.collection("group").where({
			_id:id
		}).get()
		const new_group = {
			uuid:group.data[0]._id,
			name:group.data[0].name,
			avatar:group.data[0].avatar
		}
		return new_group
	},
	async get_group_members(id){
		const db = uniCloud.databaseForJQL({
			clientInfo: this.getClientInfo()
		})
		const gc = await db.collection("group-chat").where({
			group_uid:id
		}).getTemp()
		const members = await db.collection(gc,"uni-id-users").get()
		const gp = await db.collection("group").where({
			_id:id
		}).getTemp()
		const master = await db.collection(gp,"uni-id-users").get()
		const mlist = []
		members.data.map(v=>{
			let dict = {
				uuid:v.follow_uid[0]._id,
				name:v.follow_uid[0].username,
				avatar:v.follow_uid[0].avatar,
				mobile:v.follow_uid[0].mobile
			}
			mlist.push(dict)
		})
		const result = {
			master:{
				uuid:master.data[0].master[0]._id,
				name:master.data[0].master[0].username,
				avatar:master.data[0].master[0].avatar,
				mobile:master.data[0].master[0].mobile
			},
			members:mlist
		}
		return result
	}
}
