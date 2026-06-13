<template>
	<view class="page-settings">
		<!-- Avatar Preview -->
		<view class="avatar-section">
			<view class="avatar-wrap">
				<image
					class="avatar-img"
					:src="userInfo.userImage"
					mode="aspectFill"
				/>
				<view class="avatar-ring" />
			</view>
			<text class="avatar-hint">点击修改头像</text>
		</view>

		<!-- Info List -->
		<view class="info-card">
			<view
				class="info-item"
				v-for="(item, index) in infoTable"
				:key="index"
			>
				<view class="info-item-left">
					<text class="info-item-label">{{ item.name }}</text>
				</view>
				<view class="info-item-right">
					<view v-if="item.type === 'image'">
						<image
							class="info-avatar"
							:src="userInfo[item.key]"
							mode="aspectFill"
						/>
					</view>
					<text class="info-value" v-else>{{ userInfo[item.key] || "未设置" }}</text>
					<text class="info-arrow">&gt;</text>
				</view>
			</view>
		</view>

		<!-- Danger Zone -->
		<view class="danger-section">
			<button class="btn-danger">注销账户</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
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
.page-settings {
	max-width: 750rpx;
	margin: 0 auto;
	padding: 24rpx;
	min-height: 100vh;
	background: #F5F0E8;
}

/* ====== Avatar Section ====== */
.avatar-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}
.avatar-wrap {
	position: relative;
	width: 160rpx;
	height: 160rpx;
	margin-bottom: 16rpx;
}
.avatar-img {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
}
.avatar-ring {
	position: absolute;
	top: -8rpx;
	left: -8rpx;
	right: -8rpx;
	bottom: -8rpx;
	border-radius: 50%;
	border: 4rpx solid #C9953E;
	opacity: 0.4;
}
.avatar-hint {
	font-size: 24rpx;
	color: #9C8F85;
}

/* ====== Info Card ====== */
.info-card {
	background: #FDFBF8;
	border-radius: 20rpx;
	overflow: hidden;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
}
.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 28rpx 24rpx;
	border-bottom: 2rpx solid #F5F0E8;
	transition: background 0.15s;
}
.info-item:last-child {
	border-bottom: none;
}
.info-item:active {
	background: #F5F0E8;
}
.info-item-left {
	flex-shrink: 0;
}
.info-item-label {
	font-size: 28rpx;
	color: #2C2420;
	font-weight: 500;
}
.info-item-right {
	display: flex;
	align-items: center;
	gap: 12rpx;
	flex-shrink: 0;
}
.info-avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
}
.info-value {
	font-size: 26rpx;
	color: #9C8F85;
}
.info-arrow {
	font-size: 24rpx;
	color: #D4CBC0;
}

/* ====== Danger Zone ====== */
.danger-section {
	padding: 48rpx 0;
}
.btn-danger {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background: transparent;
	color: #9C8F85;
	font-size: 24rpx;
	border: 2rpx solid #E8E2D8;
	border-radius: 100rpx;
}
.btn-danger:active {
	border-color: #8B3A3A;
	color: #8B3A3A;
}
</style>
