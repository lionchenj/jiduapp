import * as React from 'react';

import { NavBar, Icon,  Button, WhiteSpace, TextareaItem, Modal, List, Toast, ImagePicker} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import star from "../../assets/appimg/start.png";
import star_n from "../../assets/appimg/start_n.png";



interface goodsevaluateProps {
    history: History
    location: Location;
}

interface goodsevaluateState {
    files: any[],
    deliveryStar:number,
    serviceStar:number,
    goodStar:number
    fileslist:any,
}


export class goodsevaluate extends React.Component<goodsevaluateProps, goodsevaluateState> {
    _content: string;
    id:string;
    goodsid:string;
    constructor(props: goodsevaluateProps) {
        super(props)
        this._content = ""
        this.state = {
            files: [],
            deliveryStar:0,
            serviceStar:0,
            goodStar:0,
            fileslist:[]
        }
  
    }
    componentDidMount() {
        if(!this.props.location.state){
            this.props.history.goBack();
            return
        }
        this.id = this.props.location.state.id;
        this.goodsid = this.props.location.state.goodsid;
      }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    setdeliveryStar = (e:any) => {
        let index = e.currentTarget.dataset.index;
        this.setState({
            deliveryStar:index
        })
    };
    setserviceStar = (e:any) => {
        let index = e.currentTarget.dataset.index;
        this.setState({
            serviceStar:index
        })
    };
    setgoodStar = (e:any) => {
    let index = e.currentTarget.dataset.index;
        this.setState({
            goodStar:index
        })
    };

    onChange = (files: any, type: any, index: number) => {
        this.setState({
            files,
        });
    }
    onSubmit = () => {
        // var fileList:any = '';
        // fileList = this.state.fileslist.join();
        if (this._content.length == 0) {
            Toast.info("请输入评价内容")
            return 
        }
        let list:any = [],num = 0;
        UIUtil.showLoading("上传中");
        this.state.files.map((file:any)=>{
            UserService.Instance.uploadFile(file.file).then( (res) => {
                list.push(res);
                num++;
            }).catch( (err: Error) => {
                UIUtil.showError(err)
            })
        })
        let set = setInterval(() => {
            if(num == this.state.files.length){
                clearInterval(set);
                UserService.Instance.comment(this.id, this._content, this.state.deliveryStar, this.state.serviceStar, this.state.goodStar,this.goodsid,list.join()).then( () => {
                    UIUtil.hideLoading()
                    const alert = Modal.alert
                    alert('提示','感谢您的评价',[{ text:'ok',onPress: () => {
                        this.props.history.goBack()
                    },style: 'default' }])
                }).catch( (err: Error) => {
                    UIUtil.showError(err)
                })
            }
        }, 200);
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
                        <div className="nav-title">评价</div>
                </NavBar>

       
                <TextareaItem
                    onChange={this.onContentBlur}
                    className="feedback-textarea"
                    placeholder='宝贝满足你的期待吗？说说它的优点和美中不足的地方吧'
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
                <List>
                    <div className="flex padding">
                        <div className="margin-rsm">描述相符</div>
                        <div className="comment flex">
                            <img className="margin-rsm" src={this.state.deliveryStar > 0?star:star_n} data-index='1' onClick={this.setdeliveryStar}></img>
                            <img className="margin-rsm" src={this.state.deliveryStar > 1?star:star_n} data-index='2' onClick={this.setdeliveryStar}></img>
                            <img className="margin-rsm" src={this.state.deliveryStar > 2?star:star_n} data-index='3' onClick={this.setdeliveryStar}></img>
                            <img className="margin-rsm" src={this.state.deliveryStar > 3?star:star_n} data-index='4' onClick={this.setdeliveryStar}></img>
                            <img className="margin-rsm" src={this.state.deliveryStar > 4?star:star_n} data-index='5' onClick={this.setdeliveryStar}></img>
                        </div>
                    </div>
                </List>
                <List>
                    <div className="flex padding">
                        <div className="margin-rsm">物流服务</div>
                        <div className="comment flex">
                            <img className="margin-rsm" src={this.state.serviceStar > 0?star:star_n} data-index='1' onClick={this.setserviceStar}></img>
                            <img className="margin-rsm" src={this.state.serviceStar > 1?star:star_n} data-index='2' onClick={this.setserviceStar}></img>
                            <img className="margin-rsm" src={this.state.serviceStar > 2?star:star_n} data-index='3' onClick={this.setserviceStar}></img>
                            <img className="margin-rsm" src={this.state.serviceStar > 3?star:star_n} data-index='4' onClick={this.setserviceStar}></img>
                            <img className="margin-rsm" src={this.state.serviceStar > 4?star:star_n} data-index='5' onClick={this.setserviceStar}></img>
                        </div>
                    </div>
                </List>
                <List>
                    <div className="flex padding">
                        <div className="margin-rsm">服务态度</div>
                        <div className="comment flex">
                            <img className="margin-rsm" src={this.state.goodStar > 0?star:star_n} data-index='1' onClick={this.setgoodStar}></img>
                            <img className="margin-rsm" src={this.state.goodStar > 1?star:star_n} data-index='2' onClick={this.setgoodStar}></img>
                            <img className="margin-rsm" src={this.state.goodStar > 2?star:star_n} data-index='3' onClick={this.setgoodStar}></img>
                            <img className="margin-rsm" src={this.state.goodStar > 3?star:star_n} data-index='4' onClick={this.setgoodStar}></img>
                            <img className="margin-rsm" src={this.state.goodStar > 4?star:star_n} data-index='5' onClick={this.setgoodStar}></img>
                        </div>
                    </div>
                </List>
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