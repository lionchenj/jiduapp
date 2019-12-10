import * as React from 'react';

import { NavBar, Icon,  Button, WhiteSpace, TextareaItem, Toast, Modal} from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';



interface QandanswersputProps {
    history: History
}

interface QandanswersputState {
    files: any[];
    qaps:string;
}


export class Qandanswersput extends React.Component<QandanswersputProps, QandanswersputState> {
    private _content: string;
    autoFocusInst:any

    constructor(props: QandanswersputProps) {
        super(props)
        this._content = ""
        this.state = {
            files: [],
            qaps:''
        }
  
    }
    componentDidMount() {
        UserService.Instance.question_answer_example().then( (res) => {
            UIUtil.hideLoading()
            this.setState({
                qaps:'例:'+res.data
            })
            this.autoFocusInst.focus();
        }).catch( (err: Error) => {
            UIUtil.showError(err)
        })
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    onChange = (files: any[], type: any, index: number) => {
        this.setState({
          files,
        });
    }

    onSubmit = () => {
        if (this._content.length == 0) {
            Toast.info("请输入问题")
            return 
        }
        UIUtil.showLoading("上传中")
        UserService.Instance.add_question_answer(this._content).then( () => {
            UIUtil.hideLoading()
            const alert = Modal.alert
            alert('提示','感谢您的提问',[{ text:'ok',onPress: () => {
                this.props.history.goBack()
            },style: 'default' }])
        }).catch( (err: Error) => {
            UIUtil.showError(err)
        })
    }

    onContentBlur = (value: string) => {
        this._content = value
    }

    public render() {
        return (
            <div className="address-container feedback">
                <NavBar  icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">提问</div>
                </NavBar>

                <div className="borcccb fs16 padding bff">留下你的问题，并使用“？”结尾。</div>
                <TextareaItem
                    onChange={this.onContentBlur}
                    className="feedback-textarea"
                    placeholder={this.state.qaps}
                    ref={(ref:any) => (this.autoFocusInst = ref)}
                    autoHeight
                    rows={2}
                    count={30}
                />
            
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