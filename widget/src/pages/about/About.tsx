import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, WingBlank } from "antd-mobile";
import { History, Location } from "history";
// import about from "../../assets/about.png";

import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';

interface AboutProps {
  history: History;
  location: Location;
}

interface AboutState {
  title: string;
  time: string;
  content: string;
}
let he = document.documentElement.clientHeight;
export class About extends React.Component<AboutProps, AboutState> {
  lv: any;

  constructor(props: AboutProps) {
    super(props);
    this.state = {
      title: "",
      time: "",
      content: "",
    };
  }

  onRedirectBack = () => {
    const history = this.props.history;
    history.goBack();
  };

  componentDidMount() {
    UserService.Instance.aboutus().then( (res:any) => {
      this.setState({
        title: res.data.title,
        time: res.data.time,
        content: res.data.content,
      })
      UIUtil.hideLoading()
    }).catch( err => {
        UIUtil.showError(err)
    })
  }


  public render() {
    return (
      <div className="message-container" style={{height: he, backgroundColor: '#ffffff' }}>
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">关于我们</div>
        </NavBar>
        <WingBlank>
            <div className="about_title fs24 fb" dangerouslySetInnerHTML={{__html: this.state.title}} />
            <div className="about_time fs15 padding-t c999">{this.state.time}</div>
            <div className="about_content padding-t" dangerouslySetInnerHTML={{__html: this.state.content}} />
        </WingBlank>
      </div>
    );
  }
}
