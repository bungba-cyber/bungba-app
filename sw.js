/* ตัวช่วยของแอป: เก็บหน้าเปิดแอปและไอคอนไว้ในเครื่อง (เปิดเร็ว + ขึ้นปุ่ม "ติดตั้งแอป") — ข้อมูลของระบบโรงเรียนไม่ถูกเก็บในเครื่อง */
var CACHE = 'bungba-app-v1';
var SHELL = ['./', './index.html', './manifest.webmanifest', './logo.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png'];
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
