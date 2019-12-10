module.exports = function appOut() {
    document.body.addEventListener("focusout",()=>{
        // setTimeout(() => {
        //     const scrollHeight = document.documentElement.scrollTop||document.body.scrollTop||0;
        //     window.scrollTo(0,Math.max(scrollHeight - 1, 0))
        // }, 100);
        // setTimeout(function(){
        //     window.scrollTo(0, 0)
        //   },100)
          //失去焦点事件后触发
        let ua = window.navigator.userAgent;
        //判断系统
        if (!!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
            //ios系统
            let currentPosition, timer;
            let speed = 1;
            timer = setInterval(function () {
                currentPosition =
                document.documentElement.scrollTop || document.body.scrollTop;
                currentPosition -= speed;
                window.scrollTo(0, currentPosition); //页面向上滚动
                currentPosition += speed;
                window.scrollTo(0, currentPosition); //页面向下滚动
                clearInterval(timer);
                // alert("失去焦点")
            }, 100);
        }
    })
    // document.body.addEventListener('touchmove', function (e) {
    //     e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    //   }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
    document.addEventListener('plusready', function() {
        var webview = plus.webview.currentWebview();
        plus.key.addEventListener('backbutton', function() {
            webview.canBack(function(e) {
                if(e.canBack) {
                    webview.back();
                } else {
                    mui.plusReady(function() {
                        //首页返回键处理
                        //处理逻辑：1秒内，连续两次按返回键，则退出应用；
                        var first = null;
                        plus.key.addEventListener('backbutton', function() {
                            //首次按键，提示‘再按一次退出应用’
                            if(!first) {
                                first = new Date().getTime();
                                mui.toast('再按一次退出应用');
                                setTimeout(function() {
                                    first = null;
                                }, 1000);
                            } else {
                                if(new Date().getTime() - first < 1500) {
                                    plus.runtime.quit();
                                }
                            }
                        }, false);
                    });
                }
            })
        });
    });
}