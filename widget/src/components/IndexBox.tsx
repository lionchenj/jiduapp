import * as React from 'react';
import { History } from "history";
export interface IndexboxViewProps {
    datas: any,
    history: History,
}

export interface IndexboxViewState {
    beginDate:any,
    newgoods:any,
    limitedgoods:any,
    groupgoods:any,
    isOne:boolean,
}

export default class IndexboxView extends React.Component<IndexboxViewProps, IndexboxViewState> {
  private interval: number;
    constructor(props: IndexboxViewProps) {
        super(props);

        this.state = {
            beginDate:'',
            newgoods:'',
            limitedgoods:'',
            groupgoods:'',
            isOne:false,
        }
    }
    componentWillReceiveProps() {
        const data = this.props.datas
        if(data.length == 1){
            this.setState({
                isOne:true
            })
        }
        for (let i = 0; i < data.length; i++) {
            if(data[i].title == '新品'){
                this.setState({
                    newgoods:data[i]
                })
            }
            if(data[i].title == '限时购'){
                this.setState({
                    limitedgoods:data[i]
                })
                this.downtime(data[i].start_time)
            }
            if(data[i].title == '团购'){
                this.setState({
                    groupgoods:data[i]
                })
            }
        }
    }
    componentWillUnmount() {
        this.stop()
    }
    stop = () => {
      window.clearInterval(this.interval)
    }
    //倒计时
    downtime = (times:number) => {
      this.interval = window.setInterval(() => {
        let startDate = times*1000;
        let now = new Date();
        let diff = (startDate - now.getTime()) / 1000
        if (diff <= 0) {
            this.stop()
            return;
        }
        const leftHours = Math.floor(diff / (60 * 60))
        diff = diff - leftHours * (60 * 60)
        const leftMin = Math.floor(diff / 60)
        diff = diff - leftMin * 60
        const leftSecond = Math.floor(diff)
        const thistime = (leftHours==0?'00':leftHours<10?"0"+leftHours:leftHours)+':'+(leftMin==0?'00':leftMin<10?"0"+leftMin:leftMin)+':'+(leftSecond==0?'00':leftSecond<10?"0"+leftSecond:leftSecond);
        this.setState({
            beginDate:thistime
        })
    }, 1000)
            
    }
    public render() {
        return (
            <div className="index_activity bff Grid margin-tsm padding">
                  <div className={"flex " + (this.state.isOne?'none':'')}>
                    <div className={"indexbox w50 h100 " + (this.state.limitedgoods == ''?'none':'')}>
                      <div onClick={()=>{this.props.history.push({pathname:"/goodsLimitedList",state:{id:this.state.limitedgoods&&this.state.limitedgoods.activity_id}})}}>
                        <span className="fs16">限时购:</span>
                        <span className="fs12 margin-ls cfff bce0 padding-lr">{this.state.beginDate}</span>
                        <span className="margin-ls fs10 c101 cd5e">{this.state.limitedgoods&&this.state.limitedgoods.hour}点场</span>
                      </div>
                      <div className="flex flex-j-sb padding-t w80ma">
                        {this.state.limitedgoods&&this.state.limitedgoods.data.map((data:any,index:number)=>(
                          index > 1?'':
                          <div onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                            <div className="index-goods"><img src={data.img_url} alt=""/></div>
                            <div className="tac">
                              <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                              <div className="cred fs13 margin-tsm">¥{data.price}</div>
                              <div className="td fs10 cada">¥{data.original_price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={"indexbox w50 h100 " + (this.state.newgoods == ''?'none':'')}>
                      <div className="fs20 margin-l">新品</div>
                      <div className="flex flex-j-sb padding-t w80ma">
                        {this.state.newgoods&&this.state.newgoods.data.map((data:any,index:number)=>(
                          index>1?'':
                          <div onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                            <div className="index-goods"><img src={data.img_url} alt=""/></div>
                            <div className="tac">
                              <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                              <div className="cred fs13 margin-tsm">¥{data.price}</div>
                              <div className="td fs10 cada">¥{data.original_price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className={"indexbox w50 h100 " + (this.state.groupgoods == ''?'none':'')}>
                      <div className="fs20 margin-l">团购</div>
                      <div className="flex flex-j-sb padding-t w80ma">
                        {this.state.groupgoods&&this.state.groupgoods.data.map((data:any,index:number)=>(
                          index>1?'':
                          <div onClick={()=>{this.props.history.push({pathname:'/goodsGroupDetails',state:{id:data.goodsid}})}}>
                            <div className="index-goods"><img src={data.img_url} alt=""/></div>
                            <div className="tac">
                              <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                              <div className="cred fs13 margin-tsm">¥{data.price}</div>
                              <div className="td fs10 cada">¥{data.original_price}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className={"flex " + (this.state.isOne?'':'none')}>
                    <div className={"w100 h100 " + (this.state.limitedgoods == ''?'none':'')}>
                      <div onClick={()=>{this.props.history.push({pathname:"/goodsLimitedList",state:{id:this.state.limitedgoods&&this.state.limitedgoods.activity_id}})}}>
                        <span className="fs16">限时购:</span>
                        <span className="margin-ls cfff bce0 padding-lr">{this.state.beginDate}</span>
                        <span className="margin-ls fs10 c101 cd5e">{this.state.limitedgoods&&this.state.limitedgoods.hour}点场</span>
                      </div>
                      <div className="flex flex-j-sb padding-t news_goods tac">
                        {
                          this.state.limitedgoods&&this.state.limitedgoods.data.map((data:any,index:number)=>(
                            index>3?"":
                            <div className="w25" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                                <div className="index-goods"><img src={data.img_url} alt=""/></div>
                                <div className="">
                                  <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                                  <div className="cred fs13 margin-tsm">¥{data.price}</div>
                                  <div className="td fs10 cada">¥{data.original_price}</div>
                                </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className={"w100 h100 " + (this.state.newgoods == ''?'none':'')}>
                      <div className="fs20 margin-l">新品</div>
                      <div className="flex flex-j-sa padding-t index_box_goods tac">
                        {
                          this.state.newgoods&&this.state.newgoods.data.map((data:any,index:number)=>(
                            index>3?"":
                            <div className="w25" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                                <div className="index-goods"><img src={data.img_url} alt=""/></div>
                                <div className="">
                                  <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                                  <div className="cred fs13 margin-tsm">¥{data.price}</div>
                                  <div className="td fs10 cada">¥{data.original_price}</div>
                                </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className={"w100 h100 " + (this.state.groupgoods == ''?'none':'')}>
                      <div className="fs20 margin-l">团购</div>
                      <div className="flex flex-j-sa padding-t index_box_goods tac">
                        {
                          this.state.groupgoods&&this.state.groupgoods.data.map((data:any,index:number)=>(
                            index>3?"":
                            <div className="w25" onClick={()=>{this.props.history.push({pathname:'/goodsGroupDetails',state:{id:data.goodsid}})}}>
                              <div className="index-goods"><img src={data.img_url} alt=""/></div>
                              <div className="">
                                <div className="c333 fs10 margin-tsm index_box_googds">{data.goodsname}</div>
                                <div className="cred fs13 margin-tsm">¥{data.price}</div>
                                <div className="td fs10 cada">¥{data.original_price}</div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
        );
    }
}
