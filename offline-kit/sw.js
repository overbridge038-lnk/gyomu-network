/* =========================================================
   ツール用 オフライン保存のしくみ（ネット優先）
   ---------------------------------------------------------
   ・Wi-Fiがあるとき：いつも最新版を開き、その版を保存する
     → push するだけで全タブレットが最新になる（ver を上げ忘れても届く）
   ・Wi-Fiがないとき：最後に開いた版を開く
   このファイルをツールと同じフォルダに置き、ツールのHTMLに
   <script>if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');</script>
   を1行入れるだけで使えます。
   ========================================================= */
var CACHE = 'tool-net-first-v1';

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.add('./').catch(function () {}); }));
});
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== location.origin) return;   // 外のサイト（Googleなど）は触らない
  e.respondWith(
    fetch(e.request).then(function (r) {
      if (r && r.ok && r.status === 200) { var copy = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, copy); }); }
      return r;
    }).catch(function () {
      return caches.match(e.request, { ignoreSearch: true }).then(function (hit) {
        return hit || (e.request.mode === 'navigate' ? caches.match('./') : undefined);
      });
    })
  );
});
