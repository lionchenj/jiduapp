import * as React from 'react';
import { NavBar, Icon} from "antd-mobile";
import { History } from "history";
// / <reference path="node.d.ts"/>
// import * as URL from "url";
// let myUrl = URL.parse("http://www.365webcall.com/IMMe2.aspx?settings=mw7mw6bm7PXwX6z3A7NwINz3AINNPz3A66mmPX&LL=0");

// import { UIUtil } from '../../utils/UIUtil';

// import copy from 'copy-to-clipboard';

// import "./Activate.css"
// import { UserService } from '../../service/UserService';
// import { UIUtil } from '../../utils/UIUtil';
// import { model } from '../../model/model';
// import iconExchange from "../../assets/icon_exchange.png"


interface CustomerProps {
    history: History
}


interface CustomerState {
    types:number,
    address:string,
    cardList:any
}
let width = window.innerWidth;
let height = window.innerHeight - 45;

export class Customer extends React.Component<CustomerProps, CustomerState> {
    customer:string

    constructor(props: CustomerProps) {
        super(props);
        this.state = {
            address:'',
            types:3,
            cardList:[]
        };
        
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    
    componentDidMount() {
        

    }

    public render() {
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">客服</div>
                </NavBar>
                <div className="iframe-tab-1" style={{ height: height, width: width}}>
                    <iframe src="https://ziker-talk.yun.pingan.com/appIm?style=H5&channel=APPIM&authorizerAppid=appimc283aec44342e0a&eid=8b30534669fa6be7b9ff9fa790ff4c4e"
                            height={height}
                            width={width}
                            scrolling="0"
                    ></iframe>
                </div>
            </div>
            
        )
    }
}