const REFRESH_URL = 'http://localhost:8080/user/refresh'; 
const LOGIN_PATH = '/pages/user/login'; 

let requestsQueue = [];
let isRefreshing = false;

function service(options) {
    const accessToken = uni.getStorageSync('accessToken');
	
	console.log(`[Request Debug] URL: ${options.url}`);
	console.log(`[Request Debug] AccessToken: ${accessToken ? accessToken.substring(0, 10) + '...' : 'NONE'}`); // 仅打印前 10 位

    if (!accessToken && !options.noAuth) {
        uni.reLaunch({ url: LOGIN_PATH });
        return Promise.reject('No Token');
    }

    options.header = {
		'Content-Type': 'application/json',
        ...options.header,
        'Authorization': `Bearer ${ accessToken }`
    };
	
	console.log(`[Request Debug] Final Headers:`, options.header);

    return new Promise((resolve, reject) => {
        uni.request({
            ...options,
            success: (res) => {
                const httpStatus = res.statusCode;

                // ============== 401 拦截逻辑 ==============
                if (httpStatus === 401) {
                    
                    // 原始请求的配置，用于刷新成功后重试
                    const originalRequest = () => service(options).then(resolve).catch(reject);

                    if (!isRefreshing) {
                        isRefreshing = true;
                        
                        refreshAccessToken().then(newAccessToken => {
                            requestsQueue.forEach(cb => cb(newAccessToken));
                            requestsQueue = [];

                            originalRequest();
							
                        }).catch(err => {
                            // 刷新失败：清空 Tokens，强制跳转登录页
                            console.error('Token 刷新失败', err);
                            uni.removeStorageSync('accessToken');
                            uni.removeStorageSync('refreshToken');
                            uni.showToast({ title: '登录信息过期，请重新登录', icon: 'none' });
                            uni.reLaunch({ url: LOGIN_PATH });
                            reject(err);
                        }).finally(() => {
                            isRefreshing = false;
                        });
                        
                    } else {
                        //如果正在刷新中，将当前请求添加到队列，等待新 Token
                        requestsQueue.push(resolve => {
                            // 拿到新 Token 后，重试原始请求
                            originalRequest();
                        });
                    }
                    
					console.log('刷新双令牌成功: ', uni.getStorageSync('accessToken'), uni.getStorageSync('refreshToken'))
                    // 无论是刷新中还是已触发刷新，都终止当前 Promise
                    return; 
                } 
                // ============== 401 拦截逻辑结束 ==============
                
                // 处理非 401 的 HTTP 错误（如 500, 404 等）
                if (httpStatus >= 400) {
                    return reject({ statusCode: httpStatus, data: res.data });
                }

                // 正常业务返回
				console.log("[Wrapper] 状态正常，返回完整的响应对象。"); 
                resolve(res.data);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

// 专门用于刷新 Token 的函数
function refreshAccessToken() {
    const refreshToken = uni.getStorageSync('refreshToken');
    if (!refreshToken) {
        return Promise.reject('No Refresh Token');
    }

    return new Promise((resolve, reject) => {
        uni.request({
            url: REFRESH_URL,
            method: 'POST',
            data: { refreshToken },
            success: (res) => {
                if (res.statusCode === 200 && res.data.code === 200) {
                    const newAccessToken = res.data.data.accessToken;
                    const newRefreshToken = res.data.data.refreshToken;
                    
                    uni.setStorageSync('accessToken', newAccessToken);
                    // 某些情况下 refreshToken 也会更新
                    if (newRefreshToken) {
                         uni.setStorageSync('refreshToken', newRefreshToken);
                    }
                    
                    resolve(newAccessToken);
                } else {
                    reject(res.data);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export default service;