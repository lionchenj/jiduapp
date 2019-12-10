import * as React from 'react';
// import ReactDOM from "react-dom";
import { NavBar, Icon, ListView, WingBlank, WhiteSpace} from "antd-mobile";
import { History } from "history";
// import { UserService } from '../../service/UserService';
// import { UIUtil } from '../../utils/UIUtil';






interface ExtensionCouponProps {
    history: History
}


interface ExtensionCouponState {
    height: number,
    dataSource: any,
    isLoading: boolean,
}

const bodyHeight = (window.innerHeight/100 - 0.9) + 'rem';

export class ExtensionCoupon extends React.Component<ExtensionCouponProps, ExtensionCouponState> {
    lv: any

    constructor(props: ExtensionCouponProps) {
        super(props);
          const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
          });
          this.state = {
            height:  document.documentElement.clientHeight - 200,
            dataSource,
            isLoading: true,
          };
        
    }

    onRedirectBack = () => {
        const history = this.props.history
        history.goBack()
    }

    componentDidMount() {
        this.onSelect();
      }

      onEndReached = (event:any) => {
        if (this.state.isLoading) {
          return;
        }
    
      }
    onSelect = () => {
        // UserService.Instance.pageMyCard().then((res:any) => {
        //     this.setState({
        //         dataSource: this.state.dataSource.cloneWithRows(res.data),
        //         isLoading: false
        //       })
        //   }).catch(err => {
      
        //   });
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
                
                <WingBlank>
                    <WhiteSpace></WhiteSpace>
                <div className={"coupon_list flex "+(rowData.states == 0?' coupon_can':' coupon_not')}>
                    <div className="w65 padding-l">
                        <div className="coupon_title fs18">{rowData.brand_name}</div>
                        <div className="coupon_time fs12 c999 padding-t">有效期：{rowData.end_time}前</div>
                    </div>
                    <div className="coupon_money fs30 cfff tac">¥{rowData.reduce}</div>
                </div>
                <WhiteSpace></WhiteSpace>
                </WingBlank>
  
            );
          };
        return (
            <div className="coupon_container">
                <NavBar icon={<Icon type="left" />}
                    onLeftClick={this.onRedirectBack}
                    className="home-navbar" >
                    <div className="nav-title">我的卡券</div>
                </NavBar>
                        <div style={{height: bodyHeight, backgroundColor: '#f5f5f5' }}>
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
                <div className="fans-list-view-container">
                
                </div>
            </div>
        )
    }
}