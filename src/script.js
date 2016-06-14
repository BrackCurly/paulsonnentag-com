(function () {
  'use strict';

  Array.prototype.slice.call(document.querySelectorAll('a[href*="#"]:not([href="#"])'))
    .forEach(function (el) {

      el.addEventListener('click', function (evt) {
        var scrollY;
        var id = evt.target.href.split('#')[1];
        var anchor = document.querySelector('a[name="' + id + '"]');

        if (anchor) {
          scrollY = Math.min(anchor.offsetTop, document.body.scrollHeight - document.body.clientHeight);
          scrollTo(scrollY);

          evt.preventDefault();
        }

      }, false);
    });

  function scrollTo (y) {
    requestAnimationFrame(function loop () {
      var nextY = Math.round((y + window.scrollY) / 2);

      if (nextY !== y) {
        window.scroll(0, nextY);
        requestAnimationFrame(loop);
      }
    });
  }

}());