import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List, SearchBar } from "antd-mobile";
import { History } from "history";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";
import { UserStorage } from "src/storage/UserStorage";
import search1 from "../../assets/appimg/search1.png";
import search22 from "../../assets/appimg/search2-2.png";
import search3 from "../../assets/appimg/search3.png";
import search4 from "../../assets/appimg/search4.png";
import goods from "../../assets/appimg/good1.png";

interface SearchProps {
  history: History;
}

interface SearchState {
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
  redirectToLogin: boolean;
  oldList: any;
  recommendList: any;
  isscreen: any;
  search:string;
  lowest_price:string;
  higest_price:string;
  freight:string;
  type:string;
  sort:number;
  sort_sales_num:number;
  valueS:string;
  types:number;
  updownchange:boolean;
}
const bodyHeight = window.innerHeight / 100 - 1.35 + "rem";

export class Search extends React.Component<SearchProps, SearchState> {
  rData: any;
  lv: any;
  value: string;
  type:string;
  autoFocusInst: any;
  constructor(props: SearchProps) {
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
      redirectToLogin: true,
      oldList: [],
      recommendList: [],
      isscreen:false,
      search:'',
      lowest_price:'',
      higest_price:'',
      freight:'',
      type:'',
      sort:1,
      sort_sales_num:1,
      valueS:'',
      types:0,
      updownchange:false
    };
  }
  componentDidMount() {
    let list = UserStorage.getStorage('searchGoods');
    let list2 = list?list.split(','):[];
    this.setState({
      oldList:list2
    })
    this.search_recommend();
    this.autoFocusInst.focus();
  }
  //搜索关键字
  search_recommend = () => {
    UserService.Instance.search_recommend().then((res: any) => {
        this.setState({
          recommendList:res.data.value
        })
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
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
        this.setState({
          redirectToLogin: false,
          isLoading: false,
          isscreen: false,
          valueS:value,
          types:0
        })
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
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
        this.setState({
          redirectToLogin: false,
          isscreen: false,
          isLoading: false,
          types:3
        })
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  };
  //销量排序
  sort_sales = () => {
    let params = {search:'',sort_sales_num:1};
    if(this.state.sort_sales_num == 1){
      params = {
        search:this.state.search,
        sort_sales_num:2
      }
    } else {
      params = {
        search:this.state.search,
        sort_sales_num:1
      }
    }
    this.setState({
      sort_sales_num:params.sort_sales_num
    })
    UserService.Instance.search_goods(params)
      .then((res: any) => {
        this.setState({
          redirectToLogin: false,
          isLoading: false,
          isscreen: false,
          types:1
        })
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  }
  //价格排序
  updown = () =>{
    let params = {};
    let updownchange = this.state.updownchange;
    if(this.state.updownchange){
      updownchange = false;
      params = {
        search:this.state.search,
        sort:2
      }
    } else {
      updownchange = true;
      params = {
        search:this.state.search,
        sort:1
      }
    }
    this.setState({
      updownchange,
    })
    UserService.Instance.search_goods(params)
      .then((res: any) => {
        this.setState({
          redirectToLogin: false,
          isLoading: false,
          isscreen: false,
          types:2
        })
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
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
    this.setState({
      valueS:value
    })
  };
  //跳转详情
  goDetails = (e:any)=>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:'/goodsDetails',state:{id:id}})
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
    const { redirectToLogin } = this.state;

    if (redirectToLogin) {
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
              onChange={this.onSubmit}
              ref={ref => (this.autoFocusInst = ref)}
            />
          </List>
          <div style={{ height: bodyHeight, backgroundColor: "#f5f5f5" }}>
            <div>
              <div className="padding">最近搜索</div>
              <div className="flex flex-w padding">
              {
                this.state.oldList.map((data:any)=>(
                  this.state.oldList.length == 0?<div></div>:
                  <div className="search-text bcc33 margin-r" onClick={()=>{this.onSubmit(data)}}>{data}</div>
                ))
              }
              </div>
              <div className="padding">搜索发现</div>
              <div className="flex flex-w padding">
              {
                this.state.recommendList.map((data:any)=>(
                  <div className="search-text bcc33 margin-r" onClick={()=>{this.onSubmit(data)}}>{data}</div>
                ))
              }
              </div>
            </div>
          </div>
        </div>
      );
    }
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
        <div className="index_goods bff padding margin-t" data-id={rowData.goodsid} onClick={this.goDetails}>
          <div className="flex">
            <div className="tac goods_list"><img src={rowData.img_url||goods} alt=""/></div>
            <div className="padding-l2 w100">
              <div className="fs13 c999">{rowData.type == '1'?'我要健康':'其他'}</div>
              <div className="fs18 fb">{rowData.goodsname}</div>
              <div className="fs12 c999">{rowData.content}</div>
              <div className="flex margin-tsm margin-tl">
                <div className="fs14 fb cce0 margin-rsm">¥<span className="fs22">{rowData.price}</span></div>
                <div className="fs12 c999">| 单件：¥{rowData.price}</div>
              </div>
              <div className="flex margin-tsm">
                {/* <div className="fs12 cfff bd5e padding05 margin-rsm">特价</div> */}
                <div className="fs12 c999 margin-rsm">{rowData.comment}条评价</div>
                <div className="fs12 c999">{rowData.praise}%好评</div>
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
            value={this.state.valueS}
            onSubmit={this.onSubmit}
            onChange={(v:string)=>{this.setState({valueS:v})}}
            ref={ref => (this.autoFocusInst = ref)}
          />
        </List>
        <div className="search-menu flex bff tac padding-tb">
          <div className={"w25 "+(this.state.types == 0?'cd5e':'')} onClick={this.search.bind(this,this.state.valueS)}>综合</div>
          <div className={"w25 "+(this.state.types == 1?'cd5e':'')} onClick={this.sort_sales}>销量<img className={"search-img "+(this.state.sort_sales_num == 2?'low':'')} src={this.state.types == 1?search1:search22} alt=""/></div>
          <div className={"w25 "+(this.state.types == 2?'cd5e':'')} onClick={this.updown}>价格<img className={"search-img "+(this.state.updownchange?'low':'')} src={this.state.types == 2?search1:search22} alt=""/></div>
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
