import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, WingBlank, WhiteSpace, Tabs, Button } from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
// import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';

import CouponRowView from './../../components/CouponRowView';
import { UIUtil } from 'src/utils/UIUtil';
import { Util } from 'src/utils/Util';




interface CouponProps {
  history: History
}


interface CouponState {
  tabIndex: number,
  height: number,
  visible: boolean,
  dataSource2: any,
  isLoading2: boolean,
  hasMore2: boolean,
  page2: number,
  total_num2: number,
  list_num2: number
  dataSource1: any,
  isLoading1: boolean,
  hasMore1: boolean,
  page1: number,
  total_num1: number,
  list_num1: number
  dataSource: any,
  isLoading: boolean,
  hasMore: boolean,
  page: number,
  total_num: number,
  list_num: number,
  tabs: any,
  coins: any,
  exchargeCode: string
  isnot:boolean
}

const tabs = [
  { title: '可使用' },
  { title: '已使用' },
  { title: '已失效' },
];
const bodyHeight = (window.innerHeight / 100 - 0.9) + 'rem';

export class Coupon extends React.Component<CouponProps, CouponState> {
  rData: any
  lv: any

  constructor(props: CouponProps) {
    super(props);
    const dataSource2 = new ListView.DataSource({
      rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
    });
    const dataSource1 = new ListView.DataSource({
      rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
    });
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
    });
    this.state = {
      height: document.documentElement.clientHeight - 200,
      visible: false,
      dataSource2,
      isLoading2: true,
      hasMore2: false,
      page2: 1,
      total_num2: 1,
      list_num2: 1,
      dataSource1,
      isLoading1: true,
      hasMore1: false,
      page1: 1,
      total_num1: 1,
      list_num1: 1,
      dataSource,
      isLoading: true,
      hasMore: false,
      page: 1,
      total_num: 1,
      list_num: 1,
      tabs: [],
      coins: [],
      tabIndex: 0,
      exchargeCode: "",
      isnot:false
    };

  }

  onRedirectBack = () => {
    const history = this.props.history
    history.goBack()
  }

  componentDidMount() {
    this.onSelect(0);
  }

  onEndReached = (event: any) => {
    // load new data
    // hasMore: from backend data, indicates whether it is the last page, here is false
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }

  }
  onSelect = (index: number) => {
    UserService.Instance.my_coupon(index + 1).then((couponList) => {
      if(couponList.length == 0){
        this.setState({
          isnot:true
        })
        return;
      }else{
        this.setState({
          isnot:false
        })
      }
      if (index == 0) {
        this.setState({
          dataSource2: this.state.dataSource2.cloneWithRows(couponList),
          isLoading2: false
        })
        return;
      }
      if (index == 1) {
        this.setState({
          dataSource1: this.state.dataSource1.cloneWithRows(couponList),
          isLoading1: false
        })
        return;
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(couponList),
        isLoading: false
      })
    }).catch(err => {
      this.setState({
        isLoading2: false,
        isLoading1: false,
        isLoading: false
      })
    });
  }

  onUserCoupon = (cash: any,orderid:string, e: React.SyntheticEvent) => {
    e.stopPropagation()
    window.localStorage.setItem('coupon',JSON.stringify(cash))
    if (cash.type == "2") {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{},couponid:orderid}})
    } else if (cash.type == "5") {
      this.props.history.push({pathname:'/goodsLimitedList',state:{val:{},couponid:orderid}})
    } else if (cash.goods_id != null) {
      this.props.history.push({pathname:'/goodsDetails', state: { id: cash.goods_id,couponid:orderid } })
    } else {
      this.props.history.push({pathname:'/searchcoupon',state:{val:{},couponid:orderid}})
    }
    // if (goodsId == null) {
    //   this.props.history.push({ pathname: '/searchcoupon', state: { val: {} } })
    // } else {
    //   this.props.history.push({ pathname: '/goodsDetails', state: { id: goodsId } })
    // }
  }

  onCoupon = (coupon: model.ICoupon, e: React.SyntheticEvent) => {
    e.stopPropagation()
    if(coupon.origin == ''){
      this.props.history.push({ pathname: '/coupongoDetails', state: { data: JSON.stringify(coupon),page:'1' } })
    }else{
      this.props.history.push({ pathname: '/couponget', state: { data: JSON.stringify(coupon),page:'1' } })
    }
  }

  onExchargeCodeChange = (event: React.FormEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    this.setState({
      exchargeCode: newValue
    })
  }

  onExcharge = (event: React.SyntheticEvent) => {
    event.preventDefault()
    const exchargeCode = this.state.exchargeCode
    if (exchargeCode.length == 0) {
      return
    }
    UserService.Instance.redeem_coupon(exchargeCode).then(() => {
      UIUtil.showInfo("兑换成功")
      this.setState({
        exchargeCode: ""
      })
    }).catch((err) => {
      UIUtil.showError(err)
    })
  }

  public render() {
    const separator2 = (sectionID: number, rowID: number) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F5',
          height: 1,
        }}
      />
    );
    const row2 = (rowData: model.ICoupon, sectionID: number, rowID: number) => {
      const coupon = rowData
      let couponType = ""
      let userDesc = ""
      let isCan = Util.isCan(rowData.cash.start_time)
      if (coupon.cash.type == "2") {
        couponType = "新人券"
      } else if (coupon.cash.type == "5") {
        couponType = "限时购券"
      } else {
        if (coupon.cash.least) {
          couponType = "满减券"
        } else {
          couponType = "现金券"
        }
      }
      if(rowData.cash.is_forever==1){
        couponType = "永久券"
      }
      if (coupon.cash.least) {
        userDesc = "满¥" + coupon.cash.least + "使用"
      } else {
        userDesc = "无金额门槛"
      }
      return (
        <WingBlank>
          <WhiteSpace></WhiteSpace>
          <div className="coupon_list coupon_can flex" onClick={this.onCoupon.bind(this, coupon)}>
            <div className="w70 h100 padding-tbl  flex-column flex-j-c" >
              <div className="coupon_title  "><span className="c999 fs15">No.</span><span className="c066 fs13">{coupon.orderid}</span></div>
              <div className="coupon_left_desc flex flex-a-start fs18  ">
                <div className="bd5e cfff fs13 padding3">{couponType}</div>
                <div className="margin-ls">
                  <div className="c333 fs13">{coupon.cash.brand_name}</div>
                  <div className="c333 fs12 margin-tsm">
                    {coupon.cash.is_forever==1?Util.formatDate('2100-01-01'):Util.formatDate(coupon.cash.end_time*1000)}到期 </div>
                </div>
              </div>
              <div className=" fs13 ">
                <span className="c066">•</span><span className="c333">{coupon.cash.description}</span>
              </div>
            </div>
            <div className="coupon_money w30 h100 fs30  tac  flex-column flex-j-c">
              <div className="cf11"><span className="fs24">¥</span><span className="fs44">{coupon.cash.reduce}</span></div>
              <div className="c000 fs13">{userDesc}</div>
              <div><a className={"coupon_user_button " + (isCan?'':'disabled')} onClick={isCan?this.onUserCoupon.bind(this, coupon.cash,coupon.orderid):''}>立即使用</a></div>
              {/* <div><a className={"coupon_user_button " + (isCan?'':'disabled')}>立即使用</a></div> */}
            </div>
          </div>
          <WhiteSpace></WhiteSpace>
        </WingBlank>

      );
    };

    const separator1 = (sectionID: number, rowID: number) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F5',
          height: 1,
        }}
      />
    );
    const row1 = (rowData: model.ICoupon) => {

      return (
        <CouponRowView coupon={rowData} type={2} />
      );
    };
    const separator = (sectionID: number, rowID: number) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F5',
          height: 1,
        }}
      />
    );
    const row = (rowData: model.ICoupon) => {
      return (
        <CouponRowView coupon={rowData} type={3} />
      );
    };
    return (
      <div className="coupon_container" >
        <NavBar icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar" >
          <div className="nav-title">我的卡券</div>
        </NavBar>
        <Tabs tabs={tabs} onTabClick={(tab, index) => { this.onSelect(index) }}>
          <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
            <div className="h55 bf1 flex">
              <WingBlank className="h39 w100 flex flex-j-sb">
                <input className="auto_width h100 padding-l1 flex-grow-1 br5 bw0" type="text" value={this.state.exchargeCode} placeholder="请输入兑换码" onChange={this.onExchargeCodeChange} />
                <a className="w069 h100 xw69 mw69 flex-grow-0 cfff bd5e br5 l039 tac margin-ls " onClick={this.onExcharge}>兑换</a>
              </WingBlank>
            </div>
            <div className={"padding tac fs14 "+(this.state.isnot?'':'none')}>暂无更多数据</div>
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource2}
              renderFooter={() => (<div className={this.state.isLoading2 ? '' : 'none'} style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading2 ? '加载中' : ''}
              </div>)}
              renderRow={row2}
              renderSeparator={separator2}
              className={"am-list " + (this.state.isnot?'none':'')}
              pageSize={4}
              // useBodyScroll
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
            />

          </div>
          <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
            <div className={"padding tac fs14 "+(this.state.isnot?'':'none')}>暂无更多数据</div>
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource1}
              renderFooter={() => (<div className={this.state.isLoading1 ? '' : 'none'} style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading1 ? '加载中' : ''}
              </div>)}
              renderRow={row1}
              renderSeparator={separator1}
              className={"am-list " + (this.state.isnot?'none':'')}
              pageSize={4}
              // useBodyScroll
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
            />

          </div>
          <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
            <div className={"padding tac fs14 "+(this.state.isnot?'':'none')}>暂无更多数据</div>
            <ListView
              ref={el => this.lv = el}
              dataSource={this.state.dataSource}
              renderFooter={() => (<div className={this.state.isLoading ? '' : 'none'} style={{ padding: 30, textAlign: 'center' }}>
                {this.state.isLoading ? '加载中' : ''}
              </div>)}
              renderRow={row}
              renderSeparator={separator}
              className={"am-list " + (this.state.isnot?'none':'')}
              pageSize={4}
              // useBodyScroll
              onScroll={() => { console.log('scroll'); }}
              scrollRenderAheadDistance={500}
              onEndReached={this.onEndReached}
              onEndReachedThreshold={10}
              style={{
                height: this.state.height,
                overflow: 'auto',
              }}
            />
          </div>
        </Tabs>
        <div className="address-footer-button-container question_btn but-fx">
            <Button type="primary" onClick={() => { this.props.history.push('/coupontype') }}>领券中心</Button>
        </div>
      </div>
    )
  }
}