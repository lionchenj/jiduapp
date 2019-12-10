import * as React from "react";

import {
  NavBar,
  Icon,
  Button,
} from "antd-mobile";
import { History, Location } from "history";
import { JSONS } from '../../utils/json';

interface protocolProps {
  history: History;
  location: Location;
}

interface protocolState {
  title:string
}
export class protocol extends React.Component<protocolProps,protocolState> {
  registerData:string
  code:string
  codeCountDownTimer:number
  constructor(props: protocolProps) {
    super(props);
    this.codeCountDownTimer = 0
    this.state = {
      title:''
    };
  }

    onRedirectBack = () => {
        this.props.history.push("/")
    }
    public componentDidMount() {
      let data = JSONS.protocol();
      this.setState({
        title:data[1].title,
      })
    }
    onSubmit = () => {
        this.props.history.push("/httpCode")
    }
  public render() {
    return (
      <div className="address-container registered">
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">注册协议</div>
        </NavBar>
        <div className="protocol_content"></div>
        <div className="protocol_ps fs"><span>*</span>{this.state.title}</div>
        <div className="protocol_checkbox"><input type="checkbox" name="pro" id=""/>我确认完全理解并同意本网站的服务协议。</div>
        <div className="address-footer-button-container question_btn padding-t">
            <Button type="primary" onClick={this.onSubmit}>接受</Button>
        </div>
        <div className="address-footer-button-container question_btn padding-t">
            <Button type="primary" onClick={this.onSubmit}>拒绝</Button>
        </div>
      </div>
    );
  }
}
