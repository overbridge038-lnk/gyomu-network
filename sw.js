/* =========================================================
   五和業務ツール（ITSUWA OPS HUB） ― オフライン保存のしくみ（Service Worker）
   ふだんは触らなくてOK。tools.js を直せば自動で更新されます。
   ========================================================= */
importScripts('./tools.js');

var CACHE_PREFIX = 'shukka-tools-';
var CACHE = CACHE_PREFIX + SITE_VER;
var CORE = ['./', './index.html', './tools.js', './manifest.json',
            './icon-192.png', './icon-512.png'];

// 新しい版を取り込む（ここではまだ切り替えない＝作業中の画面を止めない）
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) {
    // このリポジトリの中のツールだけ保存する（別リポジトリのツールは、それぞれが自分で保存する）
    var urls = CORE.concat(TOOLS.filter(function (t) { return !/^https?:/.test(t.file); })
                                .map(function (t) { return './' + t.file; }));
    if (typeof MAP_IMAGE !== 'undefined' && MAP_IMAGE) urls.push('./' + MAP_IMAGE);
    return Promise.all(urls.map(function (u) {
      return fetch(u, { cache: 'no-store' })
        .then(function (r) { if (r.ok) return c.put(u, r); })
        .catch(function () { /* 1つ失敗しても全体は止めない */ });
    }));
  }));
});

// 切り替え後、古い版の保存データを片付ける
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) {
      if (k.indexOf(CACHE_PREFIX) === 0 && k !== CACHE) return caches.delete(k);
    }));
  }).then(function () { return self.clients.claim(); }));
});

// 表紙の「更新する」ボタンが押されたら切り替える
self.addEventListener('message', function (e) {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});

// 保存済みなら電波がなくても開く。なければ取りに行き、取れたら保存
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (e.request.cache === 'no-store') return; // 最新版の確認はネットへ直接
  if (/script\.google(usercontent)?\.com/.test(e.request.url)) return; // Googleへの送信・共有データはいつもネットへ（保存しない）
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      var same = new URL(e.request.url).origin === self.location.origin;
      return c.match(e.request, { ignoreSearch: same }).then(function (hit) {
        if (hit) return hit;
        return fetch(e.request).then(function (r) {
          if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone());
          return r;
        }).catch(function () {
          if (e.request.mode === 'navigate') return c.match('./index.html');
        });
      });
    })
  );
});
