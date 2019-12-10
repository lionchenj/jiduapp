import * as React from "react";
import { NavBar, Icon, ListView} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "../../service/UserService";
import defaults from "../../assets/default.png";
interface ExtensionOrderProps {
  history: History;
  location: Location;
}

interface ExtensionOrderState {
  redirectToLogin: boolean;
  dataSource:any;
  isLoading: boolean;
  initialPage:number;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class ExtensionOrder extends React.Component< ExtensionOrderProps, ExtensionOrderState> {
  rData: any;
  lv: any;

  constructor(props: ExtensionOrderProps) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    });
    this.state = {
      dataSource,
      redirectToLogin: false,
      isLoading: false,
      initialPage:1
    };
  }
  componentDidMount() {
    this.getlist();
    // this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(['1'])
    // })
  }

  onRedirectBack = () => {
    this.setState({
      ...this.state,
      redirectToLogin: true
    });
  };
  getlist = () => {
    UIUtil.showLoading('链接中...');
      UserService.Instance.promotion_order().then((res:any) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(res.data),
        })
      UIUtil.hideLoading()
      }).catch(err => {
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
            <div className='bff fs12 c333 margin-t'>
                <div className="flex flex-j-sb padding">
                    <div>{rowData.create_time}</div>
                    <div>{rowData.status == 1?'未支付':rowData.status == 2?'待发货':rowData.status == 3?'待收货':rowData.status == 4?'租用中':rowData.status == 6?'待评价':rowData.status == 7?'已逾期':rowData.status == 8?'退款中':rowData.status == 9?'退货中':rowData.status == 10?'已退款':rowData.status ==  11?'已退货':'已完成'}</div>
                </div>
                <div className="flex flex-j-sb padding-trb2 bteee">
                    <div className="order-img"><img src={rowData.goods_url||defaults} alt=""/></div>
                    <div className="w50">{rowData.goods_name}</div>
                    <div>
                        <div>¥{rowData.money}</div>
                        <div className="margin-t">x{rowData.goodsNum}</div>
                        <div className="margin-t cred">奖励{rowData.reward||0}元</div>
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
                <div className="nav-title">推广订单</div>
            </NavBar>
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
        </div>
    )
}
}