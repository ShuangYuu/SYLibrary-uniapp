<template>
    <view class="container">
        <swiper 
			:indicator-dots="true" 
			:autoplay="true"
			class="swiper-box"
		>
			<swiper-item v-for="item in swiperList" :key="item.id">
				<view class="banner-wrapper" @click="handleBannerClick(item)">
					<image :src="item.imageUrl" mode="aspectFill" class="banner-image"/>
				</view>
			</swiper-item>
		</swiper>
        
        <view class="divider-line" />
        
        <view class="section-title">新书速递 > </view>
        <scroll-view scroll-x="true" class="horizontal-list">
			<view class="horizontal-list-content">
				<view class="book-item" v-for="book in newBookList" :key="book.id">
					<image :src="book.imageUrl" mode="aspectFill" class="book-cover" @click="handleBannerClick(book)"/>
					<text class="book-name">{{ book.name }}</text>
				</view>
			</view>
		</scroll-view>
		
		<view class="divider-line" />

        <view class="section-title">热门借阅榜单 > </view>
        <view class="vertical-list">
            </view>
        
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import UniSearchBar from '@/uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.vue'

const swiperList = ref();
const newBookList = ref();

const getBannerData = () => {
	uni.request({
		url: 'http://localhost:8080/book/swiper',
		method: 'GET',
		success: (res) => {        
			if(res.statusCode === 200) {
				swiperList.value = res.data.data;
				console.log('轮换内容加载成功: ', res.data);
			}
		},
		error: (res) => {
			console.error('轮换内容加载失败: ', res.data);
		}
	})
}

const getScrollData = () => {
	uni.request({
		url: 'http://localhost:8080/book/newBooks',
		method: 'GET',
		success: (res) => {
			if(res.statusCode === 200){
				newBookList.value = res.data.data;
				console.log('横向滚动内容加载成功: ', res.data)
			}
		},
		error: (res) => {
			console.error('横向滚动内容加载失败: ', res.data)

		}
	})
}

onMounted(() => {
	getBannerData();
	getScrollData();
});

const handleBannerClick = (item) => {
	const dataString = encodeURIComponent(JSON.stringify(item));
	uni.navigateTo({
		url: `/pages/book/show?book=${ dataString }`,
		fail(error) {
			console.error('跳转失败: ', error);
		}
	});	
}

</script>

<style>
html, body {
    /* 确保根元素撑开，以便内部元素计算 100% 高度 */
    height: 100%; 
    /* 强制解除任何可能的 overflow: hidden 限制 */
    overflow-y: auto !important;
    overflow-x: hidden;
}

/* Uni-App 的页面根元素 */
page {
    /* 强制 page 元素能够被 body/html 撑开 */
    height: 100%; 
    /* 确保 page 内部的内容可以滚动 */
    overflow-y: auto; 
}
</style>

<style scoped>
.swiper-box{
	width: 100%;
	height: 900rpx;
	
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

.swiper-item, .banner-wrapper, .banner-image{
	width: 100%;
	height: 100%;
}

.section-title{
	color: royalblue;
	font-size: 35rpx;
	margin: 0 8rpx;
}

.horizontal-list{
	height: 330rpx;
	width: 100%;
}

.horizontal-list-content {
    display: flex;
	flex-wrap: nowrap;
	
    /* 可以添加一些垂直方向的内边距 */
    padding: 10rpx 0;
}

.book-item {
	flex-shrink: 0;
    /* 设置每本书的固定宽度和高度 */
    width: 160rpx; 
	height: 320rpx;/* 略小于容器高度 */
    
    /* 左右间距 */
    margin-right: 10rpx; 
    
    /* 布局：封面和标题垂直排列 */
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.book-cover {
    /* 关键：必须设置明确的宽度和高度 */
    width: 160rpx;  /* 必须与 book-item 的宽度一致 */
    height: 250rpx; /* 明确指定图片显示的高度，留出空间给标题 */
    
    /* 关键：使用 aspectFill 保持比例并裁剪，而不是被拉伸 */
    /* mode="aspectFill" 属性在 HTML 中设置了，但 CSS 尺寸是基础 */
}

.book-name {
    font-size: 20rpx;
    color: #333;
    margin-top: 5rpx;
    width: 100%;
    text-align: left;
    
    /* 1. 必须使用块级元素 */
	display: -webkit-box; 
	
	/* 2. 限制显示的行数 */
	-webkit-line-clamp: 2; /* 核心：限制最多显示 2 行 */
	
	/* 3. 垂直排列，这是 -webkit-line-clamp 的必要条件 */
	-webkit-box-orient: vertical; 
	
	/* 4. 隐藏溢出内容，激活省略号 */
	overflow: hidden;
}

.divider-line{
	height: 1rpx;
	background-color: darkturquoise;
	margin: 10rpx 0;
}

</style>
