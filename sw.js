/* ตัวช่วยของแอป: เก็บหน้าเปิดแอปและไอคอนไว้ในเครื่อง (เปิดเร็ว + ขึ้นปุ่ม "ติดตั้งแอป") — ข้อมูลของระบบโรงเรียนไม่ถูกเก็บในเครื่อง
 * v1.14.0: รับแจ้งเตือนเด้ง (Firebase Cloud Messaging) → แสดงข้อความ + เพิ่มตัวเลขที่ไอคอน · แตะข้อความ → เปิดหน้าที่เกี่ยวข้อง */
var CACHE = 'bungba-app-v2';
var SHELL = ['./', './index.html', './push-config.js', './manifest.webmanifest', './logo.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;   // ระบบโรงเรียน (Google) ไม่ผ่านตัวนี้
  // หน้าเปิดแอป: ใช้ของใหม่จากเน็ตก่อน ไม่มีเน็ตค่อยใช้ที่เก็บไว้
  e.respondWith(fetch(e.request).then(function (r) {
    var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); return r;
  }).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); }); }));
});

/* ---------- แจ้งเตือน ---------- */
function idb(mode, fn) {
  return new Promise(function (ok) {
    try {
      var r = indexedDB.open('bb-app', 1);
      r.onupgradeneeded = function () { r.result.createObjectStore('kv'); };
      r.onsuccess = function () { try { var st = r.result.transaction('kv', mode).objectStore('kv'); fn(st, ok); } catch (x) { ok(0); } };
      r.onerror = function () { ok(0); };
    } catch (x) { ok(0); }
  });
}
function bumpBadge() {
  return idb('readwrite', function (st, ok) {
    var g = st.get('badge');
    g.onsuccess = function () { var n = (+g.result || 0) + 1; st.put(n, 'badge'); ok(n); };
    g.onerror = function () { ok(1); };
  }).then(function (n) { try { if (self.navigator.setAppBadge) return self.navigator.setAppBadge(n || 1); } catch (x) { } });
}
self.addEventListener('push', function (e) {
  var p = {}; try { p = e.data ? e.data.json() : {}; } catch (x) { try { p = { body: e.data.text() }; } catch (y) { } }
  var d = p.data || p.notification || p;   // ข้อความจาก Firebase: { data: {title, body, link, tag}, from, ... }
  var title = d.title || 'ระบบโรงเรียนชุมชนบึงบา';
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, { body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || undefined, renotify: !!d.tag, data: { link: d.link || '' } }),
    bumpBadge()
  ]));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var link = (e.notification.data && e.notification.data.link) || '';
  var url = new URL('./' + (link ? '?go=' + encodeURIComponent(link) : ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) {
      if (cs[i].url.indexOf(self.registration.scope) === 0 && 'focus' in cs[i]) { cs[i].postMessage({ bb: 'go', link: link }); return cs[i].focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
