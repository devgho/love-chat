let users = []

const GetUsers = uniCloud.importObject("get-users")
GetUsers.get_all().then(res => {
	users.push.apply(users, res)
})
//用户数据示例

//群数据示例
let groups = [{
		"uuid": "group-a42b-47b2-bb1e-15e0f5f9a19a",
		"name": "小程序交流群",
		"avatar": '/static/images/wx.png',
		"userList": ['08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a', '3bb179af-bcc5-4fe0-9dac-c05688484649',
			'fdee46b0-4b01-4590-bdba-6586d7617f95', '33c3693b-dbb0-4bc9-99c6-fa77b9eb763f'
		]
	},
	{
		"uuid": "group-4b01-4590-bdba-6586d7617f95",
		"name": "UniApp交流群",
		"avatar": '/static/images/uniapp.png',
		"userList": ['08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a', 'fdee46b0-4b01-4590-bdba-6586d7617f95',
			'33c3693b-dbb0-4bc9-99c6-fa77b9eb763f'
		]
	},
	{
		"uuid": "group-dbb0-4bc9-99c6-fa77b9eb763f",
		"name": "GoEasy交流群",
		"avatar": '/static/images/goeasy.jpeg',
		"userList": ['08c0a6ec-a42b-47b2-bb1e-15e0f5f9a19a', '3bb179af-bcc5-4fe0-9dac-c05688484649']
	}
];


function RestApi() {

}

RestApi.prototype.searchFriends = function(name) {
	let currentUser = uni.getStorageSync('currentUser')
	var friendList = users.filter(v => v.name == name)
	return friendList
}

RestApi.prototype.findFriends = async function (user) {
	// var friendList = users.filter(v => v.uuid != user.uuid);
	// return friendList;
	const db = uniCloud.database()
	const follow = await db.collection("uni-id-followers").where("follow_uid=='" + user.uuid + "'").getTemp()
	const friends = await db.collection(follow,"uni-id-users").get()
	const friend_list = []
	for (let i of friends.result.data){
		let flist = {
			uuid:i.friend_uid[0]._id,
			name:i.friend_uid[0].username,
			avatar:i.friend_uid[0].avatar,
			mobile:i.friend_uid[0].mobile
		}
		friend_list.push(flist)
	}
	return friend_list
}

RestApi.prototype.findGroups = async function(user) {
	const value = await GetUsers.get_groups(user.uuid);
	return value;
}

RestApi.prototype.findUser = function(username, password) {
	let user = users.find(user => (user.name === username && user.password === password));
	if (user) {
		return {
			uuid: user.uuid,
			avatar: user.avatar,
			name: user.name
		};
	}
	return user;
}

RestApi.prototype.findGroupById = async function(groupId) {
	// var group = groups.find(group => (group.uuid == groupId));
	let group = await GetUsers.get_group_id(groupId)
	return group;
};


RestApi.prototype.findUserById = function(userId) {
	var user = users.find(user => (user.uuid == userId))
	return user;
};



RestApi.prototype.findGroupMembers = async function(groupId) {
	// let members = [];
	// let group = groups.find(v => v.uuid == groupId);
	// users.map(user => {
	// 	if (group.userList.find(v => v == user.uuid)) {
	// 		members.push(user)
	// 	}
	// });
	let members = await GetUsers.get_group_members(groupId);
	return members;
}

export default new RestApi();
