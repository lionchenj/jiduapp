import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView } from "antd-mobile";
import { History } from "history";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import { model } from "../../model/model";
import QAicon from "../../assets/appimg/QAicon.png";
import defaults from "../../assets/default.png";
// import Qa1 from "../../assets/appimg/QA-1.png";
// import Qa2 from "../../assets/appimg/QA-2.png";
// import test3 from "../../assets/appimg/test3.jpg";
import repository2 from "../../assets/appimg/repository2.png";

interface QandanswersProps {
  history: History;
}

interface QandanswersState {
  height: number;
  dataSource: any;
  isLoading: boolean;
  hasMore: boolean;
  page: number;
  total_num: number;
  list_num: number;
  QAList: any;
}
const bodyHeight = window.innerHeight / 100 - 0.95 + "rem";

export class Qandanswers extends React.Component<QandanswersProps, QandanswersState> {
  lv: any;
  constructor(props: QandanswersProps) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (
        row1: model.TransactionItem,
        row2: model.TransactionItem
      ) => row1 !== row2
    });
    this.state = {
      height: document.documentElement.clientHeight - 200,
      dataSource,
      isLoading: false,
      hasMore: false,
      page: 1,
      total_num: 1,
      list_num: 1,
      QAList:[]
    };
  }
  componentDidMount() {
    this.question_answer_list();
  }
  //问题列表
  question_answer_list = () => {
    UserService.Instance.question_answer().then((res: any) => {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(res.data.data),
            isLoading: false
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
  goDetails = (e:any)=>{
    let id = e.currentTarget.dataset.id;
    this.props.history.push({pathname:'/goodsDetails',state:{id:id}})
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
        <div className="margin-t bff lh1" onClick={()=>{this.props.history.push({pathname:'/QandanswersDetails',state:{datas:JSON.stringify(rowData)}})}}>
            <div className="borcccb fs18 padding flex">
                <img className="titleimg margin-rsm" src={QAicon} alt=""/>
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
                    <div className="padding-trb"><img className="contentimg" src={rowData.img_url} alt=""/></div>
                    <div className="lh14">{rowData.description}</div>
                </div>
            </div>
        </div>
      )
    };
    return (
      <div className="message-container friendsLog">
        <div className="fixed999 QAimg" onClick={()=>{this.props.history.push('/Qandanswersput')}}><img src={repository2} alt=""/></div>
        <NavBar
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">问答</div>
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
