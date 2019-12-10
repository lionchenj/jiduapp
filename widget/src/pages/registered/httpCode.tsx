import * as React from "react";
import { NavBar, Icon } from "antd-mobile";
import { History, Location } from "history";
import { UserStorage } from '../../storage/UserStorage';
import { homePage } from "src/utils/Constants";
import QRCode from "qrcode.react";

interface httpCodeProps {
  history: History;
  location: Location;
}

interface httpCodeState {
  openid: string;
  headimgurl: string;
  ImgUrl: string;
}
const pageheight = window.innerHeight - 95;
const pagewidth = window.innerWidth;
export class httpCode extends React.Component<httpCodeProps, httpCodeState> {
  lv: any;

  constructor(props: httpCodeProps) {
    super(props);

    this.state = {
      openid: "",
      headimgurl:'',
      ImgUrl:''
    };
  }

  onRedirectBack = () => {
    const history = this.props.history;
    history.push("/");
  };

  componentDidMount() {
    let user:any = UserStorage.getCookie('userInfo');
    user = JSON.parse(user);
  }


  public render() {
    return (
      <div className="message-container">
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">我的二维码</div>
        </NavBar>
        <div style={{ height: pageheight, width: pagewidth}}>
            <div className="code_bg fs14">
              <div className="padding-ts">请前往<span className="c066">worlgo</span>网站完善资料</div>
              <div className="QR_code">
                  <QRCode value={homePage} size={160} />
                  {/* <img src={this.state.ImgUrl} alt="" style={{width:"160px",height:"160px"}}/> */}
              </div>
            </div>
        </div>
      </div>
    );
  }
}
