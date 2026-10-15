(function () {
  var h1 = document.getElementById('pagetitle');
  var nav = document.getElementById('subnav');
  if (!h1 || !nav) return;

  var base = h1.textContent.trim(); // "iPhone"

  function sync() {
    var cur = nav.querySelector('a[aria-current="page"]');
    var b = cur && cur.querySelector('b');
    var label = b ? b.textContent.trim() : '';
    var isAll = !cur || cur === nav.querySelector('a:first-child');
    h1.textContent = (isAll || !label) ? base : label;
  }

  // subnav.js render lại hoặc đổi aria-current thì tự cập nhật
  new MutationObserver(sync).observe(nav, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['aria-current']
  });

  // dự phòng khi click
  nav.addEventListener('click', function () { setTimeout(sync, 0); });

  sync();
})();