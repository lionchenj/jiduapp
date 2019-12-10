import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Util } from '../../utils/Util';
import { UIUtil } from "../../utils/UIUtil";
import { Redirect } from "react-router-dom";

interface UpdataPhoneProps {
    history: History
}

interface UpdataPhoneState {
    codeCountDown: number,
    redirectToLogin: boolean,
    changeL:boolean
}

export class UpdataPhone extends React.Component<UpdataPhoneProps, UpdataPhoneState> {
    codeCountDownTimer: number
    phone?: string
    code?: string
    password?: string
    confirmPassword?: string

    constructor(props: UpdataPhoneProps) {
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
        this.setState({
            ...this.state,
            redirectToLogin: true
        })
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
        const confirmPasswordInfo = "密码与确认密码不一致"
        if(value != this.password){
            Toast.info(confirmPasswordInfo)
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
        }).catch( (err)=> {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }

    onSubmit = () => {
        const info = "请输入11位手机号码"
        const codeInfo = "请输入验证码"
        const trimPhone = Util.trim(this.phone!)
        if (!Util.validPhone(trimPhone)){
            Toast.info(info)
            return
        }
        if (!this.code) {
            Toast.info(codeInfo)
            return
        }


        UserService.Instance.bindmobile(trimPhone, this.code).then( () => {
            const alert = Modal.alert
            alert('提示','修改手机号码成功',[{ text:'ok', style: 'default', onPress: () => {
                this.setState({
                    ...this.state,
                    redirectToLogin: true
                })
            }
            }])
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    public render() {
        const { redirectToLogin} = this.state
    
        if (redirectToLogin) {
            const to = {
                pathname: "/settings"
            }
            return <Redirect to={to} />
        }
        return (
            <div className="fans-container updatapwd">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">修改手机号码</div>
                </NavBar>
                <List renderHeader={() => ''} className="content-item-border">
                    <InputItem type="digit" maxLength={11}  placeholder="请输入手机号" onChange={this.onPhoneBlur}></InputItem>
                </List>
                <List className="content-item-border">
                    <InputItem placeholder="请输入短信验证码" onChange={this.onCodeBlur}
                        extra={<Button disabled={this.state.codeCountDown > 0} type="ghost" size="small" className="code-button" >{ this.state.codeCountDown > 0 ? this.state.codeCountDown: "获取验证码"}</Button>}
                        onExtraClick={ this.state.codeCountDown > 0 ? undefined : this.getCode}>
                    </InputItem>
                </List>
                {/* <List className="content-item-border">
                    <InputItem type="password" placeholder="请输入登录密码" onChange={this.onPasswordBlur}></InputItem>
                </List>
                <List className="content-item-border">
                    <InputItem type="password" placeholder="请确认登录密码" onChange={this.onConfirmPasswordBlur}></InputItem>
                </List> */}
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="registered_button">
                    <List className="content-item">
                        <Button type="ghost" className="registered_confirm" onClick={this.onSubmit}>修改密码</Button>
                    </List>
                </div>
            </div>
        )
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