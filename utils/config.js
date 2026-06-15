const API_ENV = 'prod';

const API_BASE_URLS = {
    dev: 'http://localhost:8080',
    prod: 'https://api.shuangyuhub.com',
};

const API_BASE_URL = API_BASE_URLS[API_ENV];

function buildApiUrl(path = '') {
    if (!path) {
        return API_BASE_URL;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export {
    API_ENV,
    API_BASE_URL,
    API_BASE_URLS,
    buildApiUrl,
};
