import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, List, SearchBar } from "antd-mobile";
import { History } from "history";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";
import { UserStorage } from "src/storage/UserStorage";
import defaults from "../../assets/default.png";
// import Qa1 from "../../assets/appimg/QA-1.png";
// import Qa2 from "../../assets/appimg/QA-2.png";
import test3 from "../../assets/appimg/test3.jpg";
import del from "../../assets/appimg/del.png";

interface SearcharticleProps {
  history: History;
}

interface SearcharticleState {
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
  valueS:string;
}
const bodyHeight = window.innerHeight / 100 - 0.95 + "rem";

export class Searcharticle extends React.Component<SearcharticleProps, SearcharticleState> {
  rData: any;
  lv: any;
  value: string;
  type:string;
  autoFocusInst: any;
  constructor(props: SearcharticleProps) {
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
      valueS:''
    };
  }
  componentDidMount() {
    let list = UserStorage.getStorage('searcharticle');
    let list2 = list?list.split(','):[];
    this.setState({
      oldList:list2
    })
    this.article_search_popular();
    this.autoFocusInst.focus();
  }
  //搜索关键字
  article_search_popular = () => {
    UserService.Instance.article_search_popular().then((res: any) => {
        this.setState({
          recommendList:res.data||[]
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
  // 搜索
  search = (value:string) => {
    UserService.Instance.article_search(value)
      .then((res: any) => {
        if (res.data.length != 0) {
          this.setState({
            ...this.state,
            redirectToLogin: false,
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
            isLoading: false,
            isscreen: false,
            valueS:value
          });
        }
        UIUtil.hideLoading();
      })
      .catch(err => {
        UIUtil.showError(err);
      });
  };
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
    UserStorage.setStorage('searcharticle',setList);
    this.search(value);
    this.setState({
      valueS:value
    })
  };
  delAll = () => {
    this.setState({
      oldList:[]
    })
  }
  onEndReached = (event: any) => {
    
  };
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
              onSubmit={this.onSubmit}
              ref={ref => (this.autoFocusInst = ref)}
            />
          </List>
          <div style={{ height: bodyHeight, backgroundColor: "#f5f5f5" }}>
            <div>
              <div className="padding">最近搜索<img className="simg fr" src={del} onClick={this.delAll}/></div>
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
        <div className="margin-t bff lh1" onClick={()=>{this.props.history.push({pathname:'/articleDetails',state:{datas:JSON.stringify(rowData)}})}}>
            <div className="borcccb fs18 padding flex">
                <div>{rowData.title}</div>
            </div>
            <div className="padding">
                <div className="flex flex-j-sb">
                    <div className="flex">
                        <div className="margin-rsm"><img className="headimg" src={rowData.author_head_img||defaults} alt=""/></div>
                        <div className="fs17 myname">{rowData.author}</div>
                    </div>
                    {/* <div className="flex fs10 c666">
                        <div className="margin-rsm"><img className="otherimg" src={Qa1} alt=""/>50赞</div>
                        <div><img className="otherimg" src={Qa2} alt=""/>99评论</div>
                    </div> */}
                </div>
                <div className='flex'>
                    <div className="padding-trb"><img className="contentimg" src={rowData.img_url||test3} alt=""/></div>
                    <div className="lh14">{rowData.description}</div>
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
