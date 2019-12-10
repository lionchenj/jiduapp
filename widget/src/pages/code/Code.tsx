import * as React from "react";
import { NavBar, Icon } from "antd-mobile";
import { History, Location } from "history";
import { UserStorage } from '../../storage/UserStorage';
import { homePage } from "src/utils/Constants";
import QRCode from "qrcode.react";
interface CodeProps {
  history: History;
  location: Location;
}

interface CodeState {
  openid: string;
  headimgurl: string;
  ImgUrl: string;
}
const pageheight = window.innerHeight - 95;
const pagewidth = window.innerWidth;
export class Code extends React.Component<CodeProps, CodeState> {
  lv: any;

  constructor(props: CodeProps) {
    super(props);

    this.state = {
      openid: "",
      headimgurl:'',
      ImgUrl:''
    };
  }

  onRedirectBack = () => {
    const history = this.props.history;
    history.goBack();
  };

  componentDidMount() {
    let user:any = UserStorage.getCookie('userInfo');
    user = JSON.parse(user);
    this.setState({
      openid:user.openid
    })
    // UserService.Instance.ceshi().then( (res:any) => {
    //   UIUtil.hideLoading()
    //   this.setState({
    //     openid: user.openid,
    //     name: user.nickname,
    //     headimgurl: user.headimgurl,
    //     ImgUrl: res.url
    //   })
    //   }).catch( err => {
    //       UIUtil.showError(err)
    //   })
  }


  public render() {
    return (
      <div className="message-container bff">
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">我的二维码</div>
        </NavBar>
        <div style={{ height: pageheight, width: pagewidth}}>
            <div className="code_bg fs14">
                <div className="padding-ts">我的二维码</div>
                <div className="QR_code">
                    <QRCode value={homePage+'?id='+this.state.openid} size={160} />
                    {/* <img src={this.state.ImgUrl} alt="" style={{width:"160px",height:"160px"}}/> */}
                </div>
            </div>
        </div>
      </div>
    );
  }
}
