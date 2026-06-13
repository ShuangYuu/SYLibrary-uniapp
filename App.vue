<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			const pages = getCurrentPages();
			if (pages.length) {
				const currentPage = pages[pages.length - 1];
				const routePath = '/' + currentPage.route;
				uni.setStorageSync('currentPagePath', routePath);
			}
			console.log('App Show, 当前路径已保存: ', uni.getStorageSync('currentPagePath'));
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/* Global Reset & Typography */
page {
	background-color: #F5F0E8;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
	color: #2C2420;
	line-height: 1.6;
	-webkit-font-smoothing: antialiased;
}

view {
	box-sizing: border-box;
}

scroll-view {
	box-sizing: border-box;
}

/* Global page container */
.page-wrap {
	max-width: 750rpx;
	margin: 0 auto;
	padding: 0 0 20rpx 0;
	background: #F5F0E8;
	min-height: 100vh;
}
</style>
