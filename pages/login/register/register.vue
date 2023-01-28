<template>
	<view>
		<uni-forms ref="form" labelPosition="top" :rules="rules">
			<uni-forms-item label="头像" name="avatar">
				<uni-file-picker v-model="formData.avatar" fileMediatype="image" mode="grid" @select="select" @progress="progress" @success="success" @fail="fail" limit="1"/>
			</uni-forms-item>
			<uni-forms-item label="用户名" name="username">
				<uni-easyinput v-model="formData.username" placeholder="请输入用户名,3到8个字符" />
			</uni-forms-item>
			<uni-forms-item label="密码" name="password">
				<uni-easyinput v-model="formData.password" placeholder="密码,6-15个字符" />
			</uni-forms-item>
			<uni-forms-item label="确认密码" name="ensure">
				<uni-easyinput v-model="formData.ensure" placeholder="请输入确认密码" />
			</uni-forms-item>
			<uni-forms-item label="手机号码" name="mobile">
				<uni-easyinput v-model="formData.mobile" placeholder="请输入手机号码" />
			</uni-forms-item>
			<button @click="submit" type="primary">确定</button>
		</uni-forms>
	</view>
</template>

<script>
	import rules from "./validate.js"
	
	export default {
		data() {
			return {
				formData: {
					avatar:undefined
				},
				rules
			}
		},
		methods: {
			submit(){
				if(this.formData.avatar == undefined){
					alert("请上传头像")
					return
				}
				this.$refs.form.validate().then(res=>{
					const db = uniCloud.database()
					const users = db.collection("uni-id-users")
					users.add({
						username:this.formData.username,
						password:this.formData.password,
						mobile:this.formData.mobile,
						avatar:this.formData.avatar[0].url
					}).then(res => {
						uni.showToast({
							title: '注册成功',
							icon:"success"
						});
						
						uni.navigateTo({
							url:"/pages/login/login"
						})
					}).catch(err=>{
						uni.showToast({
							title: '用户名已有人注册',
							icon:"error"
						});
					})
					
				}).catch(err=>{
					console.log('表单错误信息:',err)
				})
			},
			// 获取上传状态
			select(e) {
				console.log('选择文件：', e)
			},
			// 获取上传进度
			progress(e) {
				console.log('上传进度：', e)
			},

			// 上传成功
			success(e) {
				console.log('上传成功')
			},

			// 上传失败
			fail(e) {
				console.log('上传失败：', e)
			}
		},
		mounted() {
			plus.nativeUI.setUIStyle('light')
		}
	}
</script>

<style scoped>
	.uni-forms {
		padding: 20upx;
	}
</style>
