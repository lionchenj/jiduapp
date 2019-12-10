import * as React from "react";
import { NavBar, Icon, ListView, Tabs, Modal} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "../../service/UserService";
import defaults from "../../assets/default.png";
interface orderProps {
  history: History;
  location: Location;
}

interface orderState {
  redirectToLogin: boolean;
  dataSource:any;
  tabs: any;
  isLoading: boolean;
  initialPage:number;
}
const bodyHeight = (window.innerHeight/100 - 0.95) + 'rem';
export class order extends React.Component< orderProps, orderState> {
  rData: any;
  lv: any;

  constructor(props: orderProps) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    });
    this.state = {
      dataSource,
      redirectToLogin: false,
      isLoading: false,
      tabs: [
        { title: '全部' },
        { title: '待付款' ,type:1 },
        { title: '待发货' ,type:2 },
        { title: '待收货' ,type:3},
        { title: '评价',type:6 },
      ],
      initialPage:1
    };
  }
  componentDidMount() {
    let type;
    if(this.props.location.state){
      type = this.props.location.state.type;
    }else{
      type = ''
    }
    this.getlist(type);
    this.setState({
        initialPage:type==6?4:type,
    })
  }

  onRedirectBack = () => {
    this.setState({
      ...this.state,
      redirectToLogin: true
    });
  };
  getlist = (type?:number) => {
    UIUtil.showLoading('链接中...');
      UserService.Instance.my_order(type).then((res:any) => {
        let sonid:any = '';
          res.data.map((data:any)=>{
              if(!data.sonlist){
                sonid = sonid+','+data.orderid_total;
                data['sonlist'] = [];
              }else{
                let ttnum = 0,goodssizeid:any=[],goodsnum:any=[];
                data.sonlist.map((x:any)=>{
                  ttnum = ttnum + x.goodsNum;
                  goodsnum.push(x.goodsNum);
                  goodssizeid.push(x.goodsid);
                })
                data['goodssizeid'] = goodssizeid.join();
                data['goodsnum'] = goodsnum.join();
                data['money'] = data.sumPrice;
                data['totalnum'] = ttnum;
                data['carddata'] = 1;
                data['status'] = data.sonlist[0].status;
                data['orderid'] = data.corderid;
                data['param'] = data.sonlist[0].param;
              }
          })
          this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res.data),
          })
      UIUtil.hideLoading()
      }).catch(err => {
        UIUtil.hideLoading()  
      });
  }
  //普通订单支付
  ordercartpay = (e:any) =>{
    let cartids = e.currentTarget.dataset.id;
    UIUtil.goorderPay(this,cartids);
  }
  //购物车订单支付
  buycart = (data:any) => {
    UserService.Instance.user_order_car(data.goodssizeid,data.goodsnum,data.sonlist[0].province,data.sonlist[0].city,data.sonlist[0].county,data.sonlist[0].address,data.sonlist[0].name,data.sonlist[0].mobile).then( (res:any) => {
        UIUtil.goorderPay(this,res.data.id);
    }).catch( err => {
        UIUtil.hideLoading()
        UIUtil.showError(err)
        this.props.history.push({pathname:"/order",state:{type:1}});
    })
  }
  //退货催货
  cancel_refund = (e:any) => {
    let id = e.currentTarget.dataset.id;    
    let type = e.currentTarget.dataset.type;    
    UIUtil.showLoading('处理中...');
      UserService.Instance.cancel_refund(id,type).then((res:any) => {
        Modal.alert('提示','处理成功');
        this.getlist(this.state.initialPage);
      UIUtil.hideLoading()
      }).catch(err => {
        Modal.alert('提示',err.message);
        UIUtil.hideLoading()  
      });
  }
  //退货
  cancel_order = (e:any) => {
    let id = e.currentTarget.dataset.id;    
    UIUtil.showLoading('处理中...');
      UserService.Instance.cancel_order(id).then((res:any) => {
        Modal.alert('提示','取消订单成功');
        this.getlist(this.state.initialPage);
      UIUtil.hideLoading()
      }).catch(err => {
        UIUtil.hideLoading()  
      });
  }
  //合单取消
  cancel_order_toget = (e:any) => {
    let id = e.currentTarget.dataset.id;    
    UIUtil.showLoading('处理中...');
      UserService.Instance.cancel_order_toget(id).then((res:any) => {
        Modal.alert('提示','取消订单成功');
        this.getlist(this.state.initialPage);
      UIUtil.hideLoading()
      }).catch(err => {
        UIUtil.hideLoading()  
      });
  }
  //合单退货
  cancel_refund_toget = (e:any) => {
    let id = e.currentTarget.dataset.id;    
    let type = e.currentTarget.dataset.type;    
    UIUtil.showLoading('处理中...');
    UserService.Instance.cancel_refund_toget(id,type).then((res:any) => {
      Modal.alert('提示','处理成功');
      this.getlist(this.state.initialPage);
    UIUtil.hideLoading()
    }).catch(err => {
      Modal.alert('提示',err);
      UIUtil.hideLoading()  
    });
  }
  onEndReached = (event:any) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    // if (this.state.isLoading && !this.state.hasMore) {
    //   return;
    // }
    // if (!this.state.isLoading && this.state.hasMore) {
    //     return;
    // }
    // this.setState({ isLoading: true });
    // this.getFriends()
  }
  
  public render() {
    const { redirectToLogin} = this.state

    if (redirectToLogin) {
        const to = {
            pathname: "/home"
        }
        return <Redirect to={to} />
    }
    const separator = (sectionID: number, rowID: number) => (
        <div
          key={`${sectionID}-${rowID}`}
          style={{
            backgroundColor: '#F5F5F5',
            height: 1,
          }}
        />
    );

    const row = (rowData: any, sectionID: number, rowID: number) => {
        
        return (
            rowData.sonlist.length > 0?
            <div className="bff">
              <div className="flex flex-j-sb padding">
                  <div>{rowData.create_time}</div>
                  <div>{rowData.corderid}</div>
                  <div className="cred">{rowData.sonlist[0].status == 1?'未支付': rowData.sonlist[0].status == 2?'待发货':rowData.sonlist[0].status == 3?'待收货':rowData.sonlist[0].status == 6?'待评价':rowData.sonlist[0].status == 7?'已逾期':rowData.sonlist[0].status == 8?'退款中':rowData.status == 9?'退货中':rowData.status == 10?'已退款':rowData.status ==  11?'已退货':'已完成'}</div>
              </div>
              {
                rowData.sonlist.map((data:any)=>(
                  <div>
                    {/* <div className="tar padding-lrt bteee">
                        <div className="cred">{data.status == 1?'未支付': data.status == 2?'待发货':data.status == 3?'待收货':data.status == 6?'待评价':data.status == 7?'已逾期':data.status == 8?'退款中':'退货中'}</div>
                    </div> */}
                    <div className="flex flex-j-sb padding-trb" onClick={()=>{this.props.history.push({pathname:'/orderdetails',state:{data:JSON.stringify(rowData)}})}}>
                        <div className="order-img"><img src={data.param.goods.img_url||defaults} alt=""/></div>
                        <div className="w40">{data.param.goods.goodsname}</div>
                        <div className="tar">
                            <div>¥{data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price}</div>
                            <div className="margin-tsm">x{data.goodsNum}</div>
                            {/* <div className="tar cd5e margin-tsm">查看产品使用说明</div> */}
                        </div>
                    </div>
                  </div>
                ))
              }
              <div className="tar margin-tsm bteee padding">
                  <div className="order-allpay"><span>共{rowData.totalnum}件</span><span>应付总额</span><span className="cred">¥{rowData.sumPrice}</span></div>
                  <div className={"flex flex-j-end margin-tsm "+(rowData.sonlist[0].status == 1?'':'none')}>
                      <div className="button-sm button-bcn margin-r" data-id={rowData.corderid} onClick={this.cancel_order_toget}>取消订单</div>
                      <div className="button-sm bf99" onClick={this.buycart.bind(this,rowData)}>立即付款</div>
                  </div>
                  <div className={"flex flex-j-end margin-tsm "+(rowData.sonlist[0].status == 2?'':'none')}>
                      <div className="button-sm button-bcn margin-r" data-id={rowData.corderid} data-type='3' onClick={this.cancel_refund_toget}>提醒发货</div>
                      <div className="button-sm button-bcn" data-id={rowData.corderid} data-type='1' onClick={this.cancel_refund_toget}>退货</div>
                  </div>
                  <div className={"flex flex-j-end margin-tsm "+(rowData.sonlist[0].status == 3?'':'none')}>
                      <div className="button-sm button-bcn margin-r" onClick={()=>{this.props.history.push({pathname:'/logistics',state:{data:JSON.stringify(rowData)}})}}>查看物流</div>
                      <div className="button-sm button-bcn margin-r" data-id={rowData.corderid} data-type='1' onClick={this.cancel_refund_toget}>退货</div>
                      <div className="button-sm bf99" data-id={rowData.corderid} data-type='4' onClick={this.cancel_refund_toget}>确认收货</div>
                  </div>
                  <div className={"flex flex-j-end margin-tsm "+(rowData.sonlist[0].status == 6?'':'none')}>
                      <div className="button-sm button-bcn" onClick={()=>{this.props.history.push({pathname:'/goodsevaluate',state:{id:rowData.id,goodsid:rowData.goodsid}})}}>评价</div>
                  </div>
              </div>
            </div>:
            <div className='bff fs14 margin-tsm'>
                <div className="flex flex-j-sb padding">
                    <div>{rowData.create_time}</div>
                    <div>{rowData.orderid}</div>
                    <div className="cred">{rowData.status == 1?'未支付': rowData.status == 2?'待发货':rowData.status == 3?'待收货':rowData.status == 6?'待评价':rowData.status == 7?'已逾期':rowData.status == 8?'退款中':rowData.status == 9?'退货中':rowData.status == 10?'已退款':rowData.status ==  11?'已退货':'已完成'}</div>
                </div>
                <div className="flex flex-j-sb padding-trb" onClick={()=>{this.props.history.push({pathname:'/orderdetails',state:{data:JSON.stringify(rowData)}})}}>
                    <div className="order-img"><img src={rowData.param.goods.img_url||defaults} alt=""/></div>
                    <div className="w40">{rowData.param.goods.goodsname}</div>
                    <div className="tar">
                        <div>¥{rowData.param.price.is_limit==1?rowData.param.price.price:rowData.param.price.original_price}</div>
                        <div className="margin-tsm">x{rowData.goodsNum}</div>
                        {/* <div className="tar cd5e margin-tsm">查看产品使用说明</div> */}
                    </div>
                </div>
                <div className="tar margin-tsm bteee padding">
                    <div className="order-allpay"><span>共{rowData.goodsNum}件</span><span>应付总额</span><span className="cred">¥{rowData.money}</span></div>
                    <div className={"flex flex-j-end margin-tsm "+(rowData.status == 1?'':'none')}>
                        <div className="button-sm button-bcn margin-r" data-id={rowData.id} onClick={this.cancel_order}>取消订单</div>
                        <div className="button-sm bf99" data-id={rowData.id} onClick={this.ordercartpay}>立即付款</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(rowData.status == 2?'':'none')}>
                        <div className="button-sm button-bcn margin-r" data-id={rowData.orderid} data-type='3' onClick={this.cancel_refund}>提醒发货</div>
                        <div className="button-sm button-bcn" data-id={rowData.orderid} data-type='1' onClick={this.cancel_refund}>退货</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(rowData.status == 3?'':'none')}>
                        <div className="button-sm button-bcn margin-r" onClick={()=>{this.props.history.push({pathname:'/logistics',state:{data:JSON.stringify(rowData)}})}}>查看物流</div>
                        <div className="button-sm button-bcn margin-r" data-id={rowData.orderid} data-type='1' onClick={this.cancel_refund}>退货</div>
                        <div className="button-sm bf99" data-id={rowData.id} data-type='4' onClick={this.cancel_refund}>确认收货</div>
                    </div>
                    <div className={"flex flex-j-end margin-tsm "+(rowData.status == 6?'':'none')}>
                        <div className="button-sm button-bcn" onClick={()=>{this.props.history.push({pathname:'/goodsevaluate',state:{id:rowData.id,goodsid:rowData.goodsid}})}}>评价</div>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="message-container friendsLog">
            <NavBar icon={<Icon type="left" />}
                onLeftClick={this.onRedirectBack}
                className="home-navbar" >
                <div className="nav-title">我的订单</div>
            </NavBar>
            <Tabs tabs={this.state.tabs}
                initialPage={0}
                page={this.state.initialPage}
                swipeable={false}
                onChange={(tab, index) => { this.setState({initialPage:index});this.getlist(tab.type) }}
            >
            <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div className={this.state.isLoading ? '' : 'none'} style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? '加载中' : ''}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        height: bodyHeight,
                        overflow: 'auto',
                    }}
                />
            </div>
            </Tabs>
        </div>
    )
}
}