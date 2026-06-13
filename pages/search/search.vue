<template>
	<view class="page-search">
		<!-- Search Header -->
		<view class="search-header">
			<view class="search-box">
				<text class="search-icon">&#x1F50D;</text>
				<input
					class="search-input"
					type="text"
					v-model="keyword"
					placeholder="搜索书名、作者或关键词..."
					placeholder-style="color: #9C8F85; font-size: 28rpx;"
					@confirm="handleSearch"
					confirm-type="search"
				/>
				<text v-if="keyword" class="search-clear" @click="keyword = ''">&#x2716;</text>
			</view>
			<text class="search-action" @click="handleSearch">搜索</text>
		</view>

		<!-- Category Tags -->
		<view class="category-section">
			<text class="category-label">热门分类</text>
			<view class="category-tags">
				<view
					class="tag"
					v-for="(tag, index) in hotTags"
					:key="index"
					@click="handleTagClick(tag)"
				>
					<text>{{ tag }}</text>
				</view>
			</view>
		</view>

		<!-- Search History -->
		<view class="history-section" v-if="searchHistory.length > 0">
			<view class="history-header">
				<text class="history-title">搜索历史</text>
				<text class="history-clear" @click="clearHistory">清除</text>
			</view>
			<view class="history-tags">
				<view
					class="history-tag"
					v-for="(item, index) in searchHistory"
					:key="index"
					@click="handleHistoryClick(item)"
				>
					<text>{{ item }}</text>
				</view>
			</view>
		</view>

		<!-- Empty State -->
		<view class="empty-state" v-if="!keyword && searchHistory.length === 0">
			<text class="empty-icon">&#x1F4D6;</text>
			<text class="empty-text">探索图书馆的丰富馆藏</text>
			<text class="empty-hint">输入关键词开始搜索</text>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const keyword = ref('')
const searchHistory = ref([])
const hotTags = ref([
	'文学', '计算机', '经济学', '哲学', '历史',
	'艺术设计', '自然科学', '社会科学', '语言学习', '心理学'
])

const handleSearch = () => {
	if (!keyword.value.trim()) {
		uni.showToast({ title: '请输入搜索关键词', icon: 'none' })
		return
	}
	// Add to history
	if (!searchHistory.value.includes(keyword.value.trim())) {
		searchHistory.value.unshift(keyword.value.trim())
		if (searchHistory.value.length > 10) {
			searchHistory.value.pop()
		}
	}
	uni.navigateTo({
		url: `/pages/book/show?book=${encodeURIComponent(JSON.stringify({ name: keyword.value }))}`
	})
}

const handleTagClick = (tag) => {
	keyword.value = tag
	handleSearch()
}

const handleHistoryClick = (item) => {
	keyword.value = item
	handleSearch()
}

const clearHistory = () => {
	searchHistory.value = []
}
</script>

<style scoped>
.page-search {
	max-width: 750rpx;
	margin: 0 auto;
	padding: 24rpx;
	min-height: 100vh;
	background: #F5F0E8;
}

/* ====== Search Header ====== */
.search-header {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 32rpx;
}
.search-box {
	flex: 1;
	display: flex;
	align-items: center;
	background: #FDFBF8;
	border-radius: 100rpx;
	padding: 0 24rpx;
	height: 80rpx;
	box-shadow: 0 2rpx 12rpx rgba(44, 36, 32, 0.05);
	border: 2rpx solid #E8E2D8;
	transition: border-color 0.2s;
}
.search-box:focus-within {
	border-color: #C9953E;
}
.search-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
	flex-shrink: 0;
}
.search-input {
	flex: 1;
	height: 100%;
	font-size: 28rpx;
	color: #2C2420;
}
.search-clear {
	font-size: 24rpx;
	color: #9C8F85;
	padding: 8rpx;
	flex-shrink: 0;
}
.search-action {
	font-size: 30rpx;
	color: #C9953E;
	font-weight: 600;
	flex-shrink: 0;
	padding: 8rpx;
}

/* ====== Category Section ====== */
.category-section {
	margin-bottom: 32rpx;
}
.category-label {
	font-size: 26rpx;
	font-weight: 600;
	color: #6B5E55;
	margin-bottom: 16rpx;
	display: block;
}
.category-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
}
.tag {
	padding: 14rpx 28rpx;
	background: #FAF7F2;
	border-radius: 100rpx;
	border: 2rpx solid #E8E2D8;
	transition: all 0.2s;
}
.tag:active {
	background: #1B2A4A;
	border-color: #1B2A4A;
}
.tag text {
	font-size: 24rpx;
	color: #6B5E55;
	transition: color 0.2s;
}
.tag:active text {
	color: #FDFBF8;
}

/* ====== History Section ====== */
.history-section {
	margin-bottom: 32rpx;
}
.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 16rpx;
}
.history-title {
	font-size: 26rpx;
	font-weight: 600;
	color: #6B5E55;
}
.history-clear {
	font-size: 24rpx;
	color: #9C8F85;
}
.history-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}
.history-tag {
	padding: 10rpx 24rpx;
	background: #FDFBF8;
	border-radius: 100rpx;
	border: 2rpx solid #E8E2D8;
}
.history-tag text {
	font-size: 22rpx;
	color: #9C8F85;
}

/* ====== Empty State ====== */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding-top: 160rpx;
	gap: 16rpx;
}
.empty-icon {
	font-size: 80rpx;
	opacity: 0.3;
}
.empty-text {
	font-size: 28rpx;
	color: #9C8F85;
}
.empty-hint {
	font-size: 24rpx;
	color: #D4CBC0;
}
</style>
