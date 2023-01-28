<template>
	<view>
		<button @click="open">创建群聊</button>
		<uni-popup ref="popup" background-color="#fff">
			群名:<uni-easyinput></uni-easyinput>
			<button @click="create_gp()">创建</button>
		</uni-popup>
	</view>
</template>
<script>
export default {
   methods:{
      open(){
        // 通过组件定义的ref调用uni-popup方法 ,如果传入参数 ，type 属性将失效 ，仅支持 ['top','left','bottom','right','center']
        this.$refs.popup.open('middle')
      },
	  create_gp(){
		  this.$refs.popup.close()
	  }
   }
}
</script>