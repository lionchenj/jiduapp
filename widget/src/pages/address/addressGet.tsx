import * as React from 'react';

import { NavBar, List, ListView, WhiteSpace,Toast} from "antd-mobile";
import { History, Location } from "history";
import { UserService } from '../../service/UserService';
import { model } from '../../model/model';
// import { UserStorage } from "../../storage/UserStorage";
import { UIUtil } from 'src/utils/UIUtil';


// var changeL = UserStorage.getCookie('UserStorage');

interface addressGetProps {
    history: History,
    location: Location
}

interface addressGetState {
    height: number,
    isLoading: boolean,
    dataSource: any,
    type: number,
    data:any
}

export class addressGet extends React.Component<addressGetProps, addressGetState> {
    lv:any
    constructor(props: addressGetProps) {
        super(props)
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: model.TransactionItem, row2: model.TransactionItem) => row1 !== row2,
          });
        this.state = {
            height:  document.documentElement.clientHeight - 200,
            dataSource,
            isLoading: true,
            type: 1,
            data:{}
        }
    }
    public componentDidMount () {
        if(this.props.location.state){
            let type = this.props.location.state.type;
            let data = {}
            if(type == 1){
                data['freight'] = this.props.location.state.freight,
                data['goodsid'] = this.props.location.state.goodsid,
                data['img_url'] = this.props.location.state.img_url,
                data['goodsname'] = this.props.location.state.goodsname,
                data['goodssize'] = this.props.location.state.goodssize,
                data['goodssizeid'] = this.props.location.state.goodssizeid,
                data['numValue'] = this.props.location.state.numValue,
                data['price'] = this.props.location.state.price,
                data['couponid'] = this.props.location.state.couponid
            }
            if(type == 2){
                data['datas'] = this.props.location.state.datas;
                data['goodssizeid'] = this.props.location.state.goodssizeid;
                data['goodsnum'] = this.props.location.state.goodsnum;
                data['numValue'] = this.props.location.state.numValue;
                data['price'] = this.props.location.state.price;
            }
            if(type == 0){
                data['goodsid'] = this.props.location.state.goodsid;
                data['img_url'] = this.props.location.state.img_url;
                data['goodsname'] = this.props.location.state.goodsname;
                data['goodssize'] = this.props.location.state.goodssize;
                data['goodssizeid'] = this.props.location.state.goodssizeid;
                data['numValue'] = this.props.location.state.numValue;
                data['price'] = this.props.location.state.price;
                data['couponid'] = this.props.location.state.couponid;
            }
            this.setState({
                type,
                data
            })
        }
        this.getaddress();
    }
    setadd = (addData:any) => {
        const history = this.props.history
        this.state.type == 1?history.push({pathname:"/orderconfirm",state:{
            goodsid:this.state.data.goodsid,
            img_url:this.state.data.img_url,
            goodsname:this.state.data.goodsname,
            goodssize:this.state.data.goodssize,
            goodssizeid:this.state.data.goodssizeid,
            numValue:this.state.data.numValue,
            price:this.state.data.price,
            couponid:this.state.data.couponid,
            freight:this.state.data.freight,
            add:addData,
          }}):
        this.state.type == 2?history.push({pathname:'/ordercartconfirm',state:{
            data:this.state.data.datas,
            goodssizeid:this.state.data.goodssizeid,
            goodsnum:this.state.data.goodsnum,
            numValue:this.state.data.numValue,
            price:this.state.data.price,
            add:addData,
        }}):
        history.push({pathname:'/orderGroupconfirm',state:{
            goodsid:this.state.data.goodsid,
            img_url:this.state.data.img_url,
            goodsname:this.state.data.goodsname,
            goodssize:this.state.data.goodssize,
            goodssizeid:this.state.data.goodssizeid,
            numValue:this.state.data.numValue,
            price:this.state.data.price,
            couponid:this.state.data.couponid,
            add:addData,
        }})
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
            })
            if(res.data.length == 0){
                UIUtil.showInfo("请添加地址");
                this.props.history.push("/addAddress");
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
                <List.Item className='ddress-footer-button-container' extra={rowData.mobile} onClick={this.setadd.bind(this,rowData)}>
                    {rowData.name}<List.Item.Brief>{rowData.province+rowData.city+rowData.county+rowData.address} </List.Item.Brief>
                </List.Item>
            );
          };
        return (
            <div className="">
                <NavBar className="home-navbar" >
                        <div className="nav-title">选择地址</div>
                </NavBar>
                <WhiteSpace size="lg"/>
                <div className="">
                    <ListView 
                            ref={el => this.lv = el}
                            dataSource={this.state.dataSource}
                            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>
                            {this.state.isLoading ? '加载中' : ''}
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