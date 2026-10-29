/* Barış Öğretmen — bildirim servis çalışanı (sw.js). HTML ile AYNI klasöre yükleyin. Önbellek tutmaz. */
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ e.waitUntil(self.clients.claim()); });
function rozetGuncelle(){ try{ if(!(self.navigator && self.navigator.setAppBadge)) return Promise.resolve(); return self.registration.getNotifications().then(function(l){ return l.length ? self.navigator.setAppBadge(l.length) : self.navigator.clearAppBadge(); }).catch(function(){}); }catch(x){ return Promise.resolve(); } }
self.addEventListener('notificationclick', function(e){
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || self.registration.scope;
  e.waitUntil(Promise.all([rozetGuncelle(), self.clients.matchAll({type:'window', includeUncontrolled:true}).then(function(list){
    for (var i=0;i<list.length;i++){ var c=list[i]; if (c.url.indexOf(self.registration.scope)===0 && 'focus' in c){ if (c.navigate && url.indexOf('#')>0) { try{ c.navigate(url); }catch(x){} } return c.focus(); } }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  })]));
});
self.addEventListener('notificationclose', function(e){ e.waitUntil(rozetGuncelle()); });
self.addEventListener('push', function(e){
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch(x){ d = { baslik:'Bildirim', govde: e.data ? e.data.text() : '' }; }
  var opt = { body: d.govde || d.body || '', icon: d.icon, badge: d.icon, data: { url: d.url || self.registration.scope } };
  if (d.etiket) { opt.tag = d.etiket; opt.renotify = false; }
  e.waitUntil(self.registration.showNotification(d.baslik || d.title || 'Bildirim', opt).then(rozetGuncelle));
});
