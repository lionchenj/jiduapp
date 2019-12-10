import * as React from "react";
import { NavBar, Icon, List, Toast, Modal, WingBlank} from "antd-mobile";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "src/service/UserService";
import order0 from "../../assets/appimg/order0.png";
import order1 from "../../assets/appimg/order1.png";
import logistic from "../../assets/appimg/logistic.png";
import { Util } from "src/utils/Util";
interface orderdetailsProps {
  history: History;
  location: Location;
}

interface orderdetailsState {
    address:any;
    orderid:string;
    datas:any;
    goods:any;
    wuliu:string;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class orderdetails extends React.Component< orderdetailsProps, orderdetailsState> {
  constructor(props: orderdetailsProps) {
    super(props);
    this.state = {
        address:[],
        orderid:'',
        datas:{sonlist:[]},
        goods:[],
        wuliu:''
    };
  }
  componentDidMount() {
    if(!this.props.location.state){
      this.props.history.push({pathname:"/order",state:{type:0}})
        return;
    }
    this.getadd();
    let data;
    data = this.props.location.state.data
    data = JSON.parse(data);
    if(!data.carddata){
      this.setState({
        goods:data.param.goods
      })
    }
    if(data.status != 1 ||data.status!=6){
      this.get_logistic(data.id);
    }
    this.setState({
      datas:data,
    })
  }

  onRedirectBack = () => {
    this.props.history.push({pathname:"/order",state:{type:0}})
  };
  getadd = () => {
    UIUtil.showLoading('链接中...');
    UserService.Instance.my_address().then( (res:any) => {
        UIUtil.hideLoading();
        res.data.map((data:any)=>{
            if(data.default == '1')
            window.localStorage.setItem('add',JSON.stringify(data))
            this.setState({
                address:data
            })
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
  UIUtil.goPay(this,this.state.orderid);
}
get_logistic = (id:string) => {
    UserService.Instance.get_logistic(id).then((res:any) => {
      let wuliu = res.data.traces.state == 0?'无轨迹':
      res.data.traces.state == 1?'已揽收': 
      res.data.traces.state == 2?'在途中':
      res.data.traces.state == 201?'到达派件城市':
      res.data.traces.state == 3?'签收':
      res.data.traces.state == 4?'问题件':'未有物流信息'
      this.setState({
        wuliu
      })
    UIUtil.hideLoading()
    }).catch(err => {
      this.setState({
        wuliu:'未有物流信息'
      })
      UIUtil.hideLoading()  
    });
}
goLoginstic = (e:any) => {
  if(e.currentTarget.dataset.status == 2)return;
  this.props.history.push({pathname:'/logistics',state:{data:JSON.stringify(this.state.datas)}})
}
//退货催货
cancel_refund = (e:any) => {
  let id = e.currentTarget.dataset.id;    
  let type = e.currentTarget.dataset.type;    
  UIUtil.showLoading('处理中...');
    UserService.Instance.cancel_refund(id,type).then((res:any) => {
      Modal.alert('提示','处理成功');
      this.props.history.goBack();
      UIUtil.hideLoading()
    }).catch(err => {
      UIUtil.hideLoading()  
    });
}
cancel_order = (e:any) => {
  UIUtil.showLoading('处理中...');
  let id = e.currentTarget.dataset.id;    
    UserService.Instance.get_logistic(id).then((res:any) => {
      Modal.alert('提示','取消订单成功');
      this.props.history.goBack();
    UIUtil.hideLoading()
    }).catch(err => {
      UIUtil.hideLoading()  
    });
}
  public render() {
    return (
        <div className="message-container">
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.onRedirectBack}
              className="home-navbar" >
              <div className="nav-title">订单详情</div>
            </NavBar>
            <WingBlank>
            <div className="os padding-txl" style={{height: bodyHeight }}>
                <List className={"margin-t " + (this.state.datas.status != 1 ||this.state.datas.status!=6?'':'none')}>
                    <List.Item thumb={logistic} className='ddress-footer-button-container' arrow="horizontal" data-status={this.state.datas.status} onClick={this.goLoginstic}>
                        {this.state.datas.status == 2?'卖家未发货':this.state.datas.status ==3?'卖家已发货':''}
                        <List.Item.Brief>{this.state.wuliu} </List.Item.Brief>
                    </List.Item>
                </List>
                <List className="margin-t">
                    <List.Item thumb={order0} className='ddress-footer-button-container' extra={this.state.address.mobile}>
                        {this.state.address.name}<List.Item.Brief>{this.state.address.province+this.state.address.city+this.state.address.county+this.state.address.address} </List.Item.Brief>
                    </List.Item>
                </List>
                <div className="order_box margin-t">
                    <List>
                        <List.Item thumb={order1}>暨妒商城</List.Item>
                    </List>
                    <div className="index_goods bff padding" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:this.state.goods.goodsid}})}}>
                      {
                        this.state.datas.sonlist.length!=0?
                        this.state.datas.sonlist.map((data:any)=>(
                          <div className="flex">
                            <div className="tac goods_list"><img src={data.param.goods.img_url} alt=""/></div>
                            <div className="padding-l2 w100">
                                <div className="fs14 fb">{data.param.goods.goodsname}<div className="tar">¥{data.money}</div></div>
                                <div className="flex flex-j-sb margin-tsm">
                                  <div className="fs12 c999 margin-tsm ">{data.param.goods.description}</div>
                                  <div className="fs12 c999">X{data.goodsNum}</div>
                                </div>
                            </div>
                          </div>
                        ))
                        :
                        <div className="flex">
                          <div className="tac goods_list"><img src={this.state.goods.img_url} alt=""/></div>
                          <div className="padding-l2 w100">
                              <div className="fs14 fb">{this.state.goods.goodsname}<div className="tar">¥{this.state.goods.price}</div></div>
                              <div className="flex flex-j-sb margin-tsm">
                                <div className="fs12 c999 margin-tsm ">{this.state.goods.description}</div>
                                <div className="fs12 c999">X{this.state.datas.goodsNum}</div>
                              </div>
                          </div>
                        </div>
                      }
                      <div className="w100 margin-tsm">
                          <div className="w100 fs12">运费<span className="fr">免邮</span></div>
                          <div className="w100 fs16 margin-tsm">实付款（含运费）<span className="fr cred">{'¥'+this.state.datas.money}</span></div>
                      </div>
                    </div>
                </div>
                <div className={"bff padding " + ((this.state.datas.status == 8||this.state.datas.status == 4||this.state.datas.status == 9)?'':'padding-b70')}>
                  <div className="fs14 padding105 "><span className="cred margin-rsm">|</span>订单信息</div>
                  {/* <div className="fs12 c999 padding05"><span className="w30">订单备注：</span></div> */}
                  <div className="fs12 c999 padding05"><span className="w30">订单编号：</span>{this.state.datas.orderid}</div>
                  <div className="fs12 c999 padding05"><span className="w30">创建时间：</span>{this.state.datas.create_time}</div>
                  <div className="fs12 c999 padding05"><span className="w30">付款时间：</span>{Util.formatDate(this.state.datas.update_time||0)}</div>
                  <div className="fs12 c999 padding05"><span className="w30">发货时间：</span>{this.state.datas.update_time}</div>
                </div>
                <div className={"tar bff padding foot_details "+((this.state.datas.status == 8||this.state.datas.status == 4||this.state.datas.status == 9)?'none':'')}>
                    <div className={"flex flex-j-end margin-tsm "+(this.state.datas.status == 1?'':'none')}>
                        <div className="button-sm button-bcn margin-r" data-id={this.state.datas.id} onClick={this.cancel_order}>取消订单</div>
                        <div className="button-sm bf99" data-id={this.state.datas.id} onClick={this.buy}>立即付款</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(this.state.datas.status == 2?'':'none')}>
                        <div className="button-sm button-bcn margin-r" data-id={this.state.datas.id} data-type='3' onClick={this.cancel_refund}>提醒发货</div>
                        <div className="button-sm button-bcn" data-id={this.state.datas.id} data-type='1' onClick={this.cancel_refund}>退货</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(this.state.datas.status == 3?'':'none')}>
                        <div className="button-sm button-bcn margin-r" data-id={this.state.datas.id} data-type='1' onClick={this.cancel_refund}>退货</div>
                        <div className="button-sm bf99" data-id={this.state.datas.id} data-type='4' onClick={this.cancel_refund}>确认收货</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(this.state.datas.status == 6?'':'none')}>
                        <div className="button-sm button-bcn" onClick={()=>{this.props.history.push({pathname:'/goodsevaluate',state:{id:this.state.datas.id}})}}>评价</div>
                    </div>
                </div>
            </div>
            </WingBlank>
        </div>
    )
  }
}