import { Toast } from "antd-mobile";
import { ApiError } from "./ApiError";
import { UserService } from "../service/UserService";
import { UserStorage } from "src/storage/UserStorage";
import { homePage } from "../utils/Constants";
var localStorage = window.localStorage;
var wx = require("weixin-js-sdk");
// var not_weixin = (function() {
//   return navigator.userAgent.toLowerCase().indexOf("micromessenger") === -1;
// })();
export class UIUtil {
  static foowwLocalStorage = {
    set: function (key:string, value:string, ttl_ms:any) {
        var data = { value: value, expirse: new Date(ttl_ms).getTime() };
        localStorage.setItem(key, JSON.stringify(data));
    },
    get: function (key:string) {
        var data = JSON.parse(localStorage.getItem(key)||"");
        if (data !== null) {
            debugger
            if (data.expirse != null && data.expirse+172800 < new Date().getTime()) {
                localStorage.removeItem(key);
            } else {
                return data.value;
            }
        }
        return null;
    }
  }

  static geturl (): any {
    //微信浏览器
    var url = location.hash; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("?");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    if(theRequest["orderid"]){
      let orderid = theRequest["orderid"]||''
      return {orderid};
    }
    if(theRequest["groupid"]){
      let groupid = theRequest["groupid"]||''
      return {groupid};
    }
    if(theRequest["goodsid"]){
      let goodsid = theRequest["goodsid"]||''
      return {goodsid};
    }
    if(theRequest["indextype"]){
      let indextype = theRequest["indextype"]||'HomeTab'
      UserStorage.setCookie("type",indextype);
      return false;
    }
  }
  static check(name:string,val: string ): boolean{
    let isCheck:any;
    switch (name) {
      case 'email':
        isCheck = val.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)
        if(isCheck){
          return false
        }else{
          return true
        }
      default:
      return false
    }
  }
