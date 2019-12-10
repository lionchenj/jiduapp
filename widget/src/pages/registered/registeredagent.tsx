import * as React from "react";

import {
  NavBar,
  Icon,
  Button,
  Toast,
  List,
  InputItem,
  Modal
} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
// import { UserStorage } from "../../storage/UserStorage";
import defaults from "../../assets/zhucebg.png";
import { UIUtil } from '../../utils/UIUtil';
import { Util } from "src/utils/Util";
// import { UserStorage } from "src/storage/UserStorage";

interface registeredagentProps {
  history: History;
  location: Location;
}

interface registeredagentState {
  mobile:string,
  codeCountDown:number,
  get_description:any
  head_img:string;
}
export class registeredagent extends React.Component<registeredagentProps,registeredagentState> {
  registerData:string
  code:string
  codeCountDownTimer:number
  constructor(props: registeredagentProps) {
    super(props);
    this.codeCountDownTimer = 0
    this.state = {
      mobile:"",
      codeCountDown:0,
      get_description:'',
      head_img:''
    };
  }

  onRedirectBack = () => {
    this.props.history.push("/")
  };

  public componentDidMount() {
    UserService.Instance.get_description('1').then( (res:any)=> {
      this.setState({
        get_description:res.data.text,
        head_img:res.data.head_img
      })
    }).catch( (err) => {
        UIUtil.showError(err)
    })
  }
  //手机
  onPhoneBlur = (val: any) => {
    this.setState({
      mobile: val 
    });
  };
  //验证码
  onCodeBlur = (value: string) => {
    this.code = value
  }
  //获取验证码
  getCode = () => {
    if (this.state.codeCountDown > 0) {
        return 
    }
    const phone =  this.state.mobile
    const info = "请输入11位手机号码"
    if (!phone) {
        Toast.info(info)
        return
    }
    const trimPhone = Util.trim(phone)
    if (!Util.validPhone(trimPhone)) {
        Toast.info(info)
        return 
  }
    UIUtil.showLoading("正在发送验证码")
    UserService.Instance.getMobileMassges(trimPhone).then( ()=> {
        if (this.codeCountDownTimer != 0) {
            window.clearInterval(this.codeCountDownTimer!)
        }
        const info = "验证码发送成功"
        UIUtil.showInfo(info)
        this.setState({
            ...this.state,
            codeCountDown: 60
        }, () => {
            this.codeCountDownTimer = window.setInterval(this._codeCountDownHander, 1000)
        })
    }).catch( (err) => {
        UIUtil.showError(err)
    })
  }
  onSubmit = () => {
    if(!this.state.mobile){
      UIUtil.showInfo('请输入手机号码');
      return;
    }
    if(!this.code){
      UIUtil.showInfo('请输入验证码');
      return;
    }
    UserService.Instance.apply_for(this.state.mobile,this.code,'1').then( ()=> {
      Modal.alert('提示',"申请代理商成功")
      this.props.history.push("/");
    }).catch( (err) => {
        UIUtil.showError(err)
    })
  }
  goend = () => {
    this.props.history.push("/");
  };
  public render() {
    return (
      <div className="address-container registered">
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">申请代理商</div>
        </NavBar>
        <div className="red_head reg_bg">
            <img src={this.state.head_img||defaults} alt=""/>
        </div>
        <div className="margin-t5">
          <List>
            <InputItem
                type="number"
                maxLength={11}
                placeholder={"请输入手机号码"}
                onChange={this.onPhoneBlur}
              >
              </InputItem>
            </List>
            <List className="content-item-border">
              <InputItem  type="digit" placeholder="请输入短信验证码" onChange={this.onCodeBlur}
                  extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                  onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}>
              </InputItem>
            </List>
        </div>
        <div className="address-footer-button-container question_btn padding-t">
            <Button type="primary" onClick={this.onSubmit}>提交申请</Button>
        </div>
        <div className="padding bff">
          <div className="w100 padding-tb fs16 tac">代理商申请说明</div>
          <div className="about_content padding-t" dangerouslySetInnerHTML={{__html: this.state.get_description}} />
        </div>
      </div>
    );
  }
  public componentWillUnmount() {
    this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
    this.codeCountDownTimer = 0
  }

  private _codeCountDownHander = () =>  {
      const newCodeCount = this.state.codeCountDown - 1
      if (newCodeCount <= 0) {
          this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
          this.codeCountDownTimer = 0
      }
      this.setState({
          ...this.state,
          codeCountDown: newCodeCount
      })
  }
}
