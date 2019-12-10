import * as React from "react";
import { NavBar, Icon, ListView} from "antd-mobile";
import { Redirect } from "react-router-dom";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
// import { UserService } from "../../service/UserService";
import credit from "../../assets/credit.png";
import collection from "../../assets/index_icon_collection.png";
import defaults from "../../assets/default.png";
interface ExtensionListProps {
  history: History;
  location: Location;
}

interface ExtensionListState {
  redirectToLogin: boolean;
  dataSource:any;
  orderList: any;
  isLoading: boolean;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class ExtensionList extends React.Component< ExtensionListProps, ExtensionListState> {
  rData: any;
  lv: any;

  constructor(props: ExtensionListProps) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1: any, row2: any) => row1 !== row2,
    });
    this.state = {
      dataSource,
      redirectToLogin: false,
      isLoading: false,
      orderList: []
    };
  }

  onRedirectBack = () => {
    this.setState({
      ...this.state,
      redirectToLogin: true
    });
  };
  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    UIUtil.showLoading('链接中...');
      // UserService.Instance.MyPromlist().then((res:any) => {
      //   res.data.map((data:any)=>{
      //     if(!data.sonlist){
      //       data['sonlist'] = [];
      //     }
      //     if(!data.topic){
      //       data['topic'] = [];
      //     }
      //   })
      //   this.setState({
      //     dataSource: this.state.dataSource.cloneWithRows(res.data),
      //     orderList: res.data
      //   })
      // UIUtil.hideLoading()
      // }).catch(err => {
      //   UIUtil.hideLoading()  
      // });
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
  goDetails = (e:any) =>{
    let orderid = e.currentTarget.dataset.id;
    this.props.history.push({pathname:"/extensionDetails",state:{orderid:orderid}});
  }
  goDetailsOth = (e:any) =>{
    let orderid = e.currentTarget.dataset.id;
    this.props.history.push({pathname:"/extensionDetailsOther",state:{orderid:orderid}});
  }
  goDetailsOnO = (e:any) =>{
    let orderid = e.currentTarget.dataset.id;
    this.props.history.push({pathname:"/extensionDetailsOnO",state:{orderid:orderid}});
  }
  goDetailsSHO = (e:any) =>{
    let orderid = e.currentTarget.dataset.id;
    this.props.history.push({pathname:"/extensionDetailsSHO",state:{orderid:orderid}});
  }
  refund  = (e:any) =>{
    // let orderid = e.currentTarget.dataset.id;
    // UserService.Instance.RefundMoney(orderid).then((res:any) => {
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(res.data),
    //     orderList: res.data
    //   })
    // }).catch(err => {

    // });
  }
  
  //收藏
  // setFavorite = (e:any) => {
  //   if(UIUtil.not_weixin()){
  //     UIUtil.showInfo('请在微信浏览器打开！')
  //     return;
  //   }
  //   let id = e.currentTarget.dataset.orderid;
  //   UserService.Instance.fabsAndfavor(id)
  //     .then((res: any) => {
  //       if (res.data.favorstatus == "1") {
  //         UserService.Instance.delfavorQue(id)
  //           .then((res: any) => {
  //             UIUtil.hideLoading();
  //           })
  //           .catch(err => {
  //             UIUtil.showError(err);
  //           });
  //       }
  //       if (res.data.favorstatus == "-1") {
  //         UserService.Instance.favoriteQue(id)
  //           .then((res: any) => {
  //             UIUtil.hideLoading();
  //           })
  //           .catch(err => {
  //             UIUtil.showError(err);
  //           });
  //       }
  //       this.getlist();
  //       UIUtil.hideLoading();
  //     })
  //     .catch(err => {
  //       UIUtil.showError(err);
  //     });
  // };
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
        <div className="bbeee padding wpadding-b" key={rowData.orderid}>
        <div className={rowData.type == '1' || rowData.type == '5'?"":"none"}>
        <div data-id={rowData.orderid} onClick={this.goDetails}>
          <div className="flex flex-j-sb bbeee padding-b">
            <div>
              <div className="fs15 fb text-t"><span className="fs10 back329 order_type fn margin-rs">我要问</span>{rowData.question}</div>
              <div className="fs14 c999 padding-txs">订单号：{rowData.orderid}</div>
            </div>
            <div className={rowData.status == '1'?'cfa4':rowData.status == '2'?'c999':rowData.status == '3'?'c999':rowData.status == '4'?'cffa':'c999'}>{rowData.status == '1'?'未支付':rowData.status == '2'?'已支付':rowData.status == '3'?'已预约':rowData.status == '4'?'失约':'已完成'}</div>
          </div>
            <div className="flex padding-b padding-t">
              <img className="home_head" src={rowData.headimgurl || defaults} />
              <span className="fs14 c999 padding-lr">{rowData.nickname}</span>·
              <span className="fs14 c999 padding-lr">{rowData.answered_number}/{rowData.answer_number}个回答</span>·
              <span className="fs14 c999 padding-lr">{rowData.create_time}</span>
            </div>
            <div className="fs15 c666 lh14 wwb padding-tb text-h">
              {rowData.description}
            </div>
          </div>
          <div className="flex flex-j-sb bteee padding-t">
            <div className="flex c999">
              <img className="content_img margin-rsm" src={rowData.favostatus != '1' ?collection:credit} data-orderid={rowData.orderid}  />
              <span>{rowData.fabs}</span>
            </div>
            {/* <div className={"home_pay b329 fs13 c329 text-cen "+ (rowData.userSee == '2'?'':'none')} onClick={()=>UIUtil.seePay(this,rowData.orderid,'3')}>
              ¥<span>{rowData.price}</span>看答案
            </div> */}
          </div>
        </div>
        
        <div className={rowData.type == '2'?"":"none"}>
          <div className="flex flex-j-sb bbeee padding-b">
              <div>
                  <div className="fs15 fb"><span className="fs10 back329 order_type fn margin-rs">我要问</span>{rowData.question_type}</div>
              </div>
              <div className={rowData.status == '1'?'cfa4':rowData.status == '2'?'c999':rowData.status == '3'?'c999':rowData.status == '4'?'cffa':'c999'}>{rowData.status == '1'?'未支付':rowData.status == '2'?'已支付':rowData.status == '3'?'已预约':rowData.status == '4'?'失约':'已完成'}</div>
          </div>
          <div className="fs15 c666 lh14 wwb padding-tb" data-id={rowData.orderid} onClick={this.goDetailsOth}>
            <div className="flex flex-j-sb">
              <div className="margin-rsm fs15 fb text-t">题目：{rowData.question}</div>
              {/* <div className={"home_pay b329 fs13 c329 text-cen "+(rowData.userSee == '2'?'':'none')} onClick={()=>UIUtil.seePay(this,rowData.orderid,'4')}>
                  ¥<span>{rowData.price}</span>看答案
              </div> */}
            </div>
            <div className="fs14 c999 padding-txs">订单号：{rowData.orderid}</div>
          </div>
        </div>
        
        <div className={rowData.type == '3'?"":"none"}>
        <div data-id={rowData.orderid} onClick={this.goDetailsSHO}>
        <div className="flex flex-j-sb bbeee padding-b">
          <div>
            <div className="fs15 fb"><span className="fs10 back5fa order_type fn margin-rs">一对一</span>跟我看校园</div>
            <div className="fs14 c999 padding-txs">订单号：{rowData.orderid}</div>
          </div>
          <div className={rowData.status == '1'?'cfa4':rowData.status == '2'?'c999':rowData.status == '3'?'c999':rowData.status == '4'?'cffa':'c999'}>{rowData.status == '1'?'未支付':rowData.status == '2'?'已支付':rowData.status == '3'?'已预约':rowData.status == '4'?'失约':'已完成'}</div>
        </div>
          <div className="flex padding-b padding-t">
            <img className="questionList_head" src={rowData.knower_headimgurl || defaults} />
            <div className="margin-ls tal">
              <div>{rowData.knower_nickname}</div>
              <div className="fs14 c999">{rowData.knower_school}</div>
            </div>
            <div className="w65 flex flex-w flex-j-end">
            {rowData&&rowData.topic.map((data: any, index: string) => {
                if(data != null){
                  return (
                    <div className="margin-rsm c329" key={index}>#{data}#</div>
                    );
                }else{
                  return;
                }
              })}
            </div>
          </div>
          <div className="fs15 c666 lh14 wwb  padding-tb text-h">
            {rowData.knower_profile}
          </div>
          </div>
          <div className="flex flex-j-sb bteee padding-t">
            <div className="flex c999">
              预约时间：{rowData.apmentime}
            </div>
          </div>
        </div>

        <div className={rowData.type == '4'?"":"none"}>
        <div data-id={rowData.orderid} onClick={this.goDetailsOnO}>
            <div className="flex flex-j-sb bbeee padding-b">
                <div>
                    <div className="fs15 fb"><span className="fs10 back5fa order_type fn margin-rs">一对一</span>一对一咨询</div>
                    <div className="fs14 c999 padding-txs">订单号：{rowData.orderid}</div>
                </div>
                <div className={rowData.status == '1'?'cfa4':rowData.status == '2'?'c999':rowData.status == '3'?'c999':rowData.status == '4'?'cffa':'c999'}>{rowData.status == '1'?'未支付':rowData.status == '2'?'已支付':rowData.status == '3'?'已预约':rowData.status == '4'?'失约':'已完成'}</div>
            </div>
            <div className="flex padding-b padding-t flex-w">
                {rowData&&rowData.topic.map((data: any, index: string) => {
                    if(data != null){
                      return (
                        <div className="margin-rsm c329" key={index}>#{data}#</div>
                        );
                    }else{
                      return;
                    }
                })}
            </div>
            <div className="fs15 c666 lh14 wwb padding-tb text-h">{rowData.duration}</div>
            <div>知者类型：<span>{rowData.knower_type}</span></div>
            <div>聊天时长：<span>{rowData.requirement}</span></div>
            <div className="padding-b">聊天方式：<span>{rowData.communication}</span></div>
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