<template>
	<view class="page-home">
		<!-- Banner Section -->
		<view class="banner-section" v-if="swiperList.length > 0">
			<swiper
				:indicator-dots="true"
				:autoplay="true"
				class="banner-swiper"
				indicator-color="rgba(253, 251, 248, 0.4)"
				indicator-active-color="#C9953E"
				:key="swiperList.length"
				circular
			>
				<swiper-item v-for="item in swiperList" :key="item.book_id || item.id">
					<view class="banner-slide" @click="goBookDetail(item)">
						<image :src="item.imageUrl" mode="aspectFill" class="banner-img" />
						<view class="banner-overlay" />
					</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- Quick Actions -->
		<view class="quick-actions">
			<view class="quick-action-item" @click="handleQuickSearch">
				<view class="quick-icon">
					<text class="quick-icon-text">&#x1F50D;</text>
				</view>
				<text class="quick-label">搜书</text>
			</view>
			<view class="quick-action-item" @click="handleQuickCategory">
				<view class="quick-icon">
					<text class="quick-icon-text">&#x1F4DA;</text>
				</view>
				<text class="quick-label">分类</text>
			</view>
			<view class="quick-action-item" @click="handleQuickHot">
				<view class="quick-icon">
					<text class="quick-icon-text">&#x1F525;</text>
				</view>
				<text class="quick-label">最近</text>
			</view>
			<view class="quick-action-item" @click="handleQuickMine">
				<view class="quick-icon">
					<text class="quick-icon-text">&#x1F464;</text>
				</view>
				<text class="quick-label">我的</text>
			</view>
		</view>

		<!-- Recent Books Section -->
		<view class="section-header">
			<view class="section-header-left">
				<view class="section-accent" />
				<text class="section-title">最近上架</text>
			</view>
			<text class="section-more">更多 &gt;</text>
		</view>
		<scroll-view scroll-x="true" class="book-scroll" show-scrollbar="false">
			<view class="book-scroll-content">
				<view
					class="book-card"
					v-for="book in recentBookList"
					:key="book.book_id || book.id"
					@click="goBookDetail(book)"
				>
					<view class="book-card-cover-wrap">
						<image :src="book.imageUrl" mode="aspectFill" class="book-card-cover" />
					</view>
					<text class="book-card-title">{{ book.name }}</text>
				</view>
			</view>
		</scroll-view>
		<view v-if="recentBookList.length === 0" class="book-placeholder">
			<text class="book-placeholder-text">暂无上架图书</text>
		</view>

		<!-- Hot Borrowing Section -->
		<view class="section-header" v-if="hotBookList.length > 0">
			<view class="section-header-left">
				<view class="section-accent" />
				<text class="section-title">热门借阅</text>
			</view>
			<text class="section-more">更多 &gt;</text>
		</view>
		<view class="hot-list" v-if="hotBookList.length > 0">
			<view
				class="hot-item"
				v-for="(book, index) in hotBookList"
				:key="book.book_id || book.id"
				@click="goBookDetail(book)"
			>
				<view class="hot-rank" :class="{'hot-rank-gold': index === 0, 'hot-rank-silver': index === 1, 'hot-rank-bronze': index === 2}">
					<text class="hot-rank-text">{{ index + 1 }}</text>
				</view>
				<image :src="book.imageUrl" mode="aspectFill" class="hot-cover" />
				<view class="hot-info">
					<text class="hot-name">{{ book.name }}</text>
					<text class="hot-author" v-if="book.author">作者：{{ book.author }}</text>
					<text class="hot-count" v-if="book.borrowCount">借阅 {{ book.borrowCount }} 次</text>
				</view>
				<text class="hot-arrow">&gt;</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const swiperList = ref([]);
const recentBookList = ref([]);
const hotBookList = ref([]);

const getHomeData = () => {
	uni.request({
		url: 'https://api.shuangyuhub.com/book/home',
		method: 'GET',
		success: (res) => {
			if (res.statusCode === 200 && res.data && res.data.data) {
				const homeData = res.data.data;
				swiperList.value = Array.isArray(homeData.banners) ? homeData.banners : [];
				recentBookList.value = Array.isArray(homeData.recentBooks) ? homeData.recentBooks : [];
				hotBookList.value = Array.isArray(homeData.hotBooks) ? homeData.hotBooks : [];
				console.log('首页内容加载成功: ', res.data);
			}
		},
		fail: (res) => {
			console.error('首页内容加载失败: ', res);
		}
	})
}

onMounted(() => {
	getHomeData();
});

const goBookDetail = (item) => {
	const dataString = encodeURIComponent(JSON.stringify(item));
	uni.navigateTo({
		url: `/pages/book/show?book=${ dataString }`,
		fail(error) {
			console.error('跳转失败: ', error);
		}
	});
}

