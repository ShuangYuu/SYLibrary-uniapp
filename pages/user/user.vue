<template>
	<view class="page-user">
		<!-- Profile Card -->
		<view class="profile-card">
			<view class="profile-avatar-wrap">
				<image
					class="profile-avatar"
					:src="userInfo.userImage"
					mode="aspectFill"
					@error="imageError"
				/>
				<view class="profile-avatar-border" />
			</view>
			<text class="profile-name">{{ userInfo.username || '读者' }}</text>
			<text class="profile-phone" v-if="userInfo.phone">{{ userInfo.phone }}</text>
			<view class="profile-badge" v-if="userInfo.id">
				<text class="profile-badge-text">已认证读者</text>
			</view>
		</view>

		<!-- Stats Row -->
		<view class="stats-row" v-if="userInfo.id">
			<view class="stat-item">
				<text class="stat-value">0</text>
				<text class="stat-label">借阅中</text>
			</view>
			<view class="stat-divider" />
			<view class="stat-item">
				<text class="stat-value">0</text>
				<text class="stat-label">已借阅</text>
			</view>
			<view class="stat-divider" />
			<view class="stat-item">
				<text class="stat-value">0</text>
				<text class="stat-label">收藏</text>
			</view>
		</view>

		<!-- Menu Section -->
		<view class="menu-card">
			<view
				class="menu-item"
				v-for="(item, index) in menuItems"
				:key="index"
				@click="handlePathPush(item.path)"
			>
				<view class="menu-item-left">
					<view class="menu-icon" :style="{ background: item.color }">
						<text class="menu-icon-text">{{ item.icon }}</text>
					</view>
					<text class="menu-item-name">{{ item.name }}</text>
				</view>
				<view class="menu-item-right">
					<text class="menu-arrow">&gt;</text>
				</view>
			</view>
		</view>

		<!-- Action Button -->
		<view class="action-section">
			<button
				v-if="userInfo.id"
				class="btn-logout"
				@click="logout"
			>退出登录</button>
			<button
				v-else
				class="btn-login"
				@click="uni.reLaunch({ url: '/pages/user/login' })"
			>登录 / 注册</button>
		</view>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import request from '@/utils/request'

const userInfo = ref({
	id: '',
	username: '',
	userImage: '',
	phone: ''
})

const menuItems = [
	{ name: '账户设置', path: '/pages/user/settings', icon: '\u2699\uFE0F', color: '#1B2A4A' },
	{ name: '详细信息', path: '/pages/user/details', icon: '\uD83D\uDCCB', color: '#C9953E' },
	{ name: '用户说明', path: '/pages/user/guide', icon: '\uD83D\uDCD6', color: '#4A7C59' },
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
	console.error('头像图片加载失败:', e.detail.errMsg);
	uni.showToast({ title: '头像图片加载失败', icon: 'none' });
}

const handlePathPush = (path) => {
	const dataString = encodeURIComponent(JSON.stringify(userInfo.value));
	uni.navigateTo({ url: `${ path }?user=${ dataString }` });
}

</script>

<style scoped>
.page-user {
	max-width: 750rpx;
	margin: 0 auto;
	padding: 24rpx;
	min-height: 100vh;
	background: #F5F0E8;
}

/* ====== Profile Card ====== */
.profile-card {
	background: linear-gradient(135deg, #1B2A4A 0%, #2C4266 100%);
	border-radius: 24rpx;
	padding: 48rpx 32rpx 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	overflow: hidden;
}
.profile-card::before {
	content: '';
	position: absolute;
	top: -60rpx;
	right: -60rpx;
	width: 240rpx;
	height: 240rpx;
	border-radius: 50%;
	background: rgba(253, 251, 248, 0.05);
}
.profile-card::after {
	content: '';
	position: absolute;
	bottom: -80rpx;
	left: -40rpx;
	width: 200rpx;
	height: 200rpx;
	border-radius: 50%;
	background: rgba(253, 251, 248, 0.03);
}

.profile-avatar-wrap {
	position: relative;
	width: 140rpx;
	height: 140rpx;
	margin-bottom: 16rpx;
}
.profile-avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 50%;
}
.profile-avatar-border {
	position: absolute;
	top: -6rpx;
	left: -6rpx;
	right: -6rpx;
	bottom: -6rpx;
	border-radius: 50%;
	border: 4rpx solid rgba(201, 149, 62, 0.5);
}

.profile-name {
	font-size: 34rpx;
	font-weight: 600;
	color: #FDFBF8;
	margin-bottom: 6rpx;
}
.profile-phone {
	font-size: 24rpx;
	color: rgba(253, 251, 248, 0.6);
	margin-bottom: 12rpx;
}
.profile-badge {
	padding: 6rpx 20rpx;
	background: rgba(201, 149, 62, 0.2);
	border: 2rpx solid rgba(201, 149, 62, 0.4);
	border-radius: 100rpx;
}
.profile-badge-text {
	font-size: 20rpx;
	color: #DFB06A;
}

/* ====== Stats Row ====== */
.stats-row {
	display: flex;
	background: #FDFBF8;
	border-radius: 20rpx;
	padding: 24rpx 16rpx;
	margin: 24rpx 0;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
}
.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6rpx;
}
.stat-value {
	font-size: 36rpx;
	font-weight: 700;
	color: #1B2A4A;
}
.stat-label {
	font-size: 22rpx;
	color: #9C8F85;
}
.stat-divider {
	width: 2rpx;
	background: #E8E2D8;
}

/* ====== Menu Card ====== */
.menu-card {
	background: #FDFBF8;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
	margin-bottom: 24rpx;
}
.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 2rpx solid #F5F0E8;
	transition: background 0.15s;
}
.menu-item:last-child {
	border-bottom: none;
}
.menu-item:active {
	background: #F5F0E8;
}
.menu-item-left {
	display: flex;
	align-items: center;
	gap: 20rpx;
}
.menu-icon {
	width: 56rpx;
	height: 56rpx;
	border-radius: 14rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}
.menu-icon-text {
	font-size: 26rpx;
}
.menu-item-name {
	font-size: 28rpx;
	color: #2C2420;
	font-weight: 500;
}
.menu-item-right {
	display: flex;
	align-items: center;
}
.menu-arrow {
	font-size: 28rpx;
	color: #D4CBC0;
}

/* ====== Action Section ====== */
.action-section {
	padding: 8rpx 0;
}
.btn-login, .btn-logout {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 100rpx;
	font-size: 30rpx;
	font-weight: 500;
	border: none;
	transition: opacity 0.2s;
}
.btn-login:active, .btn-logout:active {
	opacity: 0.8;
}
.btn-login {
	background: linear-gradient(135deg, #1B2A4A, #2C4266);
	color: #FDFBF8;
}
.btn-logout {
	background: #FDFBF8;
	color: #8B3A3A;
	border: 2rpx solid #E8E2D8;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
}
</style>