static setTime (countDown:number): string {
  let count = parseInt((countDown/60%60).toString())
  let time = "0"+(count==0?"0":count)+":"+(countDown-count*60<0?(countDown<10?"0"+countDown:countDown):(countDown-count*60<10?"0"+(countDown-count*60):(countDown-count*60)))
  return time
}
  static showError(err: Error): void {
    UIUtil.hideLoading();
    if (err instanceof ApiError) {
      const message = `(${err.errorCode})${err.message}`;
      Toast.fail(message);
      return;
    }
    Toast.fail(err.message);
  }
  static showInfo(info: string): void {
    UIUtil.hideLoading();
    Toast.info(info);
  }

  static showLoading(info: string): void {
    Toast.loading(info, 0);
  }

  static hideLoading(): void {
    Toast.hide();
  }
  //是否微信
  static not_weixin(): boolean {
    // return not_weixin;
    return false;
  }
  
  //微信
  static wxConfig () {
    let url = UIUtil.getConfigUrl() || homePage;
    UserService.Instance.get_sign_package(url)
      .then((res: any) => {
        wx.config({
          debug:true,
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "chooseWXPay",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        });
        wx.ready(function() {});
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  };
  
  //获取url
  static getConfigUrl(){
    let u = window.navigator.userAgent;
    var iphone = u.indexOf("iphone");
    let url:string = '';
    // let url:string = window.localStorage.getItem('url');
    if (iphone != -1) {
        url = window.sessionStorage.getItem("configUrl")||'';//获取初始化的url
    } else {
        url = window.location.href.split('#')[0];
        // url = window.location.href
    }
    return url;
  }
  //我的订单支付
  static goorderPay(
    that: any,
    id: string,
  ): void {
    UIUtil.showLoading("跳转支付");
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "chooseWXPay",
          ]
        });
        wx.ready(function() {
          UserService.Instance.pay_order(id).then((res: any) => {
              wx.chooseWXPay({
                timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.paySign, // 支付签名
                success: function(res: any) {
                  UIUtil.showInfo("支付成功");
                  UIUtil.hideLoading();
                  that.getlist();
                  that.setState({
                      initialPage:0,
                  })
                },
                cancel: function(res: any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(res);
                  that.getlist();   
                  that.setState({
                      initialPage:0,
                  })               
                },
                fail: function (err:any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(JSON.stringify(err));
                  that.getlist();  
                  that.setState({
                      initialPage:0,
                  })                
                }
              });
            }).catch(err => {
              UIUtil.showInfo("支付失败");
              UIUtil.hideLoading();
              UIUtil.showError(err);
            });
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  //商品详情支付
  static goPay(
    that: any,
    id: string,
  ): void {
    UIUtil.showLoading("跳转支付");
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "chooseWXPay",
          ]
        });
        wx.ready(function() {
          UserService.Instance.pay_order(id).then((res: any) => {
              wx.chooseWXPay({
                timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.paySign, // 支付签名
                success: function(res: any) {
                  UIUtil.showInfo("支付成功");
                  UIUtil.hideLoading();
                  that.props.history.push("/order");
                },
                cancel: function(res: any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(res);
                  that.props.history.push("/order");  
                },
                fail: function (err:any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(JSON.stringify(err));
                  that.props.history.push("/order");           
                }
              });
            }).catch(err => {
              UIUtil.showInfo("支付失败");
              UIUtil.hideLoading();
              UIUtil.showError(err);
            });
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  //团购支付
  static groupPay(
    that: any,
    data: any,
    orderData:any,
  ): void {
//     that.props.history.push({pathname:"/goodsGroupShare",state:{data:orderData}});
// return;
    UIUtil.showLoading("跳转支付");
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "chooseWXPay",
          ]
        });
        wx.ready(function() {
          UserService.Instance.user_group_order(data).then((res: any) => {
              wx.chooseWXPay({
                timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                signType: res.data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.paySign, // 支付签名
                success: function(resp: any) {
                  UIUtil.showInfo("支付成功");
                  UIUtil.hideLoading();
                  UserService.Instance.user_group(res.orderid).then((res: any) => {
                    orderData['orderid'] = res.data.orderid;
                    that.props.history.push({pathname:"/goodsGroupShare",state:{data:orderData}});
                  }).catch( err => {
                      const message = (err as Error).message
                      Toast.fail(message)
                  })
                },
                cancel: function(res: any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(res);
                  that.props.history.push({pathname:"/order",state:{type:1}});
                },
                fail: function (err:any) {
                  UIUtil.hideLoading();
                  UIUtil.showInfo(JSON.stringify(err));
                  that.props.history.push({pathname:"/order",state:{type:1}});
                }
              });
            }).catch(err => {
              UIUtil.showInfo("支付失败");
              UIUtil.hideLoading();
              UIUtil.showError(err);
            });
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  static share (text?:string): void {
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
          //分享
          var shareData = {};
          let id = UserStorage.getAccessToken();
          shareData["title"] = "暨妒商城";
          shareData["desc"] = text;
          shareData["imgUrl"] = "https://dev170.weibanker.cn/chenjj/www/detianbao/logo.jpeg";
          shareData["link"] = homePage + "#/?id=" + id;
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareWeibo(shareData);
          wx.onMenuShareQZone(shareData);
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  static goodsshare (text:string,imgurl:string,id:string): void {
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
          //分享
          var shareData = {};
          shareData["title"] = text;
          shareData["desc"] = "暨妒商城";
          shareData["imgUrl"] = imgurl;
          shareData["link"] = homePage + "#/?goodsid=" + id;
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareWeibo(shareData);
          wx.onMenuShareQZone(shareData);
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  static groupshare (data:any): void {
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareWeibo",
            "onMenuShareQZone"
          ]
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
          //分享
          var shareData = {};
          // let id = UserStorage.getAccessToken();
          shareData["title"] = data.goodsname;
          shareData["desc"] = data.desc;
          shareData["imgUrl"] = data.img_url;
          shareData["link"] = homePage + "#/?groupid=" + data.goodsid;
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareWeibo(shareData);
          wx.onMenuShareQZone(shareData);
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
    
  }
  static sharecoupon (data:any): void {
    let url = UIUtil.getConfigUrl() || homePage+'';
    UserService.Instance.get_sign_package(url).then((res: any) => {
        wx.config({
          appId: res.data.appId,
          timestamp: res.data.timestamp,
          nonceStr: res.data.nonceStr,
          signature: res.data.signature,
          jsApiList: [
            // "updateAppMessageShareData",
            // "updateTimelineShareData",
            "onMenuShareAppMessage",
            "onMenuShareTimeline",
            "onMenuShareQQ",
            "onMenuShareQZone",
            "onMenuShareWeibo",
          ]
        });
        wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
          //分享
          var shareData = {};
          // let id = UserStorage.getAccessToken();
          shareData["title"] = data.cash.brand_name;
          shareData["desc"] = "满"+data.cash.least+"元起";
          shareData["imgUrl"] = "https://dev170.weibanker.cn/chenjj/www/detianbao/logo.jpeg";
          shareData["link"] = homePage + "#/?orderid=" + data.orderid;
          shareData["success"] = function() {
            alert('分享成功')
          };
          // wx.updateAppMessageShareData(shareData);
          // wx.updateTimelineShareData(shareData);
          wx.onMenuShareAppMessage(shareData);
          wx.onMenuShareTimeline(shareData);
          wx.onMenuShareQQ(shareData);
          wx.onMenuShareQZone(shareData);
          wx.onMenuShareWeibo(shareData);
        })
    }).catch(err => {
      UIUtil.showError(err);
    });
  }
  static isPhone(): boolean {
    var browser = {
      versions: (function() {
        var u = navigator.userAgent;
        return {
          //移动终端浏览器版本信息
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, //android终端或uc浏览器
          iPhone: u.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
          iPad: u.indexOf("iPad") > -1 //是否iPad
        };
      })()
    };
    if (
      browser.versions.iPhone ||
      browser.versions.iPad ||
      browser.versions.ios
    ) {
      return true;
    } else {
      return false;
    }
  }
  static scrollzero():void {
    setTimeout(function(){
      window.scrollTo(0, 0)
    },100)
  }
  static preventBackgroundScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (
      (e.deltaY < 0 && target.scrollTop <= 0) ||
      (e.deltaY > 0 && target.scrollHeight - target.clientHeight - target.scrollTop <= 0)
    ) {
      e.stopPropagation()
      e.preventDefault()
    }
  }
}
