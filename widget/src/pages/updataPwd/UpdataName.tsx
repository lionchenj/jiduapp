import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { Redirect } from "react-router-dom";

interface UpdataNameProps {
    history: History
}

interface UpdataNameState {
    redirectToLogin: boolean,
}

export class UpdataName extends React.Component<UpdataNameProps, UpdataNameState> {
    name?: string

    constructor(props: UpdataNameProps) {
        super(props)
        this.state = {
            redirectToLogin: false
        }
    }
    onRedirectBack = () => {
        this.setState({
            ...this.state,
            redirectToLogin: true
        })
    }

    onPhoneBlur = (value: string) => {
        this.name = value
    }

    onSubmit = () => {
        const info = "请输入昵称"
        if (!this.name) {
            Toast.info(info)
            return
        } 
        UserService.Instance.update_name(this.name).then( () => {
            const alert = Modal.alert
            alert('提示','修改昵称成功',[{ text:'ok', style: 'default', onPress: () => {
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
                        <div className="nav-title">修改昵称</div>
                </NavBar>
                <List renderHeader={() => ''} className="content-item-border">
                    <InputItem type="text"  placeholder="请输入新呢称" onChange={this.onPhoneBlur}></InputItem>
                </List>
                
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container question_btn padding-t">
                    <Button type="primary" onClick={this.onSubmit}>修改</Button>
                </div>
            </div>
        )
    }
}
