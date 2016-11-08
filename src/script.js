(function () {
  'use strict';

  var selectedProject;

  // setting fixed height is necessary because mobile chrome hides navbar while scrolling
  // this leads to a jump in scroll position
  Array.prototype.slice.call(document.querySelectorAll('[data-full-screen]'))
    .forEach(function (el) {
      el.style.height = window.innerHeight + 'px';
    });

  addEventListener(document, 'click', 'a[data-scroll-smooth]', function (evt) {
    var scrollY;
    var id = evt.target.href.split('#')[1];
    var anchor = document.getElementById(id);

    if (anchor) {
      scrollY = Math.min(anchor.offsetTop, document.body.scrollHeight - document.body.clientHeight);
      scrollTo(scrollY);

      evt.preventDefault();
    }
  });

  Array.prototype.slice.call(document.querySelectorAll('a[data-open-modal]'))
    .forEach(function (el) {

      el.addEventListener('click', function (evt) {
        var modalContainer = document.getElementById('modal-container');

        selectedProject = el;

        evt.preventDefault();

        el.classList.add('loading');

        request(el.href, function (evt) {
          var parser = new DOMParser();
          var dom = parser.parseFromString(evt.currentTarget.response, "text/html");
          var offset = el.getBoundingClientRect();

          modalContainer.innerHTML = '';

          var modal = document.createElement('div');
          modal.id = 'modal';
          modal.innerHTML = dom.body.innerHTML;
          modal.classList.add('modal');
          modal.style.width = el.clientWidth + 'px';
          modal.style.height = el.clientHeight + 'px';
          modal.style.transform = 'translate3d(' + offset.left + 'px, ' + offset.top + 'px, 0)';
          modal.style.opacity = 0;

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
    });

  addEventListener(document, 'click', 'a[data-modal-close]', function (evt) {
    var modalContainer = document.getElementById('modal-container');
    var offset = selectedProject.getBoundingClientRect();

    var modal = document.getElementById('modal');
    modal.style.width = selectedProject.clientWidth + 'px';
    modal.style.height = selectedProject.clientHeight + 'px';
    modal.style.transform = 'translate3d(' + offset.left + 'px, ' + offset.top + 'px, 0)';
    modal.style.opacity = 0;

    modal.addEventListener('transitionend', function () {
      modalContainer.classList.add('hidden');
    });

    evt.preventDefault();
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
