import * as React from 'react';

import { NavBar, Icon, List, InputItem, Button, WhiteSpace, Toast, Modal, Switch, Picker} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
// import { UserStorage } from "../../storage/UserStorage";
// import { UIUtil } from '../../utils/UIUtil';

interface modifyAddressProps {
    history: History,
    location: Location
}

interface modifyAddressState {
    redirectToReferrer: boolean,
    code:string,
    codeCountDown:number,
    isdefault:string,
    checked:boolean,
    id:string,
    data:any,
    address:any,
    province:any,
    provinceValue:any
}

export class modifyAddress extends React.Component<modifyAddressProps, modifyAddressState> {
    name:string
    area: string
    province:string
    city:string
    county:string
    address: string
    mobile:string
    isdefault:string
    constructor(props: modifyAddressProps) {
        super(props)
        this.isdefault='2'
        this.state = {
            redirectToReferrer: false,
            code:'',
            codeCountDown:0,
            isdefault:'2',
            checked:false,
            id:'',
            data:'',
            address:[],
            province:[],
            provinceValue:[],
        }
    }
    public componentDidMount (){
        if(!this.props.location.state){
            this.props.history.goBack();
            return
        }
        let id = this.props.location.state.id;
        let data = this.props.location.state.data;
        let ary:any = [data.province,data.city,data.county]
        this.setState({
            provinceValue:ary,
            checked:data.default == 1?true:false,
            data:data,
            id:id
        })
        this.name = data.name;
        this.province = data.province;
        this.city = data.city;
        this.county = data.county;
        this.address = data.address;
        this.mobile = data.mobile;
        this.getnation();
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
        UserService.Instance.update_address(this.state.id,this.name,this.mobile, this.province,this.city,this.county, this.address,this.isdefault).then( (res:any) => {
            const alert = Modal.alert
            alert('提示','修改成功')
            this.props.history.goBack();
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }
    onDel = () => {
        UserService.Instance.delete_address(this.state.id).then( (res:any) => {
            const alert = Modal.alert
            alert('提示','删除成功')
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
                        <div className="nav-title">修改地址</div>
                </NavBar>
                <List renderHeader={() => ''} className="content-item-border">
                    <InputItem type="text" value={this.state.data.name} onChange={this.onNameBlur}></InputItem>
                    <InputItem type="number" maxLength={11} value={this.state.data.mobile} onChange={this.onMobileBlur}></InputItem>
                    <Picker data={this.state.address} value={this.state.provinceValue} onChange={this.getprovince} >
                        <List.Item arrow="horizontal">地区：</List.Item>
                    </Picker>
                    <InputItem type="text" value={this.state.data.address}  onChange={this.onAddressBlur}></InputItem>
                </List>
                <List>
                    <List.Item extra={<Switch checked={this.state.checked} onChange={this.onDefaults} />}>设置默认地址</List.Item>
                </List>
                <WhiteSpace size="lg" />
                <WhiteSpace size="lg" />
                <div className={"address-footer-button-container question_btn padding-t"}>
                    <Button type="primary" onClick={this.onSubmit}>保存</Button>
                    <WhiteSpace size="md" />
                    <Button type="ghost" onClick={this.onDel}>删除</Button>
                </div>
            </div>
        )
    }
}