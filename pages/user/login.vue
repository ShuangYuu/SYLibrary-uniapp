<template>
	<view style="display: flex; height: 100vh; justify-content: center; align-items: center; background-color: #f0f2f5;">
		<view class="login-box">
			<h2 class="login-title">用户登录</h2>
			<view class="input-box">
				<text class="label">手机号</text>
				<input 
					type="text"
					v-model="form.phone"
					placeholder="请输入手机号码"
					maxlength="11"
				/>
			</view>
			<view class="input-box">
				<text class="label">密码</text>
				<input 
					type="password"
					v-model="form.password"
					placeholder="请输入密码"
				/>
			</view>
			<button class="login-button" type="primary" :disabled="isLoading" @click="handleLogin"> {{ isLoading ? "正在登录..." : "登录" }} </button>
		</view>
	</view>
</template>

<script setup>
import { reactive, ref } from 'vue';

const isLoading = ref(false)
const form = reactive({
	phone: '',
	password: ''
})

const handleLogin = () => {
	isLoading.value = true;
	
	uni.request({
		url: 'http://localhost:8080/user/login',
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

<style>
.login-box {
  width: 75%;
  height: 500rpx;
  background-color: #ffffff;
  padding: 30px; /* 增加内边距，让内容不紧贴边缘 */
  border-radius: 8px; /* 增加圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 增加阴影，更具立体感 */
}

.login-title {
  text-align: center;
  margin-bottom: 35px;
  color: #333;
}

.input-box {
	display: flex;
	align-items: center;
	margin-bottom: 45rpx;
	border-bottom: 1px solid #eee;
	padding: 10rpx 0;
}

.label {
	width: 120rpx;
	font-size: 32rpx;
	color: #666;
}

.input {
	flex: 1;
	height: 80rpx;
	font-size: 32rpx;
    padding-left: 20rpx;
}

.login-button {
	margin-top: 55rpx;
	height: 90rpx;
	line-height: 90rpx;
	font-size: 30rpx;
    border-radius: 45rpx;
}
</style>