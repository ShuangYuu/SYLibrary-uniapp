<template>
	<view class="container">
		<view class="image-box">
			<image :src="book.imageUrl" mode="aspectFill" class="book-item"/>
		</view>
		<view class="content">
			<text class="book-title">{{ book.name }}</text>
			<view class="tags">
				<text style="color: deeppink; margin-right: 13rpx;">标签:</text>
				<text>{{ book.tags }}</text>
			</view>
			<view class="comment">
				<text style="color: deeppink; margin-right: 13rpx;">简介:</text>
				<text style="flex: 1; text-align: left;">{{ book.comment }}</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app';
import authMixin from '../../utils/authMixin';
	
const book = ref({});
	
onLoad((options) => {
	if(options.book){
		book.value = JSON.parse(decodeURIComponent(options.book));
		console.log('获取书本数据成功: ', book);
	}
});
	
</script>

<style>
.image-box{
	height: 800rpx;
	width: 75%;
	
	margin-left: auto;
	margin-right: auto;
}

.book-item{
	height: 100%;
	width: 100%;
}

.content{
	display: flex;
	flex-direction: column;
	text-align: center;
	width: 90%;
	
	margin-top: 10rpx;
	margin-left: auto;
	margin-right: auto;
}

.book-title{
	font-size: 38rpx;
	font-weight: 600;
}

.tags{
	display: flex;
	flex-direction: row;
	font-size: 28rpx;
	color: blue;
	
	margin-top: 10rpx;
}

.comment{
	display: flex;
	flex-direction: row;
	
	font-size: 28rpx;
	margin-top: 10rpx;
}
</style>