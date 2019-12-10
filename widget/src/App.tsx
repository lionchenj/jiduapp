import * as React from 'react';
import './App.css';
// import { UserStorage } from "./storage/UserStorage";
// import { Button } from 'antd-mobile'
import { Switch, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import { Login } from "./pages/login/Login";
import { registeredDistributor } from "./pages/registered/registeredDistributor";
import { registeredagent } from "./pages/registered/registeredagent";
import { protocol } from "./pages/registered/protocol";
import { httpCode } from "./pages/registered/httpCode";
import { Home } from "./pages/index_home/Home";
import { ForgetPwd } from "./pages/forgetPwd/ForgetPwd";
import { goodsDetails } from "./pages/goods/goodsDetails";
import { goodsevaluate } from "./pages/goods/goodsevaluate";
import { goodsGroupList } from "./pages/goods/goodsGroupList";
import { goodsLimitedList } from "./pages/goods/goodsLimitedList";
import { goodsGroupDetails } from "./pages/goods/goodsGroupDetails";
import { Coupon } from "./pages/coupon/Coupon";
import { CouponGet } from "./pages/coupon/CouponGet";
import { CouponType } from "./pages/coupon/CouponType";
import { article } from "./pages/article/article";
import { articleDetails } from "./pages/article/articleDetails";
import { ExtensionOrder } from "./pages/extension/ExtensionOrder";
import { presentation } from "./pages/presentation/presentation";
import { Feedback } from "./pages/feedback/Feedback";
import { order } from "./pages/order/order";
import { orderconfirm } from "./pages/order/orderconfirm";
import { ordercartconfirm } from "./pages/order/ordercartconfirm";
import { refund } from "./pages/order/refund";
import { Code } from "./pages/code/Code";
import { Message } from "./pages/message/Message";
import { Collection } from "./pages/collection/Collection";
import { Search } from "./pages/search/Search";
import { Searcharticle } from "./pages/search/Searcharticle";
import { Searchcoupon } from "./pages/search/Searchcoupon";
import { SearchClassify } from "./pages/search/SearchClassify";
import { Notice } from "./pages/message/Notice";
import { address } from "./pages/address/address";
import { addAddress } from "./pages/address/addAddress";
import { modifyAddress } from "./pages/address/modifyAddress";
import { Qandanswers } from "./pages/Qandanswers/Qandanswers";
import { Qandanswersmy } from "./pages/Qandanswers/Qandanswersmy";
import { QandanswersDetails } from "./pages/Qandanswers/QandanswersDetails";
import { Qandanswersput } from "./pages/Qandanswers/Qandanswersput";
import { About } from "./pages/about/About";
import { Customer } from './pages/customer/Customer';
import { Settings } from './pages/settings/Settings';
import { UpdataHead } from './pages/updataPwd/UpdataHead';
import { UpdataName } from './pages/updataPwd/UpdataName';
import { UpdataPhone } from "./pages/updataPwd/UpdataPhone";
import { Couponshare } from './pages/coupon/Couponshare';
import { orderdetails } from './pages/order/orderDetails';
import { Coupongoshare } from './pages/coupon/Coupongoshare';
import { goodsGroupShare } from './pages/goods/goodsGroupShare';
import { CoupongoDetails } from './pages/coupon/CoupongoDetails';
import { logistics } from './pages/order/logistics';
import { addressGet } from './pages/address/addressGet';
import { orderGroupconfirm } from './pages/order/orderGroupconfirm';
// const NotFound = () => (
//   <div> Sorry, this page does not exist. </div>
// )

class App extends React.Component {
  public render() {
    return (
      <Switch>
          <PrivateRoute exact path="/" component={Home} />
          <PrivateRoute exact path="/home" component={Home} />
          <PrivateRoute path="/registeredDistributor"  component={registeredDistributor} />
          <PrivateRoute path="/registeredagent"  component={registeredagent} />
          <PrivateRoute path="/protocol"  component={protocol} />
          <Route path="/login"  component={Login} />
          <Route path="/forget_pwd" component={ForgetPwd} />
          <PrivateRoute path="/message" component={Message} />
          <PrivateRoute path="/order" component={order} />
          <PrivateRoute path="/orderconfirm" component={orderconfirm} />
          <PrivateRoute path="/orderGroupconfirm" component={orderGroupconfirm} />
          <PrivateRoute path="/ordercartconfirm" component={ordercartconfirm} />
          <PrivateRoute path="/orderdetails" component={orderdetails} />
          <PrivateRoute path="/refund" component={refund} />
          <PrivateRoute path="/Feedback" component={Feedback} />
          <PrivateRoute path="/goodsDetails" component={goodsDetails} />
          <PrivateRoute path="/goodsevaluate" component={goodsevaluate} />
          <PrivateRoute path="/goodsGroupList" component={goodsGroupList} />
          <PrivateRoute path="/goodsGroupShare" component={goodsGroupShare} />
          <PrivateRoute path="/goodsLimitedList" component={goodsLimitedList} />
          <PrivateRoute path="/goodsGroupDetails" component={goodsGroupDetails} />
          <PrivateRoute path="/coupon" component={Coupon} />
          <PrivateRoute path="/couponshare" component={Couponshare} />
          <PrivateRoute path="/couponget" component={CouponGet} />
          <PrivateRoute path="/coupongoshare" component={Coupongoshare} />
          <PrivateRoute path="/coupongoDetails" component={CoupongoDetails} />
          <PrivateRoute path="/coupontype" component={CouponType} />
          <PrivateRoute path="/search" component={Search} />
          <PrivateRoute path="/searcharticle" component={Searcharticle} />
          <PrivateRoute path="/searchcoupon" component={Searchcoupon} />
          <PrivateRoute path="/searchclassify" component={SearchClassify} />
          <PrivateRoute path="/article" component={article} />
          <PrivateRoute path="/customer" component={Customer} />
          <PrivateRoute path="/articleDetails" component={articleDetails} />
          <PrivateRoute path="/extensionOrder" component={ExtensionOrder} />
          <PrivateRoute path="/presentation" component={presentation} />
          <PrivateRoute path="/Collection" component={Collection} />
          <PrivateRoute path="/httpCode" component={httpCode} />
          <PrivateRoute path="/code" component={Code} />
          <PrivateRoute path="/updata_phone" component={UpdataPhone} />
          <PrivateRoute path="/updata_head" component={UpdataHead} />
          <PrivateRoute path="/updata_name" component={UpdataName} />
          <PrivateRoute path="/notice" component={Notice} />
          <PrivateRoute path="/address" component={address} />
          <PrivateRoute path="/addAddress" component={addAddress} />
          <PrivateRoute path="/modifyAddress" component={modifyAddress} />
          <PrivateRoute path="/addressGet" component={addressGet} />
          <PrivateRoute path="/logistics" component={logistics} />
          <PrivateRoute path="/Qandanswers" component={Qandanswers} />
          <PrivateRoute path="/setting" component={Settings} />
          <PrivateRoute path="/Qandanswersmy" component={Qandanswersmy} />
          <PrivateRoute path="/QandanswersDetails" component={QandanswersDetails} />
          <PrivateRoute path="/Qandanswersput" component={Qandanswersput} />
          <PrivateRoute path="/about" component={About} />
          <PrivateRoute component={Home} />
      </Switch>
    );
  }
}

export default App;
