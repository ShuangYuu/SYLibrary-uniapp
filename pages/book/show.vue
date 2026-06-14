<template>
	<view class="page-book">
		<!-- Book Cover -->
		<view class="book-cover-section">
			<view class="book-cover-wrap">
				<image :src="book.imageUrl" mode="aspectFill" class="book-cover-img" />
				<view class="book-cover-shadow" />
			</view>
		</view>

		<!-- Book Info -->
		<view class="book-info-section">
			<text class="book-title">{{ book.name }}</text>

			<!-- Meta Row -->
			<view class="book-meta" v-if="book.author || book.publisher">
				<text class="book-meta-item" v-if="book.author">
					<text class="meta-label">作者：</text>{{ book.author }}
				</text>
				<text class="book-meta-divider" v-if="book.author && book.publisher">|</text>
				<text class="book-meta-item" v-if="book.publisher">
					<text class="meta-label">出版社：</text>{{ book.publisher }}
				</text>
			</view>

			<!-- Tags -->
			<view class="book-tags" v-if="book.tags">
				<view class="book-tag" v-for="(tag, index) in tagList" :key="index">
					<text>{{ tag }}</text>
				</view>
			</view>

			<!-- Description -->
			<view class="book-desc-section" v-if="book.comment">
				<text class="book-desc-label">内容简介</text>
				<text class="book-desc-text">{{ book.comment }}</text>
			</view>

			<!-- Action Buttons -->
			<view class="book-actions">
				<button class="btn-borrow" @click="handleBorrow">
					<text>立即借阅</text>
				</button>
				<view class="btn-fav" :class="{ 'btn-fav-active': isFavorite }" @click="handleFavorite">
					<text v-if="isFavorite" class="fav-icon">&#x2665;</text>
					<text v-else class="fav-icon">&#x2661;</text>
					<text>{{ isFavorite ? '已收藏' : '收藏' }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
import request from '@/utils/request'

const book = ref({});
const isFavorite = ref(false);

const tagList = computed(() => {
	if (!book.value.tags) return []
	return book.value.tags.split(/[,，、\s]+/).filter(t => t.trim())
});

onLoad((options) => {
	if(options.book){
		book.value = JSON.parse(decodeURIComponent(options.book));
		console.log('获取书本数据成功: ', book);
		loadFavoriteState();
	}
});

const handleBorrow = () => {
	uni.showToast({ title: '借阅功能开发中', icon: 'none' });
}

const handleFavorite = () => {
	if (!book.value.book_id) {
		uni.showToast({ title: '图书信息不完整', icon: 'none' });
		return;
	}
	if (!uni.getStorageSync('accessToken')) {
		uni.showToast({ title: '请先登录', icon: 'none' });
		uni.reLaunch({ url: '/pages/user/login' });
		return;
	}

	request({
		url: `https://api.shuangyuhub.com/user/favorites/${book.value.book_id}`,
		method: isFavorite.value ? 'DELETE' : 'POST'
	})
	.then((res) => {
		if (res.code === 200) {
			isFavorite.value = !isFavorite.value;
			uni.showToast({ title: isFavorite.value ? '已加入收藏' : '已取消收藏', icon: 'success' });
		} else {
			uni.showToast({ title: res.msg || '操作失败', icon: 'none' });
		}
	})
	.catch(() => {
		uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' });
	});
}

const loadFavoriteState = () => {
	if (!book.value.book_id || !uni.getStorageSync('accessToken')) {
		isFavorite.value = false;
		return;
	}

	request({
		url: `https://api.shuangyuhub.com/user/favorites/${book.value.book_id}`,
		method: 'GET'
	})
	.then((res) => {
		if (res.code === 200) {
			isFavorite.value = Boolean(res.data);
		}
	})
	.catch(() => {
		isFavorite.value = false;
	});
}
</script>

<style scoped>
.page-book {
	max-width: 750rpx;
	margin: 0 auto;
	min-height: 100vh;
	background: #F5F0E8;
	padding-bottom: 40rpx;
}

/* ====== Cover Section ====== */
.book-cover-section {
	padding: 40rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
}
.book-cover-wrap {
	position: relative;
	width: 320rpx;
	height: 440rpx;
	border-radius: 16rpx;
	overflow: hidden;
	box-shadow: 0 8rpx 40rpx rgba(44, 36, 32, 0.2);
}
.book-cover-img {
	width: 100%;
	height: 100%;
}
.book-cover-shadow {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 30%;
	background: linear-gradient(to top, rgba(27, 42, 74, 0.15), transparent);
}

/* ====== Info Section ====== */
.book-info-section {
	padding: 0 32rpx;
}

.book-title {
	font-size: 40rpx;
	font-weight: 700;
	color: #2C2420;
	display: block;
	text-align: center;
	margin-bottom: 16rpx;
	line-height: 1.3;
}

/* Meta */
.book-meta {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-wrap: wrap;
	gap: 12rpx;
	margin-bottom: 24rpx;
}
.book-meta-item {
	font-size: 24rpx;
	color: #6B5E55;
}
.meta-label {
	color: #9C8F85;
}
.book-meta-divider {
	color: #D4CBC0;
	font-size: 20rpx;
}

/* Tags */
.book-tags {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 12rpx;
	margin-bottom: 32rpx;
}
.book-tag {
	padding: 8rpx 20rpx;
	background: #FAF7F2;
	border-radius: 100rpx;
	border: 2rpx solid #E8E2D8;
}
.book-tag text {
	font-size: 22rpx;
	color: #6B5E55;
}

/* Description */
.book-desc-section {
	background: #FDFBF8;
	border-radius: 20rpx;
	padding: 24rpx;
	margin-bottom: 32rpx;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.04);
}
.book-desc-label {
	font-size: 26rpx;
	font-weight: 600;
	color: #1B2A4A;
	display: block;
	margin-bottom: 12rpx;
	padding-left: 16rpx;
	border-left: 4rpx solid #C9953E;
}
.book-desc-text {
	font-size: 26rpx;
	color: #6B5E55;
	line-height: 1.8;
	display: block;
}

/* Actions */
.book-actions {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 20rpx;
}
.btn-borrow {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background: linear-gradient(135deg, #1B2A4A, #2C4266);
	border-radius: 100rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #FDFBF8;
	border: none;
	box-shadow: 0 4rpx 16rpx rgba(27, 42, 74, 0.3);
	transition: opacity 0.2s;
}
.btn-borrow:active {
	opacity: 0.85;
}
.btn-fav {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	padding: 16rpx 48rpx;
	border-radius: 100rpx;
	background: #FDFBF8;
	border: 2rpx solid #E8E2D8;
	font-size: 26rpx;
	color: #6B5E55;
	transition: all 0.2s;
}
.btn-fav:active {
	border-color: #C9953E;
	color: #C9953E;
}
.btn-fav-active {
	border-color: #C9953E;
	color: #C9953E;
	background: #FAF7F2;
}
.fav-icon {
	font-size: 32rpx;
}
</style>
