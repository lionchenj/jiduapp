import * as React from "react";
import { NavBar, Icon, List, Toast, Stepper} from "antd-mobile";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "src/service/UserService";
import order0 from "../../assets/appimg/order0.png";
import order1 from "../../assets/appimg/order1.png";
interface orderGroupconfirmProps {
  history: History;
  location: Location;
}

interface orderGroupconfirmState {
    address:any;
    img_url:string;
    goodsid:string;
    goodsname:string;
    goodssize:string;
    goodssizeid:string;
    numValue:number;
    price:any;
    datas:any;
    isCart:boolean;
    province:string;
    city:string;
    county:string;
    name:string;
    is_limit:string;
    couponid:string;
    coupon:any;
    reduce:number;
    useCoupon:boolean;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class orderGroupconfirm extends React.Component< orderGroupconfirmProps, orderGroupconfirmState> {
  constructor(props: orderGroupconfirmProps) {
    super(props);
    this.state = {
        address:[],
        img_url:'',
        goodsid:'',
        goodsname:'',
        goodssize:'',
        goodssizeid:'',
        numValue:0,
        price:0,
        datas:[],
        isCart:false,
        province:'',
        city:'',
        county:'',
        name:'',
        is_limit:'',
        couponid:'',
        coupon:'',
        reduce:0,
        useCoupon:false
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
    if(this.props.location.state.data){
        this.setState({
            isCart:true,
            datas:this.props.location.state.data,
            numValue:this.props.location.state.numValue,
            price:this.props.location.state.price
        })
    }else{
        if(this.props.location.state.couponid){
            let coupon:any = '';
            coupon = JSON.parse(window.localStorage.getItem('coupon')||'');
            this.setState({
                couponid:this.props.location.state.couponid,
                coupon:coupon,
            })
            if(this.props.location.state.numValue*this.props.location.state.price>coupon.least){
                this.setState({    
                    reduce:coupon.reduce,
                    useCoupon:true
                })
            }
        }
        this.setState({
            goodsid:this.props.location.state.goodsid,
            img_url:this.props.location.state.img_url,
            goodsname:this.props.location.state.goodsname,
            goodssize:this.props.location.state.goodssize,
            goodssizeid:this.props.location.state.goodssizeid,
            numValue:this.props.location.state.numValue,
            price:this.props.location.state.price,
        })
    }
  }

  onRedirectBack = () => {
        this.props.history.push({pathname:'/goodsGroupDetails',state:{id:this.state.goodsid,couponid:this.state.couponid}})
  };
  stepperValue = (v:any) => {
    this.setState({
      numValue:v
    })
    if(this.state.coupon!=''&&v*this.state.price>this.state.coupon.least){
        this.setState({
            reduce:this.state.reduce,
            useCoupon:true
        })
    }else{
        this.setState({
            reduce:0,
            useCoupon:false
        })
    }
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
            return;
        }
    }).catch( err => {
        const message = (err as Error).message
        Toast.fail(message)
    })
  }
//确认下单购买
buy = () => {
    let params = {
        goods_id: this.state.goodsid,
        goods_sku_id: this.state.goodssizeid,
        num: this.state.numValue,
        money: this.state.price*this.state.numValue,
        province: this.state.address.province,
        city: this.state.address.city,
        county: this.state.address.county,
        address: this.state.address.address,
        name: this.state.address.name,
        mobile: this.state.address.mobile,
        is_limit: '0',
        cardlistid:''
    }
    // UserService.Instance.user_group_order(params).then( (res:any) => {
    //     console.log(res)
        let orderData = this.state.datas;
        orderData['goodsid'] = this.props.location.state.goodsid;
        orderData['img_url'] = this.props.location.state.img_url;
        orderData['goodsname'] = this.props.location.state.goodsname;
        orderData['numValue'] = this.props.location.state.numValue;
        orderData['price'] = this.props.location.state.price;
    // //     this.props.history.push({pathname:"/goodsGroupShare",state:{data:orderData}});
    //     UserService.Instance.user_group(res.orderid).then((data: any) => {
    //         // alert(JSON.stringify(res))
    //         console.log(data)
    //     // UIUtil.hideLoading();
    //     }).catch( err => {
    //         const message = (err as Error).message
    //         Toast.fail(message)
    //     })
    // });
    UIUtil.groupPay(this,params,orderData);

  }
  //选择地址
goadd = () => {
    this.props.history.push({pathname:'/addressGet',state:{
        type:0,
        goodsid:this.state.goodsid,
        img_url:this.state.img_url,
        goodsname:this.state.goodsname,
        goodssize:this.state.goodssize,
        goodssizeid:this.state.goodssizeid,
        numValue:this.state.numValue,
        price:this.state.price,
        couponid:this.state.couponid,
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
                <List >
                    <List.Item onClick={this.goadd} arrow="horizontal" thumb={order0} className='ddress-footer-button-container' extra={this.state.address.mobile}>
                        {this.state.address.name}<List.Item.Brief>{this.state.address.province+this.state.address.city+this.state.address.county+this.state.address.address} </List.Item.Brief>
                    </List.Item>
                </List>
                <div className="order_box">
                    <List>
                        <List.Item thumb={order1}>暨妒商城</List.Item>
                    </List>
                    <div className="index_goods bff padding borcccb" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:this.state.goodsid}})}}>
                        <div className="flex">
                        <div className="tac goods_list"><img src={this.state.img_url} alt=""/></div>
                        <div className="padding-l2 w100">
                            <div className="fs18 fb">{this.state.goodsname}</div>
                            <div className="fs12 c999 margin-tl ">{this.state.goodssize}</div>
                            <div className="flex flex-j-sb margin-tsm">
                            <div className="fs12 c999">X{this.state.numValue}</div>
                            </div>
                            <div className="flex flex-j-sb margin-tsm">
                            <div className="fs14 fb cce0">¥<span className="fs22">{this.state.price}</span></div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <List>
                        <List.Item extra={<Stepper min={0} showNumber={true} value={this.state.numValue} onChange={this.stepperValue}/>}>购买数量：</List.Item>
                        <List.Item extra="免邮">配送：普通快递</List.Item>
                        <List.Item className={this.state.coupon!=''?'':'none'} extra={this.state.useCoupon?'使用优惠券减'+this.state.reduce+'元':'未满足优惠券使用条件'}>优惠券</List.Item>
                    </List>
                </div>
                <div className="foot_cart">
                  <div className="cart_pay bff flex flex-j-sb">
                    <div className="padding-l05">
                        <div className="">共{this.state.numValue}件 小计：<span className="cred">¥{(this.state.price)*this.state.numValue-this.state.reduce}</span></div>
                    </div>
                    <div className="showpay" onClick={this.buy}>确认订单</div>
                  </div>
                </div>
            </div>
        </div>
    )
}
}