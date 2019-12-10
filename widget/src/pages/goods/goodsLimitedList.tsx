import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, Progress } from "antd-mobile";
import { History,Location } from "history";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";


interface goodsLimitedListProps {
  history: History;
  location:Location;
}

interface goodsLimitedListState {
  id: string;
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
  timeLimitColumnList: Array<model.TimeLimitColumn>
  currentColumnId: number,
  timeLimitGoodsList: Array<model.TimeLimitGoods>
  couponid:string

}
const bodyHeight = window.innerHeight / 100 - 1.35 + "rem";

export class goodsLimitedList extends React.Component<goodsLimitedListProps, goodsLimitedListState> {
  rData: any;
  lv: any;
  value: string;
  type: string;
  autoFocusInst: any;
  constructor(props: goodsLimitedListProps) {
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
      id: '1',
      timeLimitColumnList: [],
      currentColumnId: 0,
      timeLimitGoodsList: [],
      couponid:''
    };
  }
  componentDidMount() {
    if(this.props.location.state){
      this.setState({
        couponid:this.props.location.state.couponid
      })
      if(this.props.location.state.id){
        this.setState({
          currentColumnId:this.props.location.state.id
        })
      }
    }
    this.loadData()
  }
  //搜索关键字
  search_recommend = () => {
    UserService.Instance.search_recommend().then((res: any) => {
      this.setState({
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

  //跳转详情
  goDetails = (e: any) => {
    let id = e.currentTarget.dataset.id;
    this.props.history.push({ pathname: '/goodsDetails', state: { id: id,couponid:this.state.couponid } })
  }
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

  onClickColumn = (columnId: number) => {
    console.warn("onClickColumn", columnId)
    const currentColumnId = this.state.currentColumnId
    if (currentColumnId == columnId) {
      return
    }
    this.setState({
      currentColumnId: columnId
    })
    this.loadTimeLimitGoodsList(columnId)
  }
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

    const row = (rowData: model.TimeLimitGoods, sectionID: number, rowID: number) => {
      return (
        <div className="index_goods bff padding margin-t" key={rowData.goodsid} data-id={rowData.goodsid} onClick={this.goDetails}>
          <div className="flex">
            <div className="tac goods_list"><img src={rowData.img_url} alt="" /></div>
            <div className="padding-l2 w100">
              <div className="flex">
                <div className="fs16 fb">{rowData.goodsname}</div>
              </div>
              <div className="fs12 c999 margin-t">{rowData.description}</div>
              <div className="flex">
                <div className="fs13 cd5e bord5e padding-lr margin-tsm">{rowData.price_scale}折</div>
              </div>
              <div className="flex flex-j-sb flex-a-end margin-t-01">
                <div className="w40 lh1">
                  <span className="cf11 fs14">¥<span className="cf11 fs22">{rowData.price}</span></span>
                  <span className="td fs10 cada">¥{rowData.original_price}</span>
                </div>
                <div className="flex w80 flex-a-end flex-j-end">
                  <div >
                    <div className="padding-xl tac br bd5e cfff" onClick={() => { this.props.history.push('/goodsLimitedDetails') }}>马上抢</div>
                    <div className="margin-tb05"><Progress percent={rowData.stock_scale} position="normal" /></div>
                    <div className="fs10 cada margin-rsm">仅剩{rowData.residue_stock}件</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    };
    const { timeLimitColumnList, currentColumnId } = this.state

    const timeLimitColumnListUI = timeLimitColumnList.map((timeLimitColunm) =>

      <div key={timeLimitColunm.id} className={"w12  tac padding " + (timeLimitColunm.id == currentColumnId ? 'bd5e cfff' : '')} onClick={this.onClickColumn.bind(this, timeLimitColunm.id)}>
        <div>{timeLimitColunm.title}</div>
        {timeLimitColunm.status == 1 && <div>抢购中</div>}
        {timeLimitColunm.status == 2 && <div>即将开抢</div>}
        {timeLimitColunm.status == -1 && <div>已开抢</div>}
      </div >
    )

    return (
      <div className="message-container friendsLog">
        <NavBar
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">限时购</div>
        </NavBar>
        <div className="search-menu bff tac news_goods">

          {timeLimitColumnListUI}

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

  private loadData = () => {
    UserService.Instance.getTimeLimitColumn().then((timeLimitColumnList) => {
      this.setState({
        timeLimitColumnList: timeLimitColumnList
      })
      if (timeLimitColumnList.length == 0) {
        return
      }
      let activityId = timeLimitColumnList[0].id
      for (const timeLimitColunm of timeLimitColumnList) {
        if (timeLimitColunm.status == 1) {
          activityId = timeLimitColunm.id
          break
        }
      }
      this.setState({
        currentColumnId: activityId
      })
      UserService.Instance.getTimeLimitGoodsList(activityId, 1).then(rsp => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rsp.goodsList)
        })
      })
    }).catch(err => {
      UIUtil.showError(err)
    })
  }

  private loadTimeLimitGoodsList(id:number) {
    const activityId = id;
    UserService.Instance.getTimeLimitGoodsList(activityId, 1).then(rsp => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(rsp.goodsList)
      })
    })
  }
}
