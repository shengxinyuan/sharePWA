
var cacheStorageKey = 'l-56111111'

var cacheList = [
    '/',
    "index.html",
    "main.css",
    "vip.png",
    "pwa-fonts.png",
    "aaa.png",
    "data.json"
]


//处理静态缓存
self.addEventListener('install', function(event) {
    console.log('缓存事件')
    event.waitUntil(  //waitUntil()方法延长了事件的生命周期。在serviceWorker中，延长事件的使用寿命可以防止浏览器在事件中的异步操作完成之前终止serviceWorker  (适用于Android的Chrome40.0+)
        caches.open(cacheStorageKey).then(function(cache) { //open()方法CacheStorage返回一个Promise解析为Cache匹配的对象cacheName。
            console.log('添加到缓存:', cacheList)
            return cache.addAll(cacheList)  //获取一组URL，检索它们，并将生成的响应对象添加到给定的缓存中
        }).then(function() {
            console.log('跳过等待')
            return self.skipWaiting()  //skipWaiting: 表示强制当前处在 waiting 状态的脚本进入 activate 状态。调用 self.skipWaiting() 方法是为了在页面更新的过程当中, 新的 Service Worker 脚本能立即激活和生效。
        })
    )

})

//更新静态资源
self.addEventListener('activate', function(event) {
    console.log('激活事件')
    event.waitUntil(

        caches.keys()   //返回一个Promise解析为一个Cache键数组
        .then(cacheNames => {
            return cacheNames.map(name => {
                if (name !== cacheStorageKey) {
                    caches.delete(name)
                }
            })
        }).then(() => {
            return self.clients.claim()  //在新安装的 Service Worker 中通过调用 self.clients.claim() 取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。旧的 Service Worker 脚本不再控制着页面之后会被停止。
        })
    )
})

//处理动态缓存
self.addEventListener('fetch', function(event) {
    //console.log('Fetch事件:', event.request.url)
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response != null) {
                console.log('使用缓存:', event.request.url)
                return response
            }
            console.log('fetch:', event.request.url)
            return fetch(event.request.url)
        })
    )
    //网页抓取资源的过程中, 在 Service Worker 可以捕获到 fetch 事件, 可以编写代码决定如何响应资源的请求。
    //真实的项目当中, 可以根据资源的类型, 站点的特点, 可以专门设计复杂的策略。fetch 事件当中甚至可以手动生成 Response 返回给页面。
})
