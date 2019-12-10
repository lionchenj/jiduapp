import * as React from "react";
import { NavBar, Icon, List, WhiteSpace} from "antd-mobile";
import { History, Location } from "history";
import { UIUtil } from '../../utils/UIUtil';
import { UserService } from "src/service/UserService";
import logistics1 from "../../assets/appimg/logistics1.png";
import logistics2 from "../../assets/appimg/logistics2.png";
// let datalist = {
//         "traces": {
//             "codeName": "邮政快递包裹",
//             "traces_number": "9895750327796",
//             "state": 3
//         },
//         "traces_date": {
//             "LogisticCode": "9895750327796",
//             "ShipperCode": "YZPY",
//             "Traces": [
//                 {
//                     "AcceptStation": "【姜堰大宗邮件收寄中心】已收件,揽投员:王正德13805268798",
//                     "AcceptTime": "2019-07-05 09:58:28"
//                 },
//                 {
//                     "AcceptStation": "离开【姜堰大宗邮件收寄中心】，下一站【姜堰车间】",
//                     "AcceptTime": "2019-07-05 11:27:08"
//                 },
//                 {
//                     "AcceptStation": "到达【泰州市姜堰区转运站】",
//                     "AcceptTime": "2019-07-05 15:11:44"
//                 },
//                 {
//                     "AcceptStation": "离开【姜堰大宗邮件收寄中心】，下一站【姜堰车间】",
//                     "AcceptTime": "2019-07-05 19:29:50"
//                 },
//                 {
//                     "AcceptStation": "离开【泰州市辅助邮区中心局】，下一站【江高中心】",
//                     "AcceptTime": "2019-07-06 01:02:12"
//                 },
//                 {
//                     "AcceptStation": "到达【江高中心】",
//                     "AcceptTime": "2019-07-07 05:17:49"
//                 },
//                 {
//                     "AcceptStation": "离开【江高中心】，下一站【汇侨投递部】",
//                     "AcceptTime": "2019-07-07 21:31:56"
//                 },
//                 {
//                     "AcceptStation": "到达【汇侨投递部】",
//                     "AcceptTime": "2019-07-08 07:33:39"
//                 },
//                 {
//                     "AcceptStation": "【汇侨投递部】安排投递,投递员:黄富俭:18664693710",
//                     "AcceptTime": "2019-07-08 09:00:15"
//                 },
//                 {
//                     "AcceptStation": "【汇侨投递部】投递结果反馈-未妥投,备注(未联系上收件人，安排再投),投递员:黄富俭:18664693710",
//                     "AcceptTime": "2019-07-08 18:26:04"
//                 },
//                 {
//                     "AcceptStation": "【汇侨投递部】安排投递,投递员:朱明:18665047000",
//                     "AcceptTime": "2019-07-09 08:13:27"
//                 },
//                 {
//                     "AcceptStation": "已签收,其他：中心商店,投递员:朱明:18665047000",
//                     "AcceptTime": "2019-07-09 10:55:46"
//                 }
//             ],
//             "State": "3",
//             "EBusinessID": "1463603",
//             "Success": true
//         }
// }
interface logisticsProps {
  history: History;
  location: Location;
}

interface logisticsState {
    wuliu:any;
    order:any;
    datas:any;
}
const bodyHeight = (window.innerHeight/100 - 0.45) + 'rem';
export class logistics extends React.Component< logisticsProps, logisticsState> {
  constructor(props: logisticsProps) {
    super(props);
    this.state = {
        wuliu:[],
        order:[],
        datas:[]
    };
  }
  componentDidMount() {
    if(!this.props.location.state){
        this.props.history.push({pathname:"/order",state:{type:0}})
        return;
    }
    let data = this.props.location.state.data;
    data = JSON.parse(data);
    this.setState({
        datas:data
    })
    this.get_logistic(data.id);
  }
  onRedirectBack = () => {
    this.props.history.push({pathname:'/orderDetails',state:{data:JSON.stringify(this.state.datas)}})
  };
  get_logistic = (id:string) => {
    UserService.Instance.get_logistic(id).then((res:any) => {
        let list = [];
        for (let i = res.data.traces_date.Traces.length; i > 0; i--) {
            list.push(res.data[i]);
        }
      this.setState({
        order:res.data,
        wuliu:list
      })
    UIUtil.hideLoading()
    }).catch(err => {
      this.setState({
        wuliu:err.message
      })
      UIUtil.hideLoading()  
    });
}
  public render() {
    return (
        <div className="message-container">
            <NavBar icon={<Icon type="left" />}
                onLeftClick={this.onRedirectBack}
                className="home-navbar" >
                <div className="nav-title">物流信息</div>
            </NavBar>
            <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
                <List >
                    <div className="flex">
                        <div className="tac steps_goods"><img src={this.state.datas.param&&this.state.datas.param.goods.img_url} alt=""/></div>
                        <div className="padding-l2 w100 fs12 c999">
                            <div className="">物流状态：{
                                this.state.order.traces&&this.state.order.traces.state == 0?'无轨迹':
                                this.state.order.traces&&this.state.order.traces.state == 1?'已揽收': 
                                this.state.order.traces&&this.state.order.traces.state == 2?'在途中':
                                this.state.order.traces&&this.state.order.traces.state == 201?'到达派件城市':
                                this.state.order.traces&&this.state.order.traces.state == 3?'签收':
                                this.state.order.traces&&this.state.order.traces.state == 4?'问题件':'未有物流信息'
                                }</div>
                            <div className="margin-t">快递公司：{this.state.order.traces&&this.state.order.traces.codeName}</div>
                            <div className="margin-t">订单编号：{this.state.order.traces&&this.state.order.traces.traces_number}</div>
                        </div>
                    </div>
                </List>
                <WhiteSpace/>
                <div className="padding">
                    {
                        this.state.wuliu.traces_date&&this.state.wuliu.traces_date.Traces.map((data:any,index:number)=>(
                            <div className={"h60 pr fs14 flex-no steps " + (index==0?'cd5e':'c999')}>
                                <div className="margin-r pr">
                                    <div className={"stepsimg " + (index==0?'imgb':'imgs')}><img src={index==0?logistics1:logistics2}/></div>
                                    <div className={this.state.wuliu.traces_date&&this.state.wuliu.traces_date.Traces.length == index+1?'none':index==0?'steps1':'steps2'}></div>
                                </div>
                                <div>
                                    <div className="stepstitle">{data.AcceptStation}</div>
                                    <div className="stepstime">{data.AcceptTime}</div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
}