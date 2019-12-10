import * as React from "react";
import { NavBar, Icon, Button, Modal, } from "antd-mobile";
// import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from "src/utils/UIUtil";
import { UserService } from '../../service/UserService';
import { Util } from "src/utils/Util";

interface CouponGetProps {
  history: History;
  location: Location;
}

interface CouponGetState {
  redirectToLogin: boolean;
  orderid: string;
  cardid: string;
  brand_name: string;
  start_time: string;
  end_time: string;
  reduce: string;
  least: string;
  description: string;
  isgetcoupon:boolean;
  isCan: boolean;
  type:string;
  goods_id:string;
}

const bodyHeight = window.innerHeight / 100 - 0.45 + "rem";

export class CouponGet extends React.Component<CouponGetProps,CouponGetState> {
  lv: any;
  data: any;
  push: string;
  constructor(props: CouponGetProps) {
    super(props);
    this.state = {
        redirectToLogin: false,
        orderid:'',
        cardid: '',
        brand_name: '',
        start_time: '',
        end_time: '',
        reduce: '',
        least: '',
        description: '',
        isgetcoupon:false,
        isCan:true,
        type:'',
        goods_id:''
    };
  }
  componentDidMount() {
    if(!this.props.location.state){
        this.props.history.goBack();
        return
    }
    let typepage = this.props.location.state.page;
    let data = this.props.location.state.data;
    data = JSON.parse(data);
    this.data = JSON.stringify(data.cash);
    UIUtil.share();
    this.setState({
        orderid:data.orderid,
        cardid: data.id,
        type:data.cash.type,
        brand_name: data.cash.brand_name,
        start_time: Util.formatDate(data.cash.start_time*1000,6),
        end_time: data.cash.is_forever==1?Util.formatDate('2100-01-01'):Util.formatDate(data.cash.end_time*1000),
        reduce: data.cash.reduce,
        least: data.cash.least,
        description: data.cash.description,
        isCan:Util.isCan(data.cash.start_time),
    })
    if(typepage == '1'){
      this.setState({
        isgetcoupon:true
      })
      return
    }
  }
  onRedirectBack = () => {
    this.props.history.goBack();
  };

  getCoupon = () => {
    UIUtil.showLoading('领取中');
    UserService.Instance.add_coupon(this.state.cardid).then( (res:any) => {
        UIUtil.hideLoading()
        Modal.alert('提示',"领取成功")
        this.setState({
          isgetcoupon:true
        })
    }).catch( (err: Error) => {
        UIUtil.hideLoading()
        UIUtil.showError(err)
    })
  };
  
  goPage = () => {
    window.localStorage.setItem('coupon',this.data)
    if (this.state.type == "2") {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{},couponid:this.state.orderid}})
    } else if (this.state.goods_id != null) {
      this.props.history.push({pathname:'/goodsDetails', state: { id: this.state.goods_id,couponid:this.state.orderid } })
    } else if (this.state.type == "5") {
      this.props.history.push({pathname:'/goodsLimitedList',state:{val:{},couponid:this.state.orderid}})
    } else {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{},couponid:this.state.orderid}})
    }
  }
  public render() {
    return (
        <div className="coupon_container">
            <NavBar
            icon={<Icon type="left" />}
            onLeftClick={this.onRedirectBack}
            className="home-navbar"
            >
            <div className="nav-title">领取优惠券</div>
            </NavBar>
            <div style={{ height: bodyHeight, backgroundColor: "#ffffff" }}>
                <div className="padding_trl">
                  <div className="coupon_get_top tac cfff coupon_bg pr">
                      <div className="fs10 pa padding05"><span>No.</span><span>{this.state.orderid}</span></div>
                      <div className="fs24 padding-ts">{this.state.brand_name}</div>
                      <div className="fs14 ceee padding-t">{this.state.end_time} 前有效</div>
                      <div className="fs20 padding-ts">¥<span className="padding-l1 fs50 fb">{this.state.reduce}</span></div>
                      <div className="fs17 ceee padding-ts">订单满{this.state.least}元起</div>
                  </div>
                  <div className="question_btn">
                      <Button className={this.state.isgetcoupon?'none':''} type="primary" data-cardid={this.state.cardid} onClick={this.getCoupon}>立即领取</Button>
                      {
                        this.state.isCan?
                        <Button type="primary" className={this.state.isgetcoupon?'':'none'} data-cardid={this.state.cardid} onClick={this.goPage}>立即使用</Button>
                        :<Button type="primary" disabled className={this.state.isgetcoupon?'':'none'} data-cardid={this.state.cardid}>立即使用</Button>
                      }
                      {/* <Button className={this.state.isgetcoupon?'':'none'} type="primary" data-cardid={this.state.cardid} onClick={()=>{this.props.history.push({pathname:'/searchcoupon',state:{val:{}}})}}>立即使用</Button> */}
                  </div>
                </div>
                <div className="padding top_list bt92 fs16">
                    <div className="padding-b c999">使用说明</div>
                    <div className="c666">{this.state.description}</div>
                </div>
                <div className="padding top_list fs16">
                    <div className="padding-b c999">开始时间</div>
                    <div className="c666">{this.state.start_time}</div>
                </div>
                <div className="padding top_list fs16">
                    <div className="padding-b c999">结束时间</div>
                    <div className="c666">{this.state.end_time}</div>
                </div>
            </div>
        </div>
    );
  }
}
