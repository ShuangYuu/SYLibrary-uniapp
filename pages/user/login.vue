<template>
	<view class="page-login">
		<!-- Decorative Header -->
		<view class="login-header">
			<view class="login-header-deco" />
			<text class="login-welcome">欢迎回来</text>
			<text class="login-subtitle">登录您的读者账户</text>
		</view>

		<!-- Login Card -->
		<view class="login-card">
			<view class="login-card-inner">
				<!-- Phone Input -->
				<view class="input-group">
					<text class="input-label">手机号</text>
					<view class="input-field" :class="{'input-field-active': focusedField === 'phone'}">
						<text class="input-icon">&#x1F4F1;</text>
						<input
							type="text"
							v-model="form.phone"
							placeholder="请输入手机号码"
							maxlength="11"
							placeholder-style="color: #D4CBC0"
							@focus="focusedField = 'phone'"
							@blur="focusedField = ''"
						/>
					</view>
				</view>

				<!-- Password Input -->
				<view class="input-group">
					<text class="input-label">密码</text>
					<view class="input-field" :class="{'input-field-active': focusedField === 'password'}">
						<text class="input-icon">&#x1F512;</text>
						<input
							type="password"
							v-model="form.password"
							placeholder="请输入密码"
							placeholder-style="color: #D4CBC0"
							@focus="focusedField = 'password'"
							@blur="focusedField = ''"
						/>
					</view>
				</view>

				<!-- Login Button -->
				<button
					class="login-btn"
					:disabled="isLoading"
					@click="handleLogin"
				>
					<text v-if="!isLoading">登录</text>
					<text v-else>登录中...</text>
				</button>
			</view>
		</view>

		<!-- Footer -->
		<view class="login-footer">
			<text class="login-footer-text">首次使用？请联系图书馆管理员开通账户</text>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';

const isLoading = ref(false)
const focusedField = ref('')
const form = reactive({
	phone: '',
	password: ''
})

const handleLogin = () => {
	isLoading.value = true;

	uni.request({
		url: 'http://localhost:8080/user/login/password',
		method: 'POST',
		data: form,
		success: (res) => {
			if (res.data.code === 200) {
				uni.setStorageSync('accessToken', res.data.data.accessToken);
				uni.setStorageSync('refreshToken', res.data.data.refreshToken);

				uni.showToast({ title: '登录成功', icon: 'success' });
				console.log('登录成功: ', res.data.data.accessToken);

				uni.switchTab({ url: '/pages/index/index' });
			}
			else {
				uni.showToast({ title: res.data.msg || '登录失败', icon: 'error' });
			}
		},
		fail: (error) => {
			uni.showToast({ title: '登陆失败，请稍后重试', icon: 'error' })
		},
		complete: () => {
			isLoading.value = false;
		}
	});
};

</script>

<style scoped>
.page-login {
	max-width: 750rpx;
	margin: 0 auto;
	min-height: 100vh;
	background: #F5F0E8;
	display: flex;
	flex-direction: column;
	padding: 0 40rpx;
}

/* ====== Header ====== */
.login-header {
	padding: 80rpx 0 48rpx;
	position: relative;
}
.login-header-deco {
	position: absolute;
	top: 40rpx;
	left: -20rpx;
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	background: rgba(201, 149, 62, 0.08);
}
.login-welcome {
	font-size: 52rpx;
	font-weight: 700;
	color: #1B2A4A;
	display: block;
	margin-bottom: 12rpx;
}
.login-subtitle {
	font-size: 28rpx;
	color: #9C8F85;
	display: block;
}

/* ====== Card ====== */
.login-card {
	background: #FDFBF8;
	border-radius: 28rpx;
	box-shadow: 0 4rpx 24rpx rgba(44, 36, 32, 0.06);
	padding: 4rpx;
}
.login-card-inner {
	padding: 40rpx;
}

/* ====== Input Groups ====== */
.input-group {
	margin-bottom: 32rpx;
}
.input-label {
	display: block;
	font-size: 26rpx;
	font-weight: 500;
	color: #6B5E55;
	margin-bottom: 12rpx;
}
.input-field {
	display: flex;
	align-items: center;
	background: #F5F0E8;
	border-radius: 16rpx;
	padding: 0 24rpx;
	height: 88rpx;
	border: 2rpx solid #E8E2D8;
	transition: all 0.2s;
}
.input-field-active {
	border-color: #C9953E;
	background: #FDFBF8;
	box-shadow: 0 0 0 4rpx rgba(201, 149, 62, 0.1);
}
.input-icon {
	font-size: 28rpx;
	margin-right: 16rpx;
	flex-shrink: 0;
}
.input-field input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #2C2420;
}

/* ====== Button ====== */
.login-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	margin-top: 16rpx;
	background: linear-gradient(135deg, #1B2A4A, #2C4266);
	border-radius: 100rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #FDFBF8;
	border: none;
	transition: all 0.2s;
	box-shadow: 0 4rpx 16rpx rgba(27, 42, 74, 0.3);
}
.login-btn:active {
	transform: scale(0.97);
	opacity: 0.9;
}
.login-btn[disabled] {
	opacity: 0.5;
}

/* ====== Footer ====== */
.login-footer {
	padding: 48rpx 0;
	text-align: center;
}
.login-footer-text {
	font-size: 22rpx;
	color: #9C8F85;
}
</style>
