import * as React from 'react';
import { WingBlank, WhiteSpace } from "antd-mobile";
import { model } from 'src/model/model';
import { Util } from 'src/utils/Util';

export interface ICouponRowViewProps {
    coupon: model.ICoupon,
    type: 2 | 3,
}

export interface ICouponRowViewState {
}

export default class CouponRowView extends React.Component<ICouponRowViewProps, ICouponRowViewState> {
    constructor(props: ICouponRowViewProps) {
        super(props);

        this.state = {
        }
    }

    public render() {
        const coupon = this.props.coupon
        let couponType = ""
        let userDesc = ""
        if (coupon.cash.type == "2") {
            couponType = "新人券"
        } else {
            if (coupon.cash.least) {
                couponType = "满减券"
            } else {
                couponType = "现金券"
            }
        }
        if (coupon.cash.least) {
            userDesc = "满¥" + coupon.cash.least + "使用"
        } else {
            userDesc = "无金额门槛"
        }
        if(coupon.cash.is_forever==1){
            couponType = "永久券"
          }
        let userStatus = ""
        if (this.props.type == 2) {
            userStatus = Util.formatDate(coupon.update_time*1000)  + " 已使用"
        } else {
            userStatus = Util.formatDate(coupon.cash.end_time*1000) + " 已过期"
        }
        return (
            <WingBlank>
                <WhiteSpace></WhiteSpace>
                <div className="coupon_list coupon_not flex">
                    <div className="w70 h100 padding-tbl  flex-column flex-j-c" >
                        <div className="coupon_title  "><span className="c999 fs15">No.</span><span className="c666 fs13">{coupon.orderid}</span></div>
                        <div className="padding-tb flex flex-a-start fs18  ">
                            <div className="padding0102 b666 cfff fs13 ">{couponType}</div>
                            <div className="margin-ls">
                                <div className="c333 fs13">{coupon.cash.brand_name}</div>
                                <div className="c333 fs12 margin-tsm">
                                    {userStatus} </div>
                            </div>
                        </div>
                        <div className="c333 fs13 ">
                            •{coupon.cash.description}
                        </div>
                    </div>
                    <div className="coupon_money padding-tbl w30 h100 fs30  tac  flex-column flex-j-c">
                        <div className="c666"><span className="fs24">¥</span><span className="fs30">{coupon.cash.reduce}</span></div>
                        <div className="c000 fs13">{userDesc}</div>
                    </div>
                </div>
                <WhiteSpace></WhiteSpace>
            </WingBlank >
        );
    }
}
