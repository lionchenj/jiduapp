import * as React from "react";
import { History, Location } from "history";
// import { Redirect } from "react-router-dom";
// import { List, InputItem, Button, Toast, WhiteSpace } from "antd-mobile";
import { Toast } from "antd-mobile";
import { UserStorage } from "../../storage/UserStorage";
import { homePage } from "../../utils/Constants";
// import defaults from "../../assets/default.png";
import "./Login.css";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "../../service/UserService";

export interface LoginProps {
  history: History;
  location: Location<any> | undefined;
}

interface LoginState {
  redirectToReferrer: boolean;
  activate: boolean;
  closeApp: string;
  code: string;
  appid: string;
}

export class Login extends React.Component<LoginProps, LoginState> {
  phone: string;
  password: string;
  activation: string;
  constructor(props: LoginProps) {
    super(props);
    this.state = {
      redirectToReferrer: true,
      activate: false,
      closeApp: "0",
      code: "",
      appid:''
    };
  }


  public componentDidMount() {
    this.wechat_info();
  }
  wechat_info = () => {
    UserService.Instance.wechat_info().then((res: any) => {
      var is_weixin = (function() {
        return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
      })();
      if (is_weixin) {
        //微信浏览器
        var url = location.search; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
          var str = url.substr(1);
          var strs = str.split("&");
          for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
          }
        }
        if (theRequest["id"]) {
          UserStorage.setTimeCookie("superior.openid", theRequest["id"],60);
        }
        if (theRequest["orderid"]) {
          UserStorage.setTimeCookie("orderid", theRequest["id"],60);
        }
        let code = theRequest["code"];
        // let state = theRequest["state"];
        if ( !code || code == window.localStorage.getItem("code")) {
          window.location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid="+res.data.appid+"&redirect_uri="+homePage+"&response_type=code&scope=snsapi_userinfo#wechat_redirect");
        } else {
          window.localStorage.setItem("code", code);
          let superid = UserStorage.getCookie("superior.openid") || "";
          let orderid = UserStorage.getCookie("orderid") || "";
          let data:any = {}
          if(superid){
            data['referee'] = superid;
          }
          data['code'] = code;
          UserService.Instance.wechatLogin(data).then((res: any) => {
              UserStorage.setCookie("token", res.data.token);
              window.localStorage.setItem("token", res.data.token);
              UserStorage.setCookie("type", "HomeTab");
              var date = new Date().getTime();
              UIUtil.foowwLocalStorage.set("token", res.data.token, date + 10000);
              UserService.Instance.getUserInfo().then(userInfo => {
                UserStorage.setCookie("userInfo", JSON.stringify(userInfo));
                if(orderid != ''){
                  this.props.history.push("/coupongoshare?orderid="+orderid);
                }else{
                  this.props.history.push("/");
                }
              })
            })
            .catch(err => {
              const message = (err as Error).message;
              Toast.fail(message);
            });
        }
      }else{
        UserStorage.setCookie("User.openid",'20190723221534');
        UserStorage.setCookie("token", 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXRpYW5iYW8ud2VpYmFua2VyLmNuXC9hcGlcL3dlY2hhdGxvZ2luIiwiaWF0IjoxNTY2MjgyMzE4LCJleHAiOjE2ODcyNDIzMTgsIm5iZiI6MTU2NjI4MjMxOCwianRpIjoiSzdqWUE5dVFuTG9xSFVaSSIsInN1YiI6OCwicHJ2IjoiMDJlNDU0OTE4MzhmMDE1ZGY5MzA0N2U2NWJhNzdkNTIwZjg2Mjk4YyJ9.vsVnFeuPaq21TUsmE-5gPpwoG1QNr0xiNhTSXGaDm94');
        window.localStorage.setItem("token", 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9kZXRpYW5iYW8ud2VpYmFua2VyLmNuXC9hcGlcL3dlY2hhdGxvZ2luIiwiaWF0IjoxNTY2MjgyMzE4LCJleHAiOjE2ODcyNDIzMTgsIm5iZiI6MTU2NjI4MjMxOCwianRpIjoiSzdqWUE5dVFuTG9xSFVaSSIsInN1YiI6OCwicHJ2IjoiMDJlNDU0OTE4MzhmMDE1ZGY5MzA0N2U2NWJhNzdkNTIwZjg2Mjk4YyJ9.vsVnFeuPaq21TUsmE-5gPpwoG1QNr0xiNhTSXGaDm94');
        this.props.history.push("/");
      }
    })
    .catch(err => {
      const message = (err as Error).message;
      Toast.fail(message);
    });
    
  }
  public render() {
    return (
      <div className="login-container">
      </div>
    );
  }
}