const handleQuickSearch = () => {
	uni.switchTab({ url: '/pages/search/search' });
}
const handleQuickCategory = () => {
	uni.showToast({ title: '功能开发中', icon: 'none' });
}
const handleQuickHot = () => {
	uni.pageScrollTo({ selector: '.book-scroll', duration: 300 });
}
const handleQuickMine = () => {
	uni.switchTab({ url: '/pages/user/user' });
}
</script>

<style scoped>
.page-home {
	max-width: 750rpx;
	margin: 0 auto;
	padding-bottom: 20rpx;
	background: #F5F0E8;
	min-height: 100vh;
}

/* ====== Banner ====== */
.banner-section {
	padding: 24rpx 24rpx 0;
}
.banner-swiper {
	width: 100%;
	height: 340rpx;
	border-radius: 24rpx;
	overflow: hidden;
}
.banner-slide {
	position: relative;
	width: 100%;
	height: 100%;
}
.banner-img {
	width: 100%;
	height: 100%;
}
.banner-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 40%;
	background: linear-gradient(to top, rgba(27,42,74,0.3), transparent);
}

/* ====== Quick Actions ====== */
.quick-actions {
	display: flex;
	justify-content: space-around;
	padding: 32rpx 24rpx;
	background: #FAF7F2;
	margin: 24rpx;
	border-radius: 24rpx;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
}
.quick-action-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12rpx;
}
.quick-icon {
	width: 88rpx;
	height: 88rpx;
	border-radius: 50%;
	background: #F5F0E8;
	display: flex;
	align-items: center;
	justify-content: center;
	transition: transform 0.2s;
}
.quick-action-item:active .quick-icon {
	transform: scale(0.92);
}
.quick-icon-text {
	font-size: 36rpx;
}
.quick-label {
	font-size: 24rpx;
	color: #6B5E55;
	font-weight: 500;
}

/* ====== Section Header ====== */
.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 24rpx 12rpx;
}
.section-header-left {
	display: flex;
	align-items: center;
	gap: 12rpx;
}
.section-accent {
	width: 6rpx;
	height: 28rpx;
	background: #C9953E;
	border-radius: 3rpx;
}
.section-title {
	font-size: 32rpx;
	font-weight: 600;
	color: #2C2420;
}
.section-more {
	font-size: 24rpx;
	color: #9C8F85;
}

/* ====== Book Scroll (Horizontal) ====== */
.book-scroll {
	width: 100%;
	padding: 8rpx 0 16rpx;
}
.book-scroll-content {
	display: flex;
	flex-wrap: nowrap;
	padding: 0 24rpx;
	gap: 20rpx;
}
.book-card {
	flex-shrink: 0;
	width: 160rpx;
	display: flex;
	flex-direction: column;
	gap: 10rpx;
}
.book-card-cover-wrap {
	width: 160rpx;
	height: 220rpx;
	border-radius: 12rpx;
	overflow: hidden;
	box-shadow: 0 4rpx 12rpx rgba(44, 36, 32, 0.1);
	transition: transform 0.2s;
}
.book-card:active .book-card-cover-wrap {
	transform: scale(0.96);
}
.book-card-cover {
	width: 100%;
	height: 100%;
}
.book-card-title {
	font-size: 22rpx;
	color: #2C2420;
	line-height: 1.3;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
.book-placeholder {
	padding: 40rpx 0 28rpx;
	text-align: center;
}
.book-placeholder-text {
	font-size: 26rpx;
	color: #9C8F85;
}

/* ====== Hot List ====== */
.hot-list {
	padding: 0 24rpx;
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}
.hot-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
	padding: 16rpx;
	background: #FAF7F2;
	border-radius: 16rpx;
	box-shadow: 0 2rpx 8rpx rgba(44, 36, 32, 0.04);
	transition: transform 0.15s;
}
.hot-item:active {
	transform: scale(0.98);
}
.hot-rank {
	width: 44rpx;
	height: 44rpx;
	border-radius: 10rpx;
	background: #E8E2D8;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}
.hot-rank-gold {
	background: linear-gradient(135deg, #C9953E, #DFB06A);
}
.hot-rank-silver {
	background: linear-gradient(135deg, #B0B0B0, #D0D0D0);
}
.hot-rank-bronze {
	background: linear-gradient(135deg, #A67A2E, #C9953E);
}
.hot-rank-text {
	font-size: 22rpx;
	font-weight: 700;
	color: #FDFBF8;
}
.hot-cover {
	width: 80rpx;
	height: 110rpx;
	border-radius: 8rpx;
	flex-shrink: 0;
}
.hot-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 6rpx;
	min-width: 0;
}
.hot-name {
	font-size: 28rpx;
	font-weight: 600;
	color: #2C2420;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.hot-author {
	font-size: 22rpx;
	color: #9C8F85;
}
.hot-count {
	font-size: 20rpx;
	color: #C9953E;
}
.hot-arrow {
	font-size: 28rpx;
	color: #D4CBC0;
	flex-shrink: 0;
}
.hot-placeholder {
	padding: 48rpx 0;
	text-align: center;
}
.hot-placeholder-text {
	font-size: 26rpx;
	color: #9C8F85;
}
</style>
