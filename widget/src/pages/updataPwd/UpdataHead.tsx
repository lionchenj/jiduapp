import * as React from 'react';

import { NavBar, Icon, Button, WhiteSpace, Toast, ImagePicker, Modal} from "antd-mobile";
import { History } from "history";
// import { UserService } from '../../service/UserService';
import { Redirect } from "react-router-dom";
import { UIUtil } from 'src/utils/UIUtil';
import { UserService } from 'src/service/UserService';

interface UpdataHeadProps {
    history: History
}

interface UpdataHeadState {
    redirectToLogin: boolean,
    files:any;
    filelist:any
}

export class UpdataHead extends React.Component<UpdataHeadProps, UpdataHeadState> {
    phone?: string

    constructor(props: UpdataHeadProps) {
        super(props)
        this.state = {
            redirectToLogin: false,
            files:[],
            filelist:[]
        }
    }
    componentDidMount() {
        
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
    onChange = (files: any, type: any, index: number) => {
        if(type == "remove"){
            this.setState({
                files:[],
                filelist:''
              });
            return;
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.uploadFile(files[0].file).then( (res:any) => {
            this.setState({
                files,
                filelist:res
              });
            UIUtil.hideLoading()
        }).catch( (err: Error) => {
            UIUtil.showError(err)
        })
    }
    onSubmit = () => {
        const info = "请上传新头像图片"
        if (!this.state.filelist) {
            Toast.info(info)
            return
        } 
        UserService.Instance.update_head(this.state.filelist).then( () => {
            const alert = Modal.alert
            alert('提示','修改头像成功',[{ text:'ok', style: 'default', onPress: () => {
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
            <div className="fans-container updatahead">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">修改头像</div>
                </NavBar>
                <div className="feedback-images-container">
                    <div className="feedback-images-text"> 点击添加图片（不超过500KB）</div>
                    <ImagePicker
                        files={this.state.files}
                        onChange={this.onChange}
                        // disableDelete
                        selectable={this.state.files.length < 1}
                        multiple={false}
                        />
                </div>
                
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container question_btn padding-t">
                    <Button type="primary" onClick={this.onSubmit}>修改</Button>
                </div>
            </div>
        )
    }
}
