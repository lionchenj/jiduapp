import * as React from "react";
import { NavBar, Icon, List, Toast} from "antd-mobile";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "src/service/UserService";
import order0 from "../../assets/appimg/order0.png";
import order1 from "../../assets/appimg/order1.png";
interface ordercartconfirmProps {
    history: History;
    location: Location;
}

interface ordercartconfirmState {
    address:any;
    goodssize:string;
    goodssizeid:string;
    goodsnum:string;
    numValue:number;
    freight:number;
    price:any;
    datas:any;
    goodsList:any;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class ordercartconfirm extends React.Component< ordercartconfirmProps, ordercartconfirmState> {
constructor(props: ordercartconfirmProps) {
    super(props);
    this.state = {
        address:[],
        goodssize:'',
        goodssizeid:'',
        goodsnum:'',
        numValue:0,
        freight:0,
        price:0,
        datas:[],
        goodsList:'',
    };
}
componentDidMount() {
    if(!this.props.location.state){
        this.props.history.push('/')
        return;
    }
    if(this.props.location.state.add){
        this.setState({
            address:this.props.location.state.add
        })
    }else{
        this.getadd();
    }
    this.setState({
        datas:this.props.location.state.data,
        goodssizeid:this.props.location.state.goodssizeid,
        goodsnum:this.props.location.state.goodsnum,
        numValue:this.props.location.state.numValue,
        price:this.props.location.state.price,
        freight:this.props.location.state.data[0].param.goods.freight,
    })
}
onRedirectBack = () => {
    this.props.history.push('/');
};
stepperValue = (v:any) => {
    this.setState({
    numValue:v
    })
}
getadd = () => {
    UIUtil.showLoading('链接中...');
    UserService.Instance.my_address().then( (res:any) => {
        UIUtil.hideLoading();
        res.data.map((data:any)=>{
            if(data.default == '1'){
                this.setState({
                    address:data
                })
            }
        })
        if(res.data.length == 0){
            UIUtil.showInfo("请添加地址");
            this.goadd();
            return;
        }
    }).catch( err => {
        const message = (err as Error).message
        Toast.fail(message)
    })
}

buycart = () => {
    UserService.Instance.user_order_car(this.state.goodssizeid,this.state.goodsnum,this.state.address.province,this.state.address.city,this.state.address.county,this.state.address.address,this.state.address.name,this.state.address.mobile).then( (res:any) => {
        UIUtil.goPay(this,res.data.id);
    }).catch( err => {
        UIUtil.hideLoading()
        UIUtil.showError(err)
        this.props.history.push({pathname:"/order",state:{type:1}});
    })
}
//选择地址
goadd = () => {
    this.props.history.push({pathname:'/addressGet',state:{
        type:2,
        datas:this.state.datas,
        goodssizeid:this.state.goodssizeid,
        goodsnum:this.state.goodsnum,
        numValue:this.state.numValue,
        price:this.state.price,
    }})
}
public render() {
    return (
        <div className="message-container">
            <NavBar icon={<Icon type="left" />}
                onLeftClick={this.onRedirectBack}
                className="home-navbar" >
                <div className="nav-title">确认订单</div>
            </NavBar>
            <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                <List>
                    <List.Item onClick={this.goadd} arrow="horizontal" thumb={order0} className='ddress-footer-button-container' extra={this.state.address.mobile}>
                        {this.state.address.name}<List.Item.Brief>{this.state.address.province+this.state.address.city+this.state.address.county+this.state.address.address} </List.Item.Brief>
                    </List.Item>
                </List>
                <div className="order_box padding-b50">
                    <List>
                        <List.Item thumb={order1}>暨妒商城</List.Item>
                    </List>
                    <List>
                    {
                        this.state.datas.map((data:any)=>(
                            
                            <div className="index_goods bff padding borcccb" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.param.goods.goodsid}})}}>
                                <div className="flex">
                                <div className="tac goods_list"><img src={data.param.goods.img_url} alt=""/></div>
                                <div className="padding-l2 w100">
                                    <div className="fs18 fb">{data.param.goods.goodsname}</div>
                                    <div className="fs12 c999 margin-tl ">{data.goodssize}</div>
                                    <div className="flex flex-j-sb margin-tsm">
                                    <div className="fs12 c999">X{data.num}</div>
                                    </div>
                                    <div className="flex flex-j-sb margin-tsm">
                                    <div className="fs14 fb cce0">¥<span className="fs22">{data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price}</span></div>
                                    </div>
                                </div>
                                </div>
                            </div>
                        ))
                    }
                    </List>
                    <List>
                        <List.Item extra={this.state.numValue}>购买数量：</List.Item>
                        <List.Item extra={this.state.freight == 0?"免运费":this.state.freight}>配送：普通快递</List.Item>
                    </List>
                </div>
                <div className="foot_cart_pay">
                    <div className="cart_pay bff flex flex-j-sb">
                        <div className="padding-l05">
                            <div className="">共{this.state.numValue}件 小计：<span className="cred">¥{this.state.price*1 + this.state.freight*1}</span></div>
                        </div>
                        <div className="showpay" onClick={this.buycart}>确认订单</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
}