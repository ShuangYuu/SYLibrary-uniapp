import { buildApiUrl } from './config.js';

const REFRESH_URL = buildApiUrl('/user/refresh');
const LOGIN_PATH = '/pages/user/login';

let requestsQueue = [];
let isRefreshing = false;

function normalizeUrl(url) {
    return buildApiUrl(url);
}

function clearTokensAndRedirect() {
    uni.removeStorageSync('accessToken');
    uni.removeStorageSync('refreshToken');
    uni.showToast({ title: '登录信息过期，请重新登录', icon: 'none' });
    uni.reLaunch({ url: LOGIN_PATH });
}

function service(options) {
    const accessToken = uni.getStorageSync('accessToken');

    if (!accessToken && !options.noAuth) {
        uni.reLaunch({ url: LOGIN_PATH });
        return Promise.reject(new Error('No Token'));
    }

    const headers = {
        'Content-Type': 'application/json',
        ...options.header,
    };

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const requestOptions = {
        ...options,
        url: normalizeUrl(options.url),
        header: headers,
    };

    return new Promise((resolve, reject) => {
        uni.request({
            ...requestOptions,
            success: (res) => {
                const httpStatus = res.statusCode;

                if (httpStatus === 401 && !options.noAuth) {
                    const originalRequest = () => service(options).then(resolve).catch(reject);

                    if (!isRefreshing) {
                        isRefreshing = true;

                        refreshAccessToken().then(newAccessToken => {
                            requestsQueue.forEach(cb => cb(newAccessToken));
                            requestsQueue = [];
                            originalRequest();
                        }).catch(err => {
                            clearTokensAndRedirect();
                            reject(err);
                        }).finally(() => {
                            isRefreshing = false;
                        });
                    } else {
                        requestsQueue.push(() => originalRequest());
                    }

                    return;
                }

                if (httpStatus >= 400) {
                    reject({ statusCode: httpStatus, data: res.data });
                    return;
                }

                resolve(res.data);
            },
            fail: reject,
        });
    });
}

function refreshAccessToken() {
    const refreshToken = uni.getStorageSync('refreshToken');
    if (!refreshToken) {
        return Promise.reject(new Error('No Refresh Token'));
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
                    if (newRefreshToken) {
                        uni.setStorageSync('refreshToken', newRefreshToken);
                    }

                    resolve(newAccessToken);
                } else {
                    reject(res.data);
                }
            },
            fail: reject,
        });
    });
}

export default service;
