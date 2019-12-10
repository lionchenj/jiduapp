import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal, Switch, Picker} from "antd-mobile";
import { History, Location } from "history";

import { UserService } from '../../service/UserService';
// import { UserStorage } from "../../storage/UserStorage";
// import { UIUtil } from '../../utils/UIUtil';

interface addAddressProps {
    history: History,
    location: Location
}

interface addAddressState {
    redirectToReferrer: boolean,
    code:string,
    codeCountDown:number,
    isdefault:string,
    checked:boolean,
    address:any,
    province:any,
    provinceValue:any
}

export class addAddress extends React.Component<addAddressProps, addAddressState> {
    name:string
    area: string
    province:string
    city:string
    county:string
    address: string
    mobile:string
    isdefault:string
    constructor(props: addAddressProps) {
        super(props)
        // this.pages = "/bankCard";
        this.isdefault = '2'
        this.state = {
            redirectToReferrer: false,
            code:'',
            codeCountDown:0,
            isdefault:'2',
            checked:false,
            address:[],
            province:[],
            provinceValue:[],
        }
    }
    public componentDidMount (){
        this.getnation()
    }
    getnation = () => {
        UserService.Instance.nation_address().then( (res:any) => {
            res.data.map((data:any)=>{
                data['value'] = data.label;
                data.children.map((res:any)=>{
                    res['value'] = res.label;
                    let list:any = []
                    res.children.map((x:any)=>{
                        list.push({'label':x,'value':x})
                    })
                    res.children = list
                })
            })
            console.log(JSON.stringify(res.data))
            this.setState({
                address:res.data
            })
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }
    //三级
    getprovince = (val:any) => {
        this.setState({
            provinceValue:val,
        })
        this.province = val[0];
        this.city = val[1];
        this.county = val[2];
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack();
    }
    onNameBlur = (value: string) => {
        this.name = value
    }
    onMobileBlur = (value: string) => {
        this.mobile = value
    }
    onAddressBlur = (value: string) => {
        this.address = value
    }
    onDefaults = (checked:any) => { 
        this.isdefault = checked?'1':'2'
        this.setState({ 
            checked: checked, 
        }); 
    }
    onSubmit = () => {
        if (!this.name) {
            Toast.info("请输入收货人姓名")
            return
        } 
        if (!this.mobile) {
            Toast.info("手机号码")
            return
        } 
        if (!this.province) {
            Toast.info("请输入省份")
            return
        }
        if (!this.city) {
            Toast.info("请输入城市")
            return
        }
        if (!this.county) {
            Toast.info("请输入地区")
            return
        }
        if (!this.address) {
            Toast.info("请输入详细地址")
            return
        }
        UserService.Instance.address(this.name,this.mobile, this.province,this.city,this.county, this.address,this.isdefault).then( (res:any) => {
            const alert = Modal.alert
            alert('提示','新增成功')
            this.props.history.goBack();
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
        
    }

    public render() {
        return (
            <div className="addadd">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">新增地址</div>
                </NavBar>
                <List renderHeader={() => ''} className="content-item-border">
                    <InputItem type="text" placeholder="请输入收件人姓名" onChange={this.onNameBlur}></InputItem>
                    <InputItem type="number" maxLength={11} placeholder="请输入手机号码" onChange={this.onMobileBlur}></InputItem>
                    <Picker data={this.state.address} value={this.state.provinceValue} onChange={this.getprovince} >
                        <List.Item arrow="horizontal">地区：</List.Item>
                    </Picker>
                    <InputItem type="text" placeholder="请输入详细地址" onChange={this.onAddressBlur}></InputItem>
                </List>
                <List>
                    <List.Item extra={<Switch checked={this.state.checked} onChange={this.onDefaults} />}>设置默认地址</List.Item>
                </List>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className={"address-footer-button-container question_btn padding-t"}>
                    <Button type="primary" onClick={this.onSubmit}>保存</Button>
                </div>
            </div>
        )
    }
}