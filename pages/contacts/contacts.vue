<template>
	<div class="contacts">
	        <div class="contacts-container">
				<view class="contacts-title">
					群
					<uni-icons @click="find_gp()" style="float:right" type="plus" size="30"></uni-icons>
				</view>
				<div class="user-list">
					<div class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" @click="enterChat(group.uuid, 'group')">
						<div class="user-item-avatar">
							<image :src="group.avatar" />
						</div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{group.name}}</span>
						</div>
					</div>
				</div>
				<view class="contacts-title">
					联系人
					<uni-icons @click="find_friend()" style="float:right" type="plus" size="30"></uni-icons>
				</view>
	            <div class="user-list">
	                <div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" @click="enterChat(friend.uuid, 'private')">
	                    <div class="user-item-avatar">
							<image :src="friend.avatar"></image>
	                    </div>
	                    <div class="user-item-info">
	                        <span class="user-item-info__name">{{friend.name}}</span>
							<span class="online-tips">{{friend.online ? '在线' :'离线'}}</span>
	                    </div>
	                </div>
	            </div>
	        </div>
	    </div>
</template>

<script>

	import restApi from "../../lib/restapi";

	export default {
		name: "contacts",
		data () {
			return {
				friends : [],
				groups : []
			}
		},
		onShow () {
			this.init()
		},
		methods : {
			find_friend(){
				uni.navigateTo({
					url:"find_friend/find_friend"
				})
			},
			find_gp(){
				uni.navigateTo({
					url:"find_gp/find_gp"
				})
			},
			async init () {
				let currentUser = uni.getStorageSync('currentUser');
				let friendList = await restApi.findFriends(currentUser);
				// this.friends = [];
				this.groups = await restApi.findGroups(currentUser);
				friendList.map((friend ,index)=> {
					friend.online = false;
					this.$set(this.friends, index, friend);
				});
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
			subscribeUserPresence () {
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				});
				this.goEasy.im.subscribeUserPresence({
					userIds: friendIds,
					onSuccess: function () {
						console.log('订阅上下线成功')
					},
					onFailed: function (error) {
						console.log('订阅好友上下线失败',error)
					}
				});
			},
			hereNow () {
				let self = this;
				let friendIds = [];
				this.friends.map(friend => {
					friendIds.push(friend.uuid);
				})
				this.goEasy.im.hereNow({
					userIds: friendIds,
					onSuccess: function (result) {
						result.content.map(friend => {
							self.friends.map(item => {
								if(item.uuid == friend.id) {
									item.online = true;
								}
							})
						})
					},
					onFailed: function (error) {
						console.log('获取好友在线状态失败',error)
					}
				});
			},
			enterChat (uuid, type) {//进入私聊
				let path = type === this.GoEasy.IM_SCENE.PRIVATE
						? '../chat/privateChat/privateChat?to=' + uuid
						: '../chat/groupChat/groupChat?to=' + uuid;
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style>
	@import url(contacts.css);
</style>
