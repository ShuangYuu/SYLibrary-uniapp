<template>
	<view class="info-box">
		<view class="info-item" v-for="(item, index) in infoTable" :key="index">
			<text>{{ item.name }}</text>
			<view class="info-value">
				<view v-if="item.type === 'image'">
					<image 
						class="user-avatar" 
						:src="userInfo[item.key]" 
						mode="aspectFill"
					/>
				</view>
				<text class="info-text" v-else>{{ userInfo[item.key] || "未设置" }}</text>
				<text style="margin-left: 8rpx;">></text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const userInfo = ref({
	username: '',
	userImage: '',
	phone: '',
});

const infoTable = [
	{ name: '修改昵称', key: 'username', type: 'text' },
	{ name: '修改头像', key: 'userImage', type: 'image' },
	{ name: '修改手机号', key: 'phone', type: 'text' },
];

onLoad((options) => {
	if(options.user){
		try {
			const userRaw = JSON.parse(decodeURIComponent(options.user));
			
			Object.assign(userInfo.value, userRaw);
			console.log("success: ", userInfo.value)

		} catch (e) {
			console.error('解析用户信息失败:', e);
			uni.showToast({ title: '用户信息解析错误', icon: 'none' });
		}
	}
})

</script>

<style scoped>
	
.info-box{
	width: 100%;
	margin: 20rpx 0;
}

.info-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	
	padding: 20rpx 20rpx;
	font-size: 35rpx;
	
	border-bottom: 2rpx solid #f0f0f0;
}

.info-text{
	font-size: 32rpx;
}

.user-avatar {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}

.info-value{
	display: flex;
	flex-direction: row;
	align-items: center;
}

</style>