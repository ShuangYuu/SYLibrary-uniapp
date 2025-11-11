const whiteList = [
	'/pages/user/login',
	'/pages/user/user',
	'/pages/index/index',
	'/'
];


export default {
	
	onLoad() {
		const currentPage = this.$route ? this.$route.path : uni.getStorageSync('currentPagePath');
		console.log('--- Mixin 检查 ---');
		console.log('当前页面路径:', currentPage);
		console.log('白名单是否包含:', whiteList.includes(currentPage));
		console.log('accessToken:', uni.getStorageSync('accessToken'));
		const accessToken = uni.getStorageSync('accessToken');
		
		if(!whiteList.includes(currentPage) && !accessToken){
			uni.setStorageSync('targetPath', currentPage);
			uni.reLaunch({
				url: '/pages/user/login',
			})
		}
	}
	
}