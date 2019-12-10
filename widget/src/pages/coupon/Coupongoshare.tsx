import * as React from "react";
import { NavBar, Icon, Button, } from "antd-mobile";
// import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from "src/utils/UIUtil";
// import { UserService } from '../../service/UserService';
import { Util } from "src/utils/Util";
import { UserService } from "src/service/UserService";

interface CoupongoshareProps {
  history: History;
  location: Location;
}

interface CoupongoshareState {
  redirectToLogin: boolean;
  brand_name: string;
  start_time: string;
  end_time: string;
  reduce: string;
  least: string;
  description: string;
  orderid:string;
  isCan: boolean;
  type: string;
  goods_id:string;
}

const bodyHeight = window.innerHeight / 100 - 0.45 + "rem";

export class Coupongoshare extends React.Component<CoupongoshareProps,CoupongoshareState> {
  lv: any;
  data: any;
  push: string;
  constructor(props: CoupongoshareProps) {
    super(props);
    this.state = {
        redirectToLogin: false,
        brand_name: '',
        start_time: '',
        end_time: '',
        reduce: '',
        least: '',
        description: '',
        orderid:'',
        isCan:true,
        type:'',
        goods_id:''
    };
  }
  onRedirectBack = () => {
    this.props.history.push('/');
  };
  componentDidMount() {
    //微信浏览器
    var url = location.hash; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("?");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
    }
    this.getcouponinfo(theRequest["orderid"]);
  }
  getcouponinfo = (orderid:string) => {
    UIUtil.showLoading('领取中');
    UserService.Instance.add_share_coupon(orderid).then( (res:any) => {
      UserService.Instance.add_share_detail(orderid).then((res:any) => {
        UIUtil.hideLoading()
        this.setState({
          orderid:res.data.orderid,
          type:res.data.type,
          goods_id:res.data.goods_id,
          brand_name: res.data.brand_name,
          start_time: Util.formatDate(res.data.start_time*1000),
          end_time: res.data.is_forever==1?Util.formatDate('2100-01-01'):Util.formatDate(res.data.end_time*1000),
          reduce: res.data.reduce,
          least: res.data.least,
          description: res.data.description,
          isCan:Util.isCan(res.data.start_time)
        })
      }).catch(err => {
        UIUtil.hideLoading()
        UIUtil.showError(err)
      });
  }).catch( (err: Error) => {
        UIUtil.hideLoading()
        UIUtil.showError(err)
  })
    
  }
  goPage = () => {
    if (this.state.type == "2") {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{}}})
    } else if (this.state.goods_id != null) {
      this.props.history.push({pathname:'/goodsDetails', state: { id: this.state.goods_id,orderid:this.state.orderid } })
    } else if (this.state.type == "5") {
      this.props.history.push({pathname:'/goodsLimitedList',state:{val:{}}})
    } else {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{}}})
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
                        {
                          this.state.isCan
                          ?<Button type="primary" onClick={this.goPage}>立即使用</Button>
                          :<Button type="primary" disabled>立即使用</Button>
                        }
                        {/* <Button type="primary" onClick={()=>{this.props.history.push({pathname:'/searchcoupon',state:{val:{}}})}}>立即使用</Button> */}
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
