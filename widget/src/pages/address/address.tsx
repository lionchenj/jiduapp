import * as React from 'react';

import { NavBar, Icon, List, ListView, SwipeAction, WhiteSpace,Toast} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';
// import { UserStorage } from "../../storage/UserStorage";
import { UIUtil } from 'src/utils/UIUtil';


// var changeL = UserStorage.getCookie('UserStorage');

interface addressProps {
    history: History,
    location: Location
}

interface addressState {
    height: number,
    isLoading: boolean,
    dataSource: any,
    num: number,
}

export class address extends React.Component<addressProps, addressState> {
    lv:any
    constructor(props: addressProps) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
        this.state = {
            height:  document.documentElement.clientHeight - 200,
            dataSource,
            isLoading: true,
            num: 0
        }
    }
    public componentDidMount () {
        this.getaddress();
    }
    onRedirectBack = () => {
        const history = this.props.history
        this.state.num!=0?history.goBack():history.push("/");
    }
    onEndReached = (event:any) => {
        if (this.state.isLoading) {
          return;
        }
    }
    getaddress = () => {
        UserService.Instance.my_address().then( (res:any) => {
            res.data.map((data:any)=>{
                if(data.default == '1')
                window.localStorage.setItem('add',data.province+data.city+data.county+data.address)
            })
            this.setState({
                dataSource: this.state.dataSource.cloneWithRows(res.data),
                isLoading: false,
                num:res.data.length
            })
            if(res.data.length == 0){
                UIUtil.showInfo("请添加地址");
                return;
            }
        }).catch( err => {
            const message = (err as Error).message
            Toast.fail(message)
        })
    }
    public render() {
        const separator = (sectionID: number, rowID: number) => (
            <div
              key={`${sectionID}-${rowID}`}
              style={{
                backgroundColor: '#F5F5F5',
                height: 1,
              }}
            />
          );
  
          const row = (rowData: any, sectionID: number, rowID: number) => {
            return (
                <SwipeAction
                    style={{ backgroundColor: 'gray' }}
                    autoClose
                    right={[
                        {
                        text: '编辑',
                        onPress: () => { this.props.history.push({pathname:"/modifyAddress",state:{id:rowData.id,data:rowData}}) }, style: { backgroundColor: '#F4333C', color: 'white' },},
                    ]}
                    >
                    <List.Item className='ddress-footer-button-container' extra={rowData.default == 1?<div className="bd5e cfff padding05 w20 fr">默认</div>:''}>
                        {rowData.name + ' ' + rowData.mobile}<List.Item.Brief>{rowData.province+rowData.city+rowData.county+rowData.address} </List.Item.Brief>
                    </List.Item>
                </SwipeAction>
            );
          };
        return (
            <div className="">
                <NavBar icon={<Icon type="left" />} 
                    onLeftClick={ this.onRedirectBack}
                    rightContent={[
                        <div key="1" className="address-navbar-right" onClick={()=>this.props.history.push("/addAddress")}>+</div>
                    ]}
                    className="home-navbar" >
                        <div className="nav-title">我的地址</div>
                </NavBar>
                <WhiteSpace size="lg"/>
                <div className="">
                    <ListView 
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? 'Loading...' : ''}
                            </div>)}
                            renderRow={row}
                            renderSeparator={separator}
                            className="am-list"
                            pageSize={4}
                            // useBodyScroll
                            scrollRenderAheadDistance={500}
                            onEndReached={this.onEndReached}
                            onEndReachedThreshold={10}
                            style={{
                                height: this.state.height,
                                overflow: 'auto',
                            }}
                        />
                </div>
            </div>
        )
    }
}