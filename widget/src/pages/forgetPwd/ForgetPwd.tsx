import * as React from 'react';

import { List, InputItem, Button, Toast} from "antd-mobile";
import { History } from "history";
// import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";
import { Redirect, Link } from "react-router-dom";


interface ForgetPwdProps {
    history: History
}

interface ForgetPwdState {
    codeCountDown: number,
    redirectToLogin: boolean,
    changeL:boolean
}

export class ForgetPwd extends React.Component<ForgetPwdProps, ForgetPwdState> {
    codeCountDownTimer: number
    phone?: string
    code?: string
    password?: string
    confirmPassword?: string

    constructor(props: ForgetPwdProps) {
        super(props)
        this.codeCountDownTimer = 0
        this.state = {
            changeL:true,
            codeCountDown: 0,
            redirectToLogin: false
        }
    }
    changeCn = () => {
        this.setState({
            changeL: true
        })
    }
    changeEn = () => {
        this.setState({
            changeL: false
        })
    }
    onRedirectBack = () => {
        const history = this.props.history;
        history.go(-1);
    }

    onPhoneBlur = (value: string) => {
        this.phone = value
    }

    onCodeBlur = (value: string) => {
        this.code = value
    }

    onPasswordBlur = (value: string) => {
        this.password = value
    }

    onConfirmPasswordBlur = (value: string) => {
        const info = "密码与确认密码不一致"
        if(value != this.password){
            Toast.info(info)
            return
        }
    }

    getCode = () => {
        if (this.state.codeCountDown > 0) {
            return 
        }
        const phone =  this.phone
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
        // UserService.Instance.getMobileMassges(trimPhone).then( ()=> {
        //     if (this.codeCountDownTimer != 0) {
        //         window.clearInterval(this.codeCountDownTimer!)
        //     }
        //     const info = "验证码发送成功"
        //     UIUtil.showInfo(info)
        //     this.setState({
        //         ...this.state,
        //         codeCountDown: 60
        //     }, () => {
        //         this.codeCountDownTimer = window.setInterval(this._codeCountDownHander, 1000)
        //     })
        // }).catch( (err)=> {
        //     const message = (err as Error).message
        //     Toast.fail(message)
        // })
    }

    onSubmit = () => {
        const info = "请输入11位手机号码"
        const codeInfo = "请输入验证码"
       
        const passwordInfo = "请输入不少于6位长度的密码"
        if (!this.phone) {
            Toast.info(info)
            return
        } 
        const trimPhone = Util.trim(this.phone!)
        if (!Util.validPhone(trimPhone)){
            Toast.info(info)
            return
        }
        if (!this.code) {
            Toast.info(codeInfo)
            return
        }
        // const trimCode = Util.trim(this.code!)
        // if (!this.password) {
        //     Toast.info(passwordInfo)
        //     return
        // }
        const trimPassword = Util.trim(this.password!)
        if (!Util.validPassword(trimPassword)){
            Toast.info(passwordInfo)
            return 
        }
        // UserService.Instance.updatePassword(trimPhone, trimCode, trimPassword).then( () => {
        //     const alert = Modal.alert
        //     alert('提示','修改密码成功，请重新登录',[{ text:'ok', style: 'default', onPress: () => {
        //         this.setState({
        //             ...this.state,
        //             redirectToLogin: true
        //         })
        //     }
        //     }])
            
        // }).catch( err => {
        //     const message = (err as Error).message
        //     Toast.fail(message)
        // })
        
    }

    public render() {
        const { redirectToLogin} = this.state
    
        if (redirectToLogin) {
            const to = {
                pathname: "/login"
            }
            return <Redirect to={to} />
        }
        return (
            <div className="login-container">
            <div className="login_bg">
            </div>
                <div className="login_content">
                    <List className="login_border">
                        <InputItem type="digit" maxLength={11}  placeholder="请输入手机号" onChange={this.onPhoneBlur}></InputItem>
                    </List>
                    <List className="login_border">
                        <InputItem placeholder="请输入短信验证码" onChange={this.onCodeBlur}
                            extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                            onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}>
                        </InputItem>
                    </List>
                    <List className="login_border">
                        <InputItem type="password" placeholder="请输入登录密码" onChange={this.onPasswordBlur}></InputItem>
                    </List>
                    <List className="login_border">
                        <InputItem type="password" placeholder="请确认登录密码" onChange={this.onConfirmPasswordBlur}></InputItem>
                    </List>
                    <List className="login_forget">
                        <Link to="/login" className="forget-link" >账号登陆</Link>
                    </List>
                    <div className="login_button">
                        <List className="content-item">
                            <Button type="ghost" className="login_confirm" onClick={this.onSubmit}>确认</Button>
                        </List>
                    </div>
                </div>
            </div>
        )
    }

    public componentWillUnmount() {
        this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
        this.codeCountDownTimer = 0
    }

    // private _codeCountDownHander = () =>  {
    //     const newCodeCount = this.state.codeCountDown - 1
    //     if (newCodeCount <= 0) {
    //         this.codeCountDownTimer && window.clearInterval(this.codeCountDownTimer)
    //         this.codeCountDownTimer = 0
    //     }
    //     this.setState({
    //         ...this.state,
    //         codeCountDown: newCodeCount
    //     })
    // }
}