import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, Tabs, Modal} from "antd-mobile";
import { History,Location } from "history";
import { Redirect } from "react-router-dom";

import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';




interface CollectionProps {
    history: History;
    location: Location;
  }


interface CollectionState {
    tabIndex:number,
    visible: boolean
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    page: number,
    total_num: number,
    list_num: number,
    tabs:any,
    coins:any,
    type:string,
    redirectToLogin: boolean,
    isonline: boolean
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class Collection extends React.Component<CollectionProps, CollectionState> {
  rData: any
  lv: any

  constructor(props: CollectionProps) {
      super(props);
      
        const dataSource = new ListView.DataSource({
          rowHasChanged: (row1: any, row2: any) => row1 !== row2,
        });
        this.state = {
          visible: false,
          dataSource,
          isLoading: true,
          hasMore: false,
          page: 1,
          total_num: 1,
          list_num: 1,
          tabs:[
            { title: '商品',type:'1'},
            { title: '文章',type:'2'}],
          coins:[],
          type:'1',
          tabIndex:0,
          redirectToLogin: false,
          isonline:false
        };
      
  }
  componentDidMount() {
    if(!this.props.location.state){
      this.props.history.push('/')
      return;
    }
    let type = this.props.location.state.id;
    this.setState({
      type:type
    })
    this.favorQuelist(type);
  }
  onRedirectBack = () => {
      this.setState({
          ...this.state,
          redirectToLogin: true
      })
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
  goodsDetails = (e:any) =>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:'/goodsDetails',state:{id:id}})
  }
  questionDetails = (e:any) =>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:"/articleDetails",state:{id:id, isCollection:true}});
  }
  favorQuelist = (type:string) => {
    UserService.Instance.myFavorite(type).then( (res:any) => {
      this.setState({
          type:type,
          dataSource: this.state.dataSource.cloneWithRows(res.data),
          isLoading: false,
          hasMore: false,
      });
      UIUtil.hideLoading()
    }).catch( err => {
        UIUtil.showError(err)
    })
  }
  delfavorQue = (e:any) => {
    UserService.Instance.cancel_favorite(e.currentTarget.dataset.id,e.currentTarget.dataset.type).then( (res:any) => {
      Modal.alert("提示","取消成功");
      this.favorQuelist(this.state.type);
    }).catch( err => {
        UIUtil.showError(err)
    })
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
          if(rowData.type == '1'){
            return (
              <div className="bff margin-t">
                <div className="flex-no h150 padding" data-id={rowData.list.goodsid} onClick={this.goodsDetails}>
                  <div className="w45">
                    <div className="coll-img">
                      <img src={rowData.list.img_url} alt=""/>
                    </div>
                  </div>
                  <div className="w55 flex-no flex-j-sb flex-w flex-f">
                    <div className="fs16 c101">{rowData.list.goodsname}</div>
                    <div className="fs12 c707 index_goods_content">{rowData.list.description}</div>
                    <div></div>
                    <div className="fs12 cred">¥{rowData.list.price}</div>
                  </div>
                </div>
                <div className="tar padding" data-id={rowData.list.goodsid} data-type={rowData.type} onClick={this.delfavorQue}>取消收藏</div>
              </div>
              );
          }
          return (
            <div className="bff margin-t">
              <div className="flex-no h150 padding" onClick={()=>{this.props.history.push({pathname:"/articleDetails",state:{datas:JSON.stringify(rowData.list), isCollection:true}});}}>
                <div className="w45">
                  <div className="coll-img">
                    <img src={rowData.list.img_url} alt=""/>
                  </div>
                </div>
                <div className="w55 flex-no flex-j-sb flex-w flex-f">
                  <div className="fs16 c101">{rowData.list.title}</div>
                  <div className="fs12 c707 h40 overhi margin-tsm index_goods_content">{rowData.list.description}</div>
                  <div className="fs14 c333 margin-tsm"><img className="simg br" src={rowData.list.author_head_img}/>{rowData.list.author}</div>
                  <div className="fs12 c999 margin-tsm">{rowData.update_time}</div>
                </div>
              </div>
              <div className="tar padding-lrb" data-id={rowData.list.id} data-type={rowData.type} onClick={this.delfavorQue}>取消收藏</div>
            </div>
            );
        };
      return (
          <div className="message-container">
              <NavBar icon={<Icon type="left" />}
                  onLeftClick={this.onRedirectBack}
                  className="home-navbar" >
                  <div className="nav-title">我的收藏</div>
              </NavBar>
              <Tabs tabs={this.state.tabs}
                initialPage={0}
                swipeable={false}
                onChange={(tab, index) => { this.favorQuelist(tab.type); }}
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
                  // useBodyScroll
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
              <div className="fans-list-view-container"></div>
          </div>
      )
  }
}