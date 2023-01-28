<template>
	<view>
		<uni-popup ref="popup" type="top"></uni-popup>
		<uni-easyinput v-model="keywords" @confirm="search()" placeholder="输入群名称或群号回车进行搜索" />
		<div class="contacts">
			<div class="contacts-container">
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid"
						@click="lookInfo(friend.uuid, 'private')">
						<div class="user-item-avatar">
							<image :src="friend.avatar"></image>
						</div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{friend.name}}</span>
							<span class="online-tips"><button type="default" :disabled="friend.is_follow" @click.stop="follow(friend)">{{friend.is_follow ? "已加入":"加入"}}</button></span>
							
						</div>
					</div>
				</div>
				<div v-if="friends.length==0">
					<button type="default" @click="create_group()">新建群聊</button>
				</div>
			</div>
		</div>
		<uni-popup ref="popup" background-color="#fff">
			群名:<uni-easyinput v-model="new_group" />
			简介:<uni-easyinput  v-model="profile" placeholder="请输入群简介" />
			群头像:<uni-file-picker v-model="avatar" fileMediatype="image" mode="grid" limit="1"/>
			<button @click="create_gp()">创建</button>
		</uni-popup>
	</view>
</template>

<script>
	import restApi from "@/lib/restapi.js"
	const db = uniCloud.database()
	export default {
		data() {
			return {
				keywords: "",
				friends: [],
				button: true,
				new_group:"",
				profile:"",
				avatar:null
			}
		},
		methods: {
			create_group(){
				this.$refs.popup.open();
			},
			create_gp(){
				if (this.new_group==""||this.profile==""||this.avatar==null){
					alert("所有项都是必填项")
					return 
				}
				let currentUser = uni.getStorageSync('currentUser')
				console.log(this.avatar)
				const db = uniCloud.database()
				const gp = db.collection("group")
				gp.add({
					name:this.new_group,
					profile:this.profile,
					master:currentUser.uuid,
					avatar:this.avatar[0].url
				}).then(res=>{
					alert("创建成功")
				}).catch(err=>{
					alert("创建失败"+err)
				})
				this.$refs.popup.close()
			},
			follow(friend){
				const follow = db.collection("group-chat")
				let currentUser = uni.getStorageSync('currentUser')
				if (friend.is_follow){
					follow.where("_id=='"+friend.tid+"',follow_uid=='"+currentUser.uuid+"'").remove().then(res=>{
						console.log(res)
					}).catch(err=>{
						console.log(err)
					})
					this.search()
				}else{
					console.log("失败")
					follow.add({
						"follow_uid":currentUser.uuid,
						"group_uid":friend.uuid
					}).then(res => {
						console.log(res)
						this.search()
					}).catch(err => {
						console.log(err)
					})
				}
			},
			async search() {
				const gp = db.collection("group")
				const currentUser = uni.getStorageSync('currentUser')
				const res = await gp.where(`/${this.keywords}.*?/.test(name)||_id=='${this.keywords}'`).get()
				res.result.data.map((friend,index)=>{
					if (friend.master == currentUser.uuid){
						return
					}
					let dict = {
						uuid:friend._id,
						name:friend.name,
						avatar:friend.avatar,
						is_follow:true
					}
					db.collection("group-chat").where({
						follow_uid:currentUser.uuid,
						group_uid:friend._id
					}).get().then(re=>{
						if(re.result.data.length>0){
							dict.is_follow = true
							dict.tid = re.result.data[0]._id
							console.log(friend)
						}else{
							dict.is_follow = false
						}
					})
					this.$set(this.friends,index,dict)
				})
			}
		}
	}
</script>

<style>
	@import url(../contacts.css);
</style>
