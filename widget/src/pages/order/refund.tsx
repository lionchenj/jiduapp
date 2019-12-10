import * as React from "react";
import { NavBar, Icon, ListView,Tabs} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "../../service/UserService";
import defaults from "../../assets/default.png";
interface refundProps {
  history: History;
  location: Location;
}

interface refundState {
  redirectToLogin: boolean;
  dataSource:any;
  tabs: any;
  isLoading: boolean;
  initialPage:number;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class refund extends React.Component< refundProps, refundState> {
  rData: any;
  lv: any;

  constructor(props: refundProps) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    });
    this.state = {
      dataSource,
      redirectToLogin: false,
      isLoading: false,
      tabs: [
        { title: '退货' ,type: 9 },
        { title: '退款' ,type: 8 },
      ],
      initialPage:0
    };
  }
  componentDidMount() {
    this.getlist(9);
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
                  <div className="cred">{rowData.sonlist[0].status == 8?'退款中':'退货中'}</div>
              </div>
              {
                rowData.sonlist.map((data:any)=>(
                  <div>
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
            </div>
          </div>:
          <div className='bff fs14 margin-tsm'>
          <div className="flex flex-j-sb padding">
              <div>{rowData.create_time}</div>
              {/* <div>订单编号：{rowData.id}</div> */}
              <div className="cred">{rowData.status == 8?'退款中':'退货中'}</div>
          </div>
          <div className="flex flex-j-sb padding-trb bteee" onClick={()=>{this.props.history.push({pathname:'/orderdetails',state:{data:JSON.stringify(rowData)}})}}>
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
          </div>
      </div>
        );
    };
    return (
        <div className="message-container friendsLog">
            <NavBar icon={<Icon type="left" />}
                onLeftClick={this.onRedirectBack}
                className="home-navbar" >
                <div className="nav-title">退货/退款订单</div>
            </NavBar>
            <Tabs tabs={this.state.tabs}
                initialPage={0}
                page={this.state.initialPage}
                onChange={(tab, index) => {this.setState({initialPage:index});this.getlist(tab.type);}}
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