import * as React from 'react';
import { NavBar, Icon, List} from "antd-mobile";
import { History } from "history";
import "./Settings.css"
import { UserStorage } from "../../storage/UserStorage";


interface SettingsProps {
    history: History,
    
}

interface SettingsState {
}

export class Settings extends React.Component<SettingsProps, SettingsState> {

    constructor(props: SettingsProps) {
        super(props)
        this.state = {
        }
    }

    onRedirectBack = () => {
        const history = this.props.history
            history.push('/home')
    }
    
    onLogout = () => {
        UserStorage.delCookie('User.AccessTokenKey');
        UserStorage.delCookie('gesture');
        UserStorage.delCookie("touchpwd");
        this.setState( {
            redirectToLogin: true
        })
    }

    public render() {
        return (
            <div className="fans-container">
                <NavBar  icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">设置</div>
                </NavBar>
                <List renderHeader={() => ''} className="my-list">
                    <List.Item arrow="horizontal" onClick={()=>{this.props.history.push("/updata_head")}}>修改头像</List.Item>
                    <List.Item arrow="horizontal" onClick={()=>{this.props.history.push("/updata_name")}}>修改昵称</List.Item>
                    {/* <List.Item arrow="horizontal" onClick={()=>{this.props.history.push("/updata_phone")}}>修改手机号码</List.Item> */}
                </List>
                {/* <div className="fans-footer">
                    <Button onClick={this.onLogout} >退出登录</Button>
                </div> */}
            </div>
        )
    }
}