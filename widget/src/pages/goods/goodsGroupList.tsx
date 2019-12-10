import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, Progress } from "antd-mobile";
import { History } from "history";
import { UserService } from "../../service/UserService";
// import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";
// import goods from "../../assets/appimg/good1.png";

interface goodsGroupListProps {
  history: History;
}

interface goodsGroupListState {
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
}
const bodyHeight = window.innerHeight / 100 - 0.45 + "rem";

export class goodsGroupList extends React.Component<goodsGroupListProps, goodsGroupListState> {
  rData: any;
  lv: any;
  value: string;
  type:string;
  autoFocusInst: any;
  constructor(props: goodsGroupListProps) {
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
    };
  }
  componentDidMount() {
    this.loadGroupGoodsList();
  }
  private loadGroupGoodsList() {
    UserService.Instance.index_goods_group().then((rsp:any) => {
      this.setState({
        // dataSource: this.state.dataSource.cloneWithRows(rsp.goodsList)
        dataSource: this.state.dataSource.cloneWithRows(rsp.data.data)
      })
    })
  }

  onRedirectBack = () => {
    this.props.history.push("/");
  };
  //跳转详情
  goDetails = (e:any)=>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:'/goodsGroupDetails',state:{id:id}})
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
        // <div className="index_goods bff padding margin-t" key={rowData.goods_id} data-id={rowData.goods_id} onClick={this.goDetails}>
        <div className="index_goods bff padding margin-t" key={rowData.goodsid} data-id={rowData.goodsid} onClick={this.goDetails}>
          <div className="flex">
            <div className="tac goods_list"><img src={rowData.img_url} alt="" /></div>
            <div className="padding-l1 w100 flex-no flex-w">
              <div className="flex w100">
                <div className="fs16 fb"><span className="fs13 cd5e bord5e padding-lr margin-rs">{rowData.user_number}人团</span>{rowData.goodsname}</div>
              </div>
              <div className="fs12 h40 c999 margin-t margin-b">{rowData.description}</div>
              <div className="w100 flex flex-j-sb flex-a-end">
                <div className="w40 lh1">
                  <span className="cf11 fs14">¥<span className="cf11 fs20">{rowData.price.price}</span></span>
                  <span className="td fs10 cada">¥{rowData.price.original_price}</span>
                </div>
                <div className="flex w80 flex-a-end flex-j-end">
                  <div >
                    <div className="padding051 tac br bd5e cfff">去拼团</div>
                    <div className="margin-tb05"><Progress percent={rowData.stock_scale} position="normal" /></div>
                    <div className="fs10 cada margin-rsm">仅剩{rowData.price.groups_residue_stock}件</div>
                  </div>
                </div>
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
          <div className="nav-title">团购商品</div>
        </NavBar>
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
