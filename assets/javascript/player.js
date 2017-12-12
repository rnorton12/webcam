(function () {
    if (!window.addEventListener) {
        if (window.attachEvent)
            window.addEventListener = function (event, callback) {
                window.attachEvent('on' + event, callback);
            };
    }
    var
        $containers = document.getElementsByName('lkr-timelapse-player');
    var $_ = {
        mobileAdHeight: 50,
        ratio: 16 / 9,
        root: '//api.lookr.com'
    };
    var _ = {
        mobile: (navigator.userAgent.toLowerCase().indexOf('mobile') > -1),
        portrait: screen.height > screen.width
    }
    var iframeHeight = function ($iframe) {
        if (!$iframe.offsetWidth)
            return;
        var
            height = ($iframe.offsetWidth / $_.ratio);
        if (_.mobile && _.portrait)
            height += $_.mobileAdHeight;
        var
            screenHeight = Math[_.portrait ? 'max' : 'min'](screen.width, screen.height);
        height = Math.min(height, screenHeight);
        return height;
    };
    var observe = function ($container) {
        if (!window.MutationObserver)
            return;
        var observer = new MutationObserver(function (mutations) {
            if ($container.offsetWidth > 0) {
                observer.disconnect();
                delete observer;
                render();
            }
        });
        observer.observe(document, {
            attributes: true,
            characterData: false,
            childList: false,
            subtree: true
        });
    };
    var render = function () {
        for (var c = 0; c < $containers.length; c++) {
            var
                $container = $containers[c],
                $iframe = document.createElement('iframe');
            if ($container.offsetWidth === 0) {
                observe($container);
                continue;
            }
            var
                data = ['id', 'play'],
                params = {};
            for (var d = 0; d < data.length; d++) {
                params[data[d]] = encodeURIComponent($container.getAttribute('data-' + data[d]));
                if (!params[data[d]])
                    console.warn('Value missing for this attribute: ' + data[d]);
            }
            $iframe.width = '100%';
            $iframe.name = 'lkr-timelapse-player-iframe';
            $iframe.frameBorder = '0';
            $iframe.setAttribute('allowFullScreen', true);
            $iframe.style.border = 'none';
            $iframe.src = $_.root + '/embed/player/' + params['id'] + '/' + params['play'] + '?autoresize=1&referrer=' + encodeURIComponent(window.top.location);
            $container.parentNode.replaceChild($iframe, $container);
            $iframe.height = iframeHeight($iframe);
        }
    };
    var updateHeight = function () {
        var
            $iframes = document.getElementsByName('lkr-timelapse-player-iframe');
        for (var i = 0; i < $iframes.length; i++)
            $iframes[i].height = iframeHeight($iframes[i]);
    }
    document.addEventListener('DOMContentLoaded', function () {
        render();
    });
    document.addEventListener('msfullscreenchange', function () {
        updateHeight();
    });
    document.addEventListener('mozfullscreenchange', function () {
        updateHeight();
    });
    document.addEventListener('webkitfullscreenchange', function () {
        updateHeight();
    });
    window.addEventListener('orientationchange', function () {
        window.dispatchEvent(new Event('resize'));
    });
    window.addEventListener('resize', function () {
        var
            orientation = screen.orientation ? screen.orientation.angle : window.orientation;
        switch (orientation) {
            case 90:
            case -90:
                _.portrait = false;
                break;
            default:
                _.portrait = true;
        }
        updateHeight();
    });
    render();
})();