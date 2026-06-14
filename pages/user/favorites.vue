<template>
	<view class="page-favorites">
		<view v-if="isLoading" class="state-block">
			<text class="state-text">加载中...</text>
		</view>

		<view v-else-if="favoriteList.length === 0" class="state-block">
			<text class="state-icon">&#x1F516;</text>
			<text class="state-text">还没有收藏图书</text>
			<text class="state-hint">在书籍详情页点击收藏，之后就能在这里快速找到</text>
		</view>

		<view v-else class="book-grid">
			<view
				class="book-card"
				v-for="book in favoriteList"
				:key="book.book_id || book.id"
				@click="goBookDetail(book)"
			>
				<view class="book-cover-wrap">
					<image class="book-cover" :src="book.imageUrl || '/static/logo.png'" mode="aspectFit" />
				</view>
				<text class="book-name">{{ book.name }}</text>
				<text class="book-author" v-if="book.author">{{ book.author }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app';
import { ref } from 'vue';
import request from '@/utils/request';

const isLoading = ref(false);
const favoriteList = ref([]);

const loadFavorites = () => {
	if (!uni.getStorageSync('accessToken')) {
		favoriteList.value = [];
		uni.showToast({ title: '请先登录', icon: 'none' });
		uni.reLaunch({ url: '/pages/user/login' });
		return;
	}

	isLoading.value = true;
	request({
		url: 'http://localhost:8080/user/favorites',
		method: 'GET'
	})
	.then((res) => {
		if (res.code === 200) {
			favoriteList.value = Array.isArray(res.data) ? res.data : [];
		} else {
			uni.showToast({ title: res.msg || '收藏加载失败', icon: 'none' });
		}
	})
	.catch(() => {
		uni.showToast({ title: '收藏加载失败', icon: 'none' });
	})
	.finally(() => {
		isLoading.value = false;
	});
}

const goBookDetail = (book) => {
	const dataString = encodeURIComponent(JSON.stringify(book));
	uni.navigateTo({ url: `/pages/book/show?book=${dataString}` });
}

onShow(() => {
	loadFavorites();
});
</script>

<style scoped>
.page-favorites {
	max-width: 750rpx;
	margin: 0 auto;
	min-height: 100vh;
	padding: 24rpx 24rpx 40rpx;
	background: #F5F0E8;
}
.book-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 20rpx;
	row-gap: 32rpx;
	align-items: start;
}
.book-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 0;
	transition: transform 0.15s;
}
.book-card:active {
	transform: scale(0.96);
}
.book-cover-wrap {
	width: 100%;
	height: 330rpx;
	margin-bottom: 12rpx;
	display: flex;
	align-items: flex-start;
	justify-content: center;
	overflow: hidden;
}
.book-cover {
	width: 100%;
	height: 100%;
}
.book-name {
	width: 100%;
	font-size: 24rpx;
	font-weight: 600;
	color: #2C2420;
	overflow: hidden;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-height: 1.35;
	text-align: center;
}
.book-author {
	width: 100%;
	font-size: 20rpx;
	color: #9C8F85;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	text-align: center;
	margin-top: 4rpx;
}
.state-block {
	min-height: 520rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	text-align: center;
}
.state-icon {
	font-size: 76rpx;
	opacity: 0.45;
}
.state-text {
	font-size: 28rpx;
	color: #6B5E55;
}
.state-hint {
	font-size: 24rpx;
	color: #9C8F85;
	line-height: 1.5;
	max-width: 520rpx;
}
</style>
