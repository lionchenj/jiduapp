import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List, SearchBar } from "antd-mobile";
import { History, Location } from "history";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";
import { UserStorage } from "src/storage/UserStorage";
import search1 from "../../assets/appimg/search1.png";

import search22 from "../../assets/appimg/search2-2.png";
import search3 from "../../assets/appimg/search3.png";
import search4 from "../../assets/appimg/search4.png";
import goods from "../../assets/appimg/good1.png";

interface SearchcouponProps {
  history: History;
  location:Location;
}

interface SearchcouponState {
  tabIndex: number;
  height: number;
  visible: boolean;
  dataSource: any;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  total_num: number;
  list_num: number;
  tabs: any;
  coins: any;
  oldList: any;
  recommendList: any;
  isscreen: any;
  search:string;
  lowest_price:string;
  higest_price:string;
  freight:string;
  type:string;
  sort:string;
  types:number;
  couponid:string;
}
const bodyHeight = window.innerHeight / 100 - .95 + "rem";

export class Searchcoupon extends React.Component<SearchcouponProps, SearchcouponState> {
  rData: any;
  lv: any;
  value: string;
  type:string;
  autoFocusInst: any;
  constructor(props: SearchcouponProps) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (
        row1: model.TransactionItem,
        row2: model.TransactionItem
      ) => row1 !== row2
    });
    this.state = {
      height: document.documentElement.clientHeight - 200,
      visible: false,
      dataSource,
      isLoading: false,
      hasMore: false,
      page: 1,
      total_num: 1,
      list_num: 1,
      tabs: [],
      coins: [],
      tabIndex: 0,
      oldList: [],
      recommendList: [],
      isscreen:false,
      search:'',
      lowest_price:'',
      higest_price:'',
      freight:'',
      type:'',
      sort:'',
      types:0,
      couponid:''
    };
  }
  componentDidMount() {
    let couponid = this.props.location.state.couponid;
    this.setState({
      couponid
    })
    this.search('');
  }
  onRedirectBack = () => {
    this.props.history.push("/");
  };
  onEndReached = (event: any) => {
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
  };
  // 搜索
  search = (value:string) => {
    this.setState({
      search:value,
      lowest_price:'',
      higest_price:'',
      freight:'',
      type:'',
    })
    UserService.Instance.search_goods({search:value})
      .then((res: any) => {
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
            isLoading: false,
            isscreen: false,
            types:0
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  };
  lprice = (e:any) => {
    this.setState({
      lowest_price:e.currentTarget.value
    })
  }
  hprice = (e:any) => {
    this.setState({
      higest_price:e.currentTarget.value
    })
  }
  freight = () => {
    if(this.state.freight == ''){
      this.setState({
        freight:'1'
      })
    }else{
      this.setState({
        freight:''
      })
    }
  }
  settype = (e:any) => {
    this.setState({
      type:e.currentTarget.dataset.type
    })
  }
  reset = () => {
    this.setState({
      lowest_price:'',
      higest_price:'',
      freight:'',
      type:'',
    })
  }
  //条件搜索
  condition = () => {
    let params = {
      search:this.state.search,
      lowest_price:this.state.lowest_price,
      higest_price:this.state.higest_price,
      freight:this.state.freight,
      type:this.state.type,
    }
    UserService.Instance.search_goods(params)
      .then((res: any) => {
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
            isLoading: false,
            isscreen: false,
            types:3
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  };
  //价格排序
  updown = () =>{
    let params = {
      search:this.state.search,
      lowest_price:this.state.lowest_price,
      higest_price:this.state.higest_price,
      freight:this.state.freight,
      type:this.state.type,
      sort:this.state.sort
    }
    UserService.Instance.search_goods(params)
      .then((res: any) => {
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
            isLoading: false,
            isscreen: false,
            types:2
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  }
  onSubmit = (value: string) => {
    let list = this.state.oldList;
    for (let i = 0; i < list.length; i++) {
      if(list[i] == value){
        this.search(value);
        return;
      }
    }
    list.push(value);
    let setList = list.join()
    UserStorage.setStorage('searchGoods',setList);
    this.search(value);
  };
  //跳转详情
  goDetails = (e:any)=>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:'/goodsDetails',state:{id:id,couponid:this.state.couponid}})
  }
  //收藏
  // setFavorite = (e: any) => {
  //   if (UIUtil.not_weixin()) {
  //     UIUtil.showInfo("请在微信浏览器打开！");
  //     return;
  //   }
  //   let id = e.currentTarget.dataset.id;
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
  //       this.search();
  //       UIUtil.hideLoading();
  //     })
  //     .catch(err => {
  //       UIUtil.showError(err);
  //     });
  // };
  public render() {
    const separator = (sectionID: number, rowID: number) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: "#F5F5F5",
          height: 1
        }}
      />
    );

    const row = (rowData: any, sectionID: number, rowID: number) => {
      return (
        <div className="index_goods bff padding margin-t" data-id={rowData.goodsid} data-couponid={this.state.couponid} onClick={this.goDetails}>
          <div className="flex">
            <div className="tac goods_list"><img src={rowData.img_url||goods} alt=""/></div>
            <div className="padding-l2 w100">
              <div className="fs13 c999">{rowData.type == '1'?'健康':'其他'}</div>
              <div className="fs18 fb">{rowData.goodsname}</div>
              <div className="fs12 c999">{rowData.content}</div>
              <div className="flex margin-tsm margin-tl">
                <div className="fs14 fb cce0 margin-rsm">¥<span className="fs22">{rowData.price}</span></div>
                <div className="fs12 c999 td">| 原价：¥{rowData.price}</div>
              </div>
              <div className="flex margin-tsm">
                {/* <div className="fs12 cfff bd5e padding05 margin-rsm">特价</div> */}
                <div className="fs12 c999 margin-rsm">30000条评价</div>
                <div className="fs12 c999">99%好评</div>
              </div>
            </div>
          </div>
        </div>
      )
    };
    return (
      <div className="message-container friendsLog">
        <NavBar
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">搜索</div>
        </NavBar>
        <List>
          <SearchBar
            placeholder="搜索"
            maxLength={8}
            value={this.state.search}
            onSubmit={this.onSubmit}
            onChange={(v:string)=>{this.setState({search:v})}}
            ref={ref => (this.autoFocusInst = ref)}
          />
        </List>
        <div className="search-menu flex bff tac padding-tb">
          <div className={"w25 "+(this.state.types == 0?'cd5e':'')} onClick={this.search.bind(this,this.state.search)}>综合<img className="search-img" src={this.state.types == 0?search1:search22} alt=""/></div>
          <div className={"w25 "+(this.state.types == 1?'cd5e':'')}>销量</div>
          <div className={"w25 "+(this.state.types == 2?'cd5e':'')} onClick={this.updown}>价格<img className="search-img" src={this.state.types == 2?search1:search22} alt=""/></div>
          <div className={"w25 "+(this.state.types == 3?'cd5e':'')} onClick={()=>{this.setState({isscreen:!this.state.isscreen})}}>筛选<img className="w01" src={search3}/></div>
        </div>
        <div className={this.state.isscreen?'search-bg':'none'}>
          <div className="w65 bff ml35p pr" style={{ height: bodyHeight}}>
            <div className="screen-img pa" onClick={()=>{this.setState({isscreen:!this.state.isscreen})}}><img className="w02" src={search4} alt=""/></div>
            <div className="padding">价格</div>
            <div className="padding-lr2 screen-input">
              <input type="text" placeholder="最低价格" value={this.state.lowest_price} onChange={this.lprice}/>
              <input className="margin-t" type="text" value={this.state.higest_price} onChange={this.hprice} placeholder="最高价格"/>
            </div>
            <div className="padding">运费</div>
            <div className="flex flex-w padding-lr2">
              <div className={"screen-text "+(this.state.freight == '1' ? 'bd5e' : '')} onClick={this.freight}>免运费</div>
            </div>
            <div className="padding">商品性质</div>
            <div className="flex flex-w padding-lr2">
              <div className={"screen-text margin-r "+(this.state.type == '1' ? 'bd5e' : '')} data-type="1" onClick={this.settype}>自营</div>
              <div className={"screen-text "+(this.state.type == '2' ? 'bd5e' : '')} data-type="2" onClick={this.settype}>其他</div>
            </div>
            <div className="flex flex-w padding-lr2 margin-t5">
              <div className="padding3 bd5e cfff br margin-r" onClick={this.condition}>确认</div>
              <div className="padding3 bd5e cfff br" onClick={this.reset}>重置</div>
            </div>
          </div>
        </div>
        <div style={{ height: bodyHeight, backgroundColor: "#f5f5f5" }}>
            
          <ListView
            ref={el => (this.lv = el)}
            dataSource={this.state.dataSource}
            renderFooter={() => (
              <div style={{ padding: 30, textAlign: "center" }}>
                {this.state.isLoading ? "加载中" : ""}
              </div>
            )}
            renderRow={row}
            renderSeparator={separator}
            className="am-list"
            pageSize={4}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            style={{
              height: bodyHeight,
              overflow: "auto"
            }}
          />
        </div>
      </div>
    );
  }
}
