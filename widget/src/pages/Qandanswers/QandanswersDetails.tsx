import * as React from "react";
import { NavBar, Icon } from "antd-mobile";
import { History, Location } from "history";
import defaults from "../../assets/default.png";
import QAicon from "../../assets/appimg/QAicon.png";

interface QandanswersDetailsProps {
  history: History;
  location: Location;
}

interface QandanswersDetailsState {
    datas:any;
    indexgoodslist:any;
    iscollection:boolean;
}
let he = document.documentElement.clientHeight;
export class QandanswersDetails extends React.Component<QandanswersDetailsProps, QandanswersDetailsState> {
    constructor(props: QandanswersDetailsProps) {
        super(props);
        this.state = {
        datas:{},
        indexgoodslist:[],
        iscollection:false
        };
    }
    componentDidMount() {
      if(!this.props.location.state){
        this.props.history.goBack();
        return;
      }
        let data = this.props.location.state.datas;
        data = JSON.parse(data);
        this.setState({
            datas:data,
            indexgoodslist:data.goods,
            iscollection:data
        })
    }
    onRedirectBack = () => {
        const history = this.props.history;
        history.goBack();
    };

  public render() {
    return (
      <div className="message-container" style={{height: he, backgroundColor: '#ffffff' }}>
        <NavBar
          // 
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">问题详情</div>
        </NavBar>
            <div className="borcccb fs18 padding flex">
                <img className="titleimg margin-rsm" src={QAicon} alt=""/>
                <div>{this.state.datas.title}</div>
            </div>
            <div className="flex padding">
                <div className="margin-rsm"><img className="headimg" src={this.state.datas.author_head_img||defaults} alt=""/></div>
                <div className="fs17 myname">{this.state.datas.author}</div>
            </div>
            <div className="article-content bff fs16 padding html_content" dangerouslySetInnerHTML={{__html: this.state.datas.content}} />
      </div>
    );
  }
}
