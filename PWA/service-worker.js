let dataCacheName = 'kChat-v3';
let cacheName = 'kChat-1';
let filesToCache = [
    './',
    './index.html',
    './Javascript/Class/jquery-3.3.1.min.js',
    './Javascript/Class/kDom.js',
    './Javascript/Class/vue.js',
    './Javascript/Database.js',
    './Javascript/JsAlert.js',
    './Javascript/JsAlert.css',
    './Javascript/JsFileRead.js',
    './Javascript/main.js',
    './Javascript/ServerTalk.js',
    './Javascript/Tools.js',

    './styles/inline.css',
    './styles/phoneInline.css',
    './styles/Class/css/font-awesome.css',
    './styles/Class/css/font-awesome.min.css',
    './styles/Class/fonts/FontAwesome.otf',
    './styles/Class/fonts/fontawesome-webfont.eot',
    './styles/Class/fonts/fontawesome-webfont.svg',
    './styles/Class/fonts/fontawesome-webfont.ttf',
    './styles/Class/fonts/fontawesome-webfont.woff',
    './styles/Class/fonts/fontawesome-webfont.woff2',


    './images/background/bg.jpg',
    './images/header/defaultAvatar.jpeg',
    './images/icons/favicon.ico',
    './images/icons/icon.png',
    './images/icons/icon.png',

    './images/svg/break.svg',
    './images/svg/ic_add.svg',
    './images/svg/ic_more_vert.svg',
    './images/svg/ic_refresh.svg',
    './images/svg/nofm.svg',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        }));
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }));
    /*
     * Fixes a corner case in which the app wasn't returning the latest data.
     * You can reproduce the corner case by commenting out the line below and
     * then doing the following steps: 1) load app for first time so that the
     * initial New York City data is shown 2) press the refresh button on the
     * app 3) go offline 4) reload the app. You expect to see the newer NYC
     * data, but you actually see the initial data. This happens because the
     * service worker is not yet activated. The code below essentially lets
     * you activate the service worker faster.
     */
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    console.log('[Service Worker] Fetch', e.request.url);
    let dataUrl = 'https://query.yahooapis.com/v1/public/yql';
    if (e.request.url.indexOf(dataUrl) > -1) {
        /*
         * When the request URL contains dataUrl, the app is asking for fresh
         * weather data. In this case, the service worker always goes to the
         * network and then caches the response. This is called the "Cache then
         * network" strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
         */
        e.respondWith(
            caches.open(dataCacheName).then(function (cache) {
                return fetch(e.request).then(function (response) {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            }));
    } else {
        /*
         * The app is asking for app shell files. In this scenario the app uses the
         * "Cache, falling back to the network" offline strategy:
         * https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network
         */
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            }));
    }
});