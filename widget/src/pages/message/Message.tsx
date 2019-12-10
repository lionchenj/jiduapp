import * as React from 'react';
import ReactDOM from "react-dom";
import { NavBar, Icon, ListView} from "antd-mobile";
import { History, Location } from "history";


import "./Message.css"
import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { model } from '../../model/model';
const pagewidth = window.innerWidth;

interface MessageProps {
    history: History,
    location: Location
}


interface MessageState {
    dataSource: any,
    isLoading: boolean,
    hasMore: boolean,
    height: number,
    isonline:boolean;
}



export class Message extends React.Component<MessageProps, MessageState> {
 
    lv: any

    constructor(props: MessageProps) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.myMsg, row2: model.myMsg) => row1 !== row2,
          });
          this.state = {
            dataSource,
            isLoading: true,
            hasMore: false,
            height:  document.documentElement.clientHeight - 200,
            isonline: false
          };
    }

    componentDidMount() {
      UserService.Instance.system_bulletin().then( (res:any) => {
          const offsetTop = (ReactDOM.findDOMNode(this.lv)!.parentNode! as HTMLElement).offsetTop
          const hei = document.documentElement.clientHeight - offsetTop
          this.setState({
              dataSource: this.state.dataSource.cloneWithRows(res.data.list),
              isLoading: false,
              hasMore: false,
              height: hei,
          })
        }).catch( err => {
          this.setState({
              isLoading: false,
              hasMore: false,
          })
          UIUtil.showError(err)
        })
    }
    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }
    //跳详情
    goDetails = (e:any) => {
      // UserService.Instance.Messageread(e.currentTarget.dataset.id).then( (res:any) => {})
      // let orderid = e.currentTarget.dataset.orderid;
      // this.props.history.push({ pathname:"/questionDetails", state:{ orderid:orderid }});
      
    }
    //读消息
    readmsg = (e:any) =>{
      UserService.Instance.read_message(e.id,1).then( (res:any) => {
        this.props.history.push({pathname:'/notice',state:{data:e}})
      }).catch( err => {
        
        UIUtil.showError(err)
      })
    }
      onEndReached = (event:any) => {
        // load new data
        // hasMore: from backend data, indicates whether it is the last page, here is false
   
      }

    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#f2f2f2',
                height: 1,
                // borderTop: '1px solid #ECECED',
                // borderBottom: '1px solid #ECECED',
              }}
            />
          );

          const row = (rowData: model.myMsg, sectionID: number, rowID: number) => {
            return (
              <div className="padding bff" style={{width:(pagewidth*0.01-0.3)*100}} onClick={this.readmsg.bind(this,rowData)} >
                <div className="flex flex-j-sb">
                  <div className='w75'>
                    <div className="fs16 text-p">{rowData.title}</div>
                    <div className="c999 fs14 margin-tsm text-p">{rowData.describe}</div>
                  </div>
                  <div>
                    <div className="c999 fs14">{rowData.create_time.split(' ')[0]}</div>
                    <div className={"tar fs14 margin-tsm "+(rowData.is_read==0?'domred':'')}></div>
                  </div>
                </div>
              </div>
              // <List className="w100">
              //   <List.Item 
              //   extra={rowData.update_time.split(' ')[0]} align="top" 
              //   thumb="https://zos.alipayobjects.com/rmsportal/dNuvNrtqUztHCwM.png" multipleLine>
              //     {rowData.title} <List.Item.Brief>{rowData.describe}</List.Item.Brief>
              //   </List.Item>
              // </List>
            );
          };


        return (
            <div className="message-container">
                <NavBar  icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    className="home-navbar" >
                        <div className="nav-title">消息中心</div>
                </NavBar>
                <ListView
                    ref={el => this.lv = el}
                    dataSource={this.state.dataSource}
                    renderFooter={() => (<div className={this.state.isLoading ? '' : 'none'} style={{ padding: 30, textAlign: 'center' }}>
                    {this.state.isLoading ? '加载中' : ''}
                    </div>)}
                    renderRow={row}
                    renderSeparator={separator}
                    className="am-list"
                    pageSize={4}
                    scrollRenderAheadDistance={500}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={10}
                    style={{
                        width:pagewidth,
                        height: this.state.height,
                        overflow: 'auto',
                    }}
                />
            </div>
        )
    }
}