<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			// 1. 获取当前页面栈
			const pages = getCurrentPages();
			if (pages.length) {
				// 2. 获取栈顶页面的路由路径
				const currentPage = pages[pages.length - 1];
				const routePath = '/' + currentPage.route; // Uni-App 路径通常以 / 开头
				
				// 3. 存储到本地，供 Mixin 读取
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
.container{
	max-width: 500px;
	
	margin-left: auto;
	margin-right: auto;
	
	width: 100%;
	
	background-color: #fff;
}	
</style>
