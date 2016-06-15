(function () {
  'use strict';

  addEventListener(document, 'click', 'a[href*="#"]:not([href="#"])', function (evt) {
    var scrollY;
    var id = evt.target.href.split('#')[1];
    var anchor = document.querySelector('a[name="' + id + '"]');

    if (anchor) {
      scrollY = Math.min(anchor.offsetTop, document.body.scrollHeight - document.body.clientHeight);
      scrollTo(scrollY);

      evt.preventDefault();
    }
  });

  addEventListener(document, 'click', 'a[data-open-modal]', function (evt) {
    var el = evt.target;
    var modalContainer = document.getElementById('modal-container');

    evt.preventDefault();


    console.log('scroll');

    el.classList.add('loading');

    request(el.href, function (evt) {
      var parser = new DOMParser();
      var dom = parser.parseFromString(evt.currentTarget.response, "text/html");
      var offset = el.getBoundingClientRect();

      modalContainer.innerHTML = '';

      var modal = document.createElement('div');
      modal.innerHTML = dom.body.innerHTML;
      modal.classList.add('modal');
      modal.style.width = el.clientWidth + 'px';
      modal.style.height = el.clientHeight + 'px';
      modal.style.transform = 'translate3d(' + offset.left + 'px, ' + offset.top + 'px, 0)';
      modal.style.opacity = 0;

      modalContainer.style.transform = 'translate3d(0, ' + window.scrollY + 'px, 0)';
      modalContainer.classList.remove('hidden');

      setTimeout(function () {
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.transform = 'translate3d(0, 0, 0)';
        modal.style.opacity = 1;
      }, 50);

      modalContainer.appendChild(modal);

      el.classList.remove('loading');
    });
  });



  document.querySelectorAll('a[data-open-modal]')
    .forEach(function (el) {

      console.log(el);

      el.addEventListener('click', function (evt) {
        console.log('disrupt click');

        evt.preventDefault();
      });
    });

  addEventListener(document, 'click', 'a[data-modal-close]', function (evt) {
    var modalContainer = document.getElementById('modal-container');
    modalContainer.classList.add('hidden');

    console.log(modalContainer);

    evt.preventDefault();
    evt.stopPropagation();
  });

  function addEventListener (element, eventType, selector, callback) {
    element.addEventListener(eventType, function (evt) {
      if (isSelectorMatching(evt.target, selector)) {
        callback(evt);
      }
    });
  }

  function isSelectorMatching (el, selector) {
    if (el.matches) {
      return el.matches(selector);
    }

    if (el.matchesSelector) {
      return el.matchesSelector(selector);
    }
  }

  function request (url, callback) {
    var req = new XMLHttpRequest();
    req.onload = callback;
    req.open('GET', url);
    req.send();
  }

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
