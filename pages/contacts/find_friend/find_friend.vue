<template>
	<view>
		<uni-easyinput v-model="keywords" @confirm="search()" placeholder="输入用户名回车进行搜索" />

		<div class="contacts">
			<div class="contacts-container">
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid"
						@click="enterChat(friend.uuid, 'private')">
						<div class="user-item-avatar">
							<image :src="friend.avatar"></image>
						</div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{friend.name}}</span>
							<span class="online-tips"><button type="default" :disabled="
							friend.is_follow" @click="follow(friend)">{{friend.is_follow ? "已关注":"关注"}}</button></span>
						</div>
					</div>
				</div>
			</div>
		</div>
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
				button: true
			}
		},
		methods: {
			follow(friend){
				const follow = db.collection("uni-id-followers")
				let currentUser = uni.getStorageSync('currentUser');
				if (friend.is_follow){
					follow.where("_id=='"+friend.tid+"'").remove()
					this.init()
				}else{
					follow.add({
						"follow_uid":currentUser.uuid,
						"friend_uid":friend.uuid
					}).then(res => {
						this.init()
					}).catch(err => {
						console.log(err)
					})
				}
			},
			search() {
				this.init()
			},
			init() {
				let currentUser = uni.getStorageSync('currentUser');
				if (this.keywords == currentUser.name){
					this.friends == []
					return
				}
				let friendList = restApi.searchFriends(this.keywords);
				if (friendList.length == 0){
					this.friends == []
					return
				}
				friendList.map(async (friend, index) => {
					friend.online = false
					const follow_table = await db.collection("uni-id-followers").where('friend_uid=="'+friend.uuid+'"&&follow_uid=="'+currentUser.uuid+'"').get()
					if (follow_table.result.data.length > 0){
						friend.is_follow = true
						friend.tid = follow_table.result.data[0]._id
					}else{
						friend.is_follow = false
					}
					this.$set(this.friends, index, friend)
				})
				this.groups = restApi.findGroups(currentUser);
				this.subscribeUserPresence();
				this.hereNow();
				this.goEasy.im.on(this.GoEasy.IM_EVENT.USER_PRESENCE, (user) => {
					this.friends.map(friend => {
						if (friend.uuid == user.id) {
							let state = user.action === 'online' || user.action === 'join';
							this.$set(friend, 'online', state);
						}
					})
				})
			},
			subscribeUserPresence() {
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				});
				this.goEasy.im.subscribeUserPresence({
					userIds: friendIds,
					onSuccess: function() {
						console.log('订阅上下线成功')
					},
					onFailed: function(error) {
						console.log('订阅好友上下线失败', error)
					}
				});
			},
			hereNow() {
				let self = this;
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				})
				this.goEasy.im.hereNow({
					userIds: friendIds,
					onSuccess: function(result) {
						result.content.map(friend => {
							self.friends.map(item => {
								if (item.uuid == friend.id) {
									item.online = true;
								}
							})
						})
					},
					onFailed: function(error) {
						console.log('获取好友在线状态失败', error)
					}
				});
			},
			enterChat(uuid, type) { //进入私聊
				let path = type === this.GoEasy.IM_SCENE.PRIVATE ?
					'../chat/privateChat/privateChat?to=' + uuid :
					'../chat/groupChat/groupChat?to=' + uuid;
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style>
	@import url(../contacts.css);
</style>
