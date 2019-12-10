import * as React from 'react';
import { NavBar, Icon, ListView, WingBlank, WhiteSpace } from "antd-mobile";
import { History } from "history";
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';
import CountDownView from './../../components/CountDownView';

interface CouponTypeProps {
  history: History
}


interface CouponTypeState {
  tabIndex: number,
  height: number,
  visible: boolean,
  dataSource: any,
  isLoading: boolean,
  hasMore: boolean,
  page: number,
  total_num: number,
  list_num: number,
  tabs: any,
  coins: any
}
const bodyHeight = (window.innerHeight / 100 - 0.9) + 'rem';

export class CouponType extends React.Component<CouponTypeProps, CouponTypeState> {
  rData: any
  lv: any

  constructor(props: CouponTypeProps) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
    });
    this.state = {
      height: document.documentElement.clientHeight - 200,
      visible: false,
      dataSource,
      isLoading: true,
      hasMore: false,
      page: 1,
      total_num: 1,
      list_num: 1,
      tabs: [],
      coins: [],
      tabIndex: 0
    };

  }

  onRedirectBack = () => {
    const history = this.props.history
    history.goBack()
  }

  componentDidMount() {
    this.onSelect();
  }

  onEndReached = (event: any) => {
    if (this.state.isLoading && !this.state.hasMore) {
      return;
    }
  }
  onSelect = () => {
    UserService.Instance.coupon_center('0').then((res: any) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(res.data),
        isLoading: false
      })
    }).catch(err => {
      this.setState({
        isLoading: false
      })
    });
  }
  public render() {
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
      const beginDate = rowData.is_forever==1?new Date('2099-12-30'):new Date(rowData.start_time * 1000)
      return (
        <WingBlank>
          <WhiteSpace></WhiteSpace>
          <div className="coupon_list coupon_get flex" onClick={() => { this.props.history.push({ pathname: '/coupongoDetails', state: { data: JSON.stringify(rowData),page:'0' } }) }}>
            <div className="w70 h100  padding-tbl ">
              {/* <div ><span className="c999 fs15">No.</span><span className="c066 fs13">{rowData.orderid}</span></div> */}
              <div className="flex margin-tsm">
                <img className="coupon_image" src={rowData.headimgurl} alt="" />
                <div className="conpou_center_desc margin-ls flex-column flex-j-sb">
                  <div className=" fs15 fb c333 "><span className="bd5e cfff fs13 padding3 margin-rsm">{rowData.is_forever==1?'永久券':rowData.type == "2"?"新人券":rowData.type == "5"?"限时购券":rowData.least?"满减券":"现金券"}</span>{rowData.brand_name}</div>
                  <div className="">
                    <span className="fs15 cf11 fb">¥</span>
                    <span className="coupon_money fs30 cf11 fb">{rowData.reduce}</span>
                    <span className="fs13 c066 padding-lsm">{rowData.description}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w30 h100   tac  flex-column flex-j-sb">
              <div className="c066 fs13">距开抢</div>
              {rowData.is_forever!=1?<CountDownView date={beginDate} />:
              <div className="margin-a padding-tb05"><span className="count_down_item bce0 cfff fs13 tac">99</span><span className="count_down_item_spector  c000 fs13 fb tac">:</span><span className="count_down_item bce0 cfff fs13 tac">99</span><span className="count_down_item_spector  c000 fs13 fb tac">:</span><span className="count_down_item bce0 cfff fs13 tac">99</span></div>
              }
              <div className="margin-a"><div className="coupon_fetch_button block w7 bd5e cfff fb fs12 tac ">领取</div></div>
            </div>
          </div>
          <WhiteSpace></WhiteSpace>
        </WingBlank>
      );
    };
    return (
      <div className="coupon_container">
        <NavBar icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar" >
          <div className="nav-title">领券中心</div>
        </NavBar>
        <div style={{ height: bodyHeight, backgroundColor: '#f5f5f5' }}>
          
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
        <div className="fans-list-view-container">

        </div>
      </div>
    )
  }
}