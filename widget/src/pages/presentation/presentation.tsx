import * as React from 'react';
import { NavBar, Icon, List, InputItem, Button, Toast, Modal} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
// import { UserStorage } from "../../storage/UserStorage";
import { UIUtil } from 'src/utils/UIUtil';
import { UserStorage } from 'src/storage/UserStorage';

interface presentationProps {
    history: History
    location: Location;

}


interface presentationState {
    agreement:boolean;
    setIndex:'1'|'2';
    bankVlaue: any;
    serviceNum: number;
    assets_min: number;
    assets_max: number;
    number: number;
    name:string;
    cardID:string;
    quotaUsed: number;
    quotaConsumable: number;
    quotaUsed2: number;
    quotaConsumable2: number;
    logList:any;
    type: number;
    rate: number;
}




export class presentation extends React.Component<presentationProps, presentationState> {
    type:string
    constructor(props: presentationProps) {
        super(props);
          this.state = {
            agreement:false,
            bankVlaue:[],
            setIndex:'1',
            serviceNum: 0,
            assets_min: 0,
            assets_max: 0,
            number: 0,
            name:'',
            cardID:'',
            quotaConsumable: 0,
            quotaUsed: 0,
            quotaConsumable2: 0,
            quotaUsed2: 0,
            logList:[],
            type: 1,
            rate:0,
        };
        
      }

    onRedirectBack = () => {
        this.props.history.push("/")
    }
    componentDidMount() {
        if (!this.props.location.state) {
            this.props.history.push("/")
            return            
        }
        let user:any = UserStorage.getCookie('userInfo');
        user = JSON.parse(user);
        this.setState({
            quotaConsumable: user.quotaConsumable,
            quotaUsed: user.quotaUsed,
            quotaConsumable2: user.quotaConsumable2,
            quotaUsed2: user.quotaUsed2,
            type: this.props.location.state.type
        })
        this.type = this.props.location.state.type;
        this.get_assetsminmax()
        this.get_assets_recording(this.props.location.state.type)
      }
      get_assets_recording = (type:string) => {
        UserService.Instance.get_assets_recording(type).then( (res) => {
            this.setState({
                logList:res.data
            })
        }).catch( err => {
        })
      }
      get_assetsminmax = () => {
        UserService.Instance.get_assetsminmax().then( (res) => {
            let assets_rate = res.data.assets_rate/100;
            this.setState({
                assets_min:res.data.assets_min*1||0,
                assets_max:res.data.assets_max*1||0,
                serviceNum:assets_rate
            })
        }).catch( err => {
        })
      }
      //姓名
      onNameBlur = (val:any) => {
        this.setState({
            name:val,
        })
      }
      //身份证
      onCardIDBlur = (val:any) => {
        this.setState({
            cardID:val,
        })
      }
      //金额
    onNumberBlur = (val:any) => {
        this.setState({
            number:val,
            rate:this.state.serviceNum*val
        })
    }
    onCash = (e:any) => {
        let id = e.currentTarget.dataset.id;
        this.setState({
            setIndex:id,
            agreement:true
        })
    }
    confirm = () => {
        if(!this.state.name){
            UIUtil.showInfo("请输入姓名");
            return
        }
        if(!this.state.cardID){
            UIUtil.showInfo("请输入身份证");
            return
        }
        if(!this.state.number){
            UIUtil.showInfo("请输入金额");
            return
        }
        if(this.state.number < this.state.assets_min){
            UIUtil.showInfo("最少可提现："+this.state.assets_min);
            return
        }
        if(this.state.number > this.state.assets_max){
            UIUtil.showInfo("最多可提现："+this.state.assets_max);
            return
        }
        // if(this.state.number > this.state.quotaConsumable2){
        //     UIUtil.showInfo("最多可提现："+this.state.quotaConsumable2);
        //     return
        // }
        UIUtil.showLoading('提现中');
        UserService.Instance.add_assets(this.type,this.state.number,this.state.name,this.state.cardID).then( (res) => {
            UIUtil.hideLoading();
            Modal.alert("提示","申请提现成功");
            this.props.history.push("/")
        }).catch( err => {
            UIUtil.hideLoading();
            const message = (err as Error).message;
            Toast.fail(message);
        })
    }
    public render() {
        return (
            <div className="fans-container presentation">
                <NavBar  icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">提现</div>
                </NavBar>
                <div>
                    <div>
                        <div className="fans-top-bg"></div>
                        <div className="fans-top-content">
                            <div className="fans-left-section">
                                <div className="fans-section-text">可提现金额</div>
                                <div className="fans-section-num">{this.state.type == 1?this.state.quotaConsumable:this.state.quotaConsumable2 }</div>
                            </div>
                            <div className="fans-middel-line"></div>
                            <div className="fans-right-section">
                                <div className="fans-section-text">已提现总额</div>
                                <div className="fans-section-num">{this.state.type == 1?this.state.quotaUsed:this.state.quotaUsed2 }</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="margin-tl">
                    <List renderHeader={() => '提现人'}>
                        <InputItem placeholder="请输入姓名" type="text" onChange={this.onNameBlur} ></InputItem>
                        <InputItem placeholder="请输入身份证" type="number" onChange={this.onCardIDBlur} ></InputItem>
                    </List>
                    <List renderHeader={() => '提现数量'}>
                        
                        <InputItem placeholder={"最少可提现："+this.state.assets_min+"，最多可提现："+this.state.assets_max} type="number" onChange={this.onNumberBlur} ></InputItem>
                    </List>
                </div>
                <div className="padding c999 fs12">手续费：{this.state.rate}</div>
                <div className="address-footer-button-container question_btn padding-t">
                    <Button type="primary" onClick={this.confirm}>提现</Button>
                </div>
                {
                    this.state.logList.map((data:any)=>(
                        <div className="padding fs14">
                            <span className="margin-r">{data.create_time}</span>
                            <span className="margin-r">{data.orderid}</span>
                            <span className="margin-r cred fs16">¥{data.number}</span>
                        </div>
                    ))
                }
            </div>
        )
    }
}