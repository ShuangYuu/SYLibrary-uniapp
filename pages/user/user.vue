<template>
	<view class="container">	
		<view class="person">
			<image 
				class="person-image"
				:src="userInfo.userImage" 
				mode="aspectFill"
				@error="imageError"
			/>
			<text class="person-name">{{ userInfo.username || "未登录"}}</text>
		</view>
		
		<view class="other">
			<view class="menu-section">
				<view
					v-for="(item, index) in menuItems"
					:key="index"
					class="menu-item"
					@click="handlePathPush(item.path)"
				>
					<text>{{ item.name }}</text>
				</view>
			</view>
			
			<view v-if="userInfo.id">
				<button class="user-button" type="warn" @click="logout">退出登录</button>
			</view>
			<view v-else>
				<button class="user-button" type="primary" @click="uni.reLaunch({ url: '/pages/user/login' })">登录</button>
			</view>
		</view>
	</view>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue';
import request from '@/utils/request'

const userInfo = ref({
	id: '',
	username: '',
	userImage: '',
	phone: ''
})

const menuItems = [
	{ name: '设置', path: '/pages/user/settings'},
	{ name: '详细信息', path: '/pages/user/details' },
	{ name: '用户说明', path: '/pages/user/guide' },
]

const getUserInfo = () => {
	request({
		url: 'http://localhost:8080/user/info',
		method: 'GET',
	})
	.then((res) => {
		if(res.code === 200){
			userInfo.value = res.data;
			console.log("用户信息: ", userInfo);
			console.log("实际图片地址: ", userInfo.value.userImage);
		}
		else{
			uni.showToast({
				title: res.msg || '数据加载失败，请稍后重试', icon: 'error'
			});
		}
	})
	.catch((error) => {
		uni.showToast({ title: '数据加载失败', icon: 'error' });
		console.log('获取数据出错: ', error);
	});
}

onMounted(() => {
	getUserInfo();
})

const logout = () => {
	
	const refreshToken = uni.getStorageSync('refreshToken');
	
	request({
		url: 'http://localhost:8080/user/deleteToken',
		method: 'POST',
		data: {
			refreshToken: refreshToken
		}
	})
	.then(() => {
		uni.showToast({ title: '退出成功', icon: 'success' });
	})
	.catch((error) => {
		uni.showToast({ title: '出错了，请稍后重试', icon: 'error' });
	})
	.finally(() => {
		uni.clearStorageSync('accessToken');
		uni.clearStorageSync('refreshToken');
		userInfo.value = {
			id: '',
			username: '',
			userImage: '',
			phone: ''
		};
	})
	
}

const imageError = (e) => {
    // 如果图片加载失败，会在控制台输出错误信息，帮助定位问题
    console.error('头像图片加载失败:', e.detail.errMsg);
    uni.showToast({ title: '头像图片加载失败', icon: 'none' });
    // 可以设置一个本地默认头像 URL，例如'/static/default_avatar.png'
    // userInfo.value.userImage = ''; 
}

const handlePathPush = (path) => {
	const dataString = encodeURIComponent(JSON.stringify(userInfo.value));
	uni.navigateTo({ url: `${ path }?user=${ dataString }` });
}
	
</script>

<style scoped>
	
body {
    background-color: #d1d1d1;
}

.container{
	height: 89.9vh;
	width: 100%;
	
	display: flex;
	flex-direction: column;
}

.person{
	background-color: #fff;
	width: 100%;
	margin-top: 20rpx;
	
	display: flex;
	flex-direction: column;
	align-items: center;
	
}

.person-image{
	width: 250rpx;
	height: 250rpx;
	border-radius: 50%;
}

.person-name{
	margin-top: 5rpx;
	font-size: 34rpx;
}

.other{
	background-color: #fff;
	width: 100%;
	margin-top: 20rpx;
	
	flex-grow: 1;
}

.user-button{
	width: 250rpx;
}

.menu-section {
    margin: 20rpx 0;
    overflow: hidden;
    /* box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05); */
}

.menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 40rpx;
    /* 模拟分割线，除了最后一项 */
    border-bottom: 2rpx solid #f0f0f0; 
    transition: background-color 0.15s;
    font-size: 32rpx;
    color: #333;
}

</style>