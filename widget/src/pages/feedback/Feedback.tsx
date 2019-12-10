import * as React from 'react';

import { NavBar, Icon,  Button, WhiteSpace, TextareaItem, ImagePicker, Toast, Modal} from "antd-mobile";
import { History } from "history";
import "./Feedback.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';



interface FeedbackProps {
    history: History
}

interface FeedbackState {
    files: any
    filelist:any
}


export class Feedback extends React.Component<FeedbackProps, FeedbackState> {
    private _content: string;
    constructor(props: FeedbackProps) {
        super(props)
        this._content = ""
        this.state = {
            files: [],
            filelist: []
        }
  
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onChange = (files: any, type: any, index: number) => {
        if(type == "remove"){
            this.setState({
                files:[],
                filelist:''
              });
            return;
        }
        this.setState({
            files,
        });
    }

    onSubmit = () => {
        // var fileList:any = '';
        // fileList = this.state.filelist.join();
        var num = 0;
        if (this._content.length == 0) {
            Toast.info("请输入反馈内容")
            return 
        }
        UIUtil.showLoading("上传中")
        let list:any = this.state.filelist;
        this.state.files.map((flie:any)=>{
            UserService.Instance.uploadFile(flie.file).then( (res) => {
                list.push(res);
                num++;
            }).catch( (err: Error) => {
                UIUtil.showError(err)
            })
        })
        var set = setInterval(() => {
            if(num == this.state.files.length){
                clearInterval(set)
                UserService.Instance.suggest(this._content, list.join()).then( () => {
                    UIUtil.hideLoading()
                    const alert = Modal.alert
                    alert('提示','感谢您的反馈',[{ text:'ok',onPress: () => {
                        this.props.history.goBack()
                    },style: 'default' }])
                }).catch( (err: Error) => {
                    UIUtil.showError(err)
                })
            }
        }, 200);
    }

    onContentBlur = (value: string) => {
        if(value.length > 200){
            return;
        }
        this._content = value
    }

    public render() {
        return (
            <div className="address-container feedback">
                <NavBar  icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">意见反馈</div>
                </NavBar>

       
                <TextareaItem
                    onChange={this.onContentBlur}
                    className="feedback-textarea"
                    placeholder='请输入你的意见或者建议，最多200字'
                    autoHeight
                    rows={6}
                    count={200}
                />
                    
                <div className="feedback-images-container">
                    <div className="feedback-images-text"> 点击添加图片（不超过500KB），最多添加3张</div>
                    <ImagePicker
                        files={this.state.files}
                        onChange={this.onChange}
                        selectable={this.state.files.length < 3}
                        multiple={false}
                        />
                </div>
            
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className="address-footer-button-container question_btn">
                    <Button type="primary" onClick={this.onSubmit}>
                    确认提交
                    </Button>
                  </div>
            </div>
        )
    }
}