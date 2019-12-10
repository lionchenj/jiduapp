import * as React from "react";
import {
  TabBar,
  List,
  NavBar,
  Grid,
  Carousel,
  Toast,
  Tabs,
  Checkbox,
  Button,
  Modal,
  SwipeAction,
  // Stepper,
  // WingBlank,
  // WhiteSpace,
} from "antd-mobile";
const CheckboxItem = Checkbox.CheckboxItem;
import { History, Location } from "history";
import { UserStorage } from "../../storage/UserStorage";
import "./Home.css";
import "./news.css";

import tab_home from "../../assets/appimg/tab1-2.png";
import tab_home_n from "../../assets/appimg/tab1-1.png";
import tab_classify from "../../assets/appimg/tab2-2.png";
import tab_classify_n from "../../assets/appimg/tab2-1.png";
import tab_question from "../../assets/appimg/tab3-2.png";
import tab_question_n from "../../assets/appimg/tab3-1.png";
import tab_buycart from "../../assets/appimg/tab4-2.png";
import tab_buycart_n from "../../assets/appimg/tab4-1.png";
import tab_my from "../../assets/appimg/tab5-2.png";
import tab_my_n from "../../assets/appimg/tab5-1.png";

import my1_1 from "../../assets/appimg/my1-1.png";
import my1_2 from "../../assets/appimg/my1-2.png";
import my1_3 from "../../assets/appimg/my1-3.png";
import my1_4 from "../../assets/appimg/my1-4.png";
import my1_5 from "../../assets/appimg/my1-5.png";
import my2_1 from "../../assets/appimg/my2-1.png";
import my2_2 from "../../assets/appimg/my2-2.png";
import my2_3 from "../../assets/appimg/my2-3.png";
import my2_4 from "../../assets/appimg/my2-4.png";
import my2_5 from "../../assets/appimg/my2-5.png";
import my2_6 from "../../assets/appimg/my2-6.png";
import my2_7 from "../../assets/appimg/my2-7.png";
import my2_8 from "../../assets/appimg/my2-8.png";
import my2_9 from "../../assets/appimg/my2-9.png";
import my2_12 from "../../assets/appimg/my2-12.png";
import setting from "../../assets/appimg/mySetting.png";
import message from "../../assets/appimg/myMessage.png";
import defaults from "../../assets/default.png";
import bg2_1 from "../../assets/appimg/bg2-1.png";
import order1 from "../../assets/appimg/order1.png";
import goodscoll from "../../assets/appimg/goodscoll.png";
import repository1 from "../../assets/appimg/repository1.png";
import repository2 from "../../assets/appimg/repository2.png";
import upicon from "../../assets/appimg/up.png";
import downicon from "../../assets/appimg/down.png";

import coll from "../../assets/appimg/goodscoll.png";
import articelcoll from "../../assets/appimg/article-collection.png";
import search from "../../assets/search.png";

import IndexboxView from './../../components/IndexBox';
import banner from "../../assets/default.png";
import { UserService } from "../../service/UserService";
import { UIUtil } from "../../utils/UIUtil";
import CountDownView from "src/components/CountDownView";
var agent = navigator.userAgent.toLowerCase();
var iphone = agent.indexOf("iphone");
var ipad = agent.indexOf("ipad");
var pageheight = window.innerHeight;
if(iphone != -1 || ipad != -1){
  pageheight = pageheight -50
}

const pagewidth = window.innerWidth;
const myOrder = [
  {
    icon: my1_1,
    text: '待付款'
  },
  {
    icon: my1_2,
    text: '待发货'
  },
  {
    icon: my1_3,
    text: '待收货'
  },
  {
    icon: my1_4,
    text: '评价'
  },
  {
    icon: my1_5,
    text: '退款退货'
  }
];
const myService = [
  {
    icon: my2_1,
    text: '裂变优惠券',
    content: '分享好友多拿一张'
  },
  {
    icon: my2_2,
    text: '优惠券'
  },
  {
    icon: my2_3,
    text: '限时购'
  },
  {
    icon: my2_4,
    text: '团拼商城',
  },
  {
    icon: my2_5,
    text: '我的地址'
  },
  {
    icon: my2_6,
    text: '投诉建议'
  },
  {
    icon: my2_7,
    text: '客服'
  },
  {
    icon: my2_8,
    text: '领券中心'
  },
  {
    icon: my2_9,
    text: '我的问答'
  },
  {
    icon: my2_12,
    text: '关于我们'
  }
];
interface HomeProps {
  history: History;
  location: Location;
}

interface HomeState {
  selectedTab: "HomeTab" | "Classify" | "ShoppingCart" | "News" | "MyTab";
  banners:any;
  bannerState:boolean;
  imgHeight:string;
  tabs1Page:number;
  selectedCoinId: number;
  selectedCoinId2:number;
  isBG:boolean;
  showpay:boolean;
  changepay:boolean;
  setBox:any;
  selectTitle:string;
  isSelect:boolean;
  indexicon:any;
  showselect:any;
  userInfo:any;
  value:any;
  categorylist:any;
  seasons:any;
  getInformation: any;
  searchType:number;
  searchId:string;
  searchList:any;
  searchValue:string;
  level1:any;
  level2:any;
  countDown:number;
  panicTime:string;
  panicHour:string;
  titleid:string;
  myHotData:any;
  myCommonData:any;
  isrecommendX:boolean;
  recommendlist:any;
  tabs:any;
  cartgoods:any;
  clicked:string;
  repository1:any;
  repository2:any;
  buycartList:any;
  buycarpaytList:any;
  indexgoodslist:any;
  indexfororder:any;
  indexarticle:any;
  indexarticleList:any;
  cartprices:number;
  cartfreight:string;
  cartids:string;
  goodsnum:string;
  addchange:any;
  numValue:number;
  cango:boolean;
  cartnum:number;
  daili:boolean,
  fenxiao:boolean,
  indexcoupon:any,
  hasmsg:boolean
}
export class Home extends React.Component<HomeProps, HomeState> {
  avatarInput: any  
  wxerr:boolean
  constructor(props: HomeProps) {
    super(props);
    this.wxerr = false;
    this.state = {
      selectedTab:"HomeTab",
      banners:[],
      bannerState:true,
      tabs1Page:0,
      imgHeight:'1',
      selectedCoinId:0,
      selectedCoinId2:0,
      isBG:false,
      showpay:false,
      changepay:false,
      selectTitle:'',
      isSelect:false,
      indexicon:[],
      showselect:[],
      userInfo:'',
      value:[],
      indexarticle:'',
      indexarticleList:[],
      categorylist:[],
      seasons: [],
      getInformation: [],
      searchType:1,
      searchId:'1',
      searchList:[],
      searchValue:'',
      level1:[],
      level2:[],
      countDown:0,
      panicTime:'00:00:00',
      panicHour:'9点场',
      titleid:'1',
      myHotData:[],
      myCommonData:[],
      isrecommendX:true,
      recommendlist:[],
      tabs:[],
      cartgoods:[],
      clicked:'',
      repository1:[],
      repository2:[],
      buycartList:[],
      buycarpaytList:[],
      indexgoodslist:[],
      indexfororder:[],
      cartprices:0,
      cartfreight:'',
      cartids:'',
      goodsnum:'',
      addchange:'',
      numValue:0,
      cango:false,
      cartnum:0,
      daili:false,
      fenxiao:false,
      indexcoupon:[],
      setBox:'',
      hasmsg:false
    };
  }

  public componentDidUpdate() {}
  public componentWillMount() {}
  public componentDidMount() {
    let anyid = UIUtil.geturl();
    if(anyid){
      if(anyid.orderid){
        this.props.history.push("/coupongoshare?orderid="+anyid.orderid);
        return;
      }
      if(anyid.groupid){
        this.props.history.push({pathname:'/goodsGroupDetails',state:{id:anyid.groupid}})
        return;
      }
      if(anyid.goodsid){
        this.props.history.push({pathname:'/goodsDetails',state:{id:anyid.goodsid}})
        return;
      }
    }
    this.index_goods();
    this.goods_category();
    this.getIcon();
    this.index_article();
    this.get_index_config();
    this.index_for_order();
    this.setHomeTab();
    UIUtil.share();
    if (UIUtil.not_weixin()) {
      this.setState({
        selectedTab: "HomeTab"
      });
      return;
    }
    let typeTab = UserStorage.getCookie("type");
    let tab: "HomeTab" | "Classify" | "ShoppingCart" | "News" | "MyTab" =
      typeTab == "MyTab"
        ? "MyTab"
        : typeTab == "Classify"
        ? "Classify"
        : typeTab == "ShoppingCart"
        ? "ShoppingCart"
        : typeTab == "News"
        ? "News"
        : "HomeTab";
    let user: any = UserStorage.getCookie("userInfo");
    user = JSON.parse(user);
    this.setState({
      selectedTab: tab
    })
    this.get_article_type();
    this.getUserInfo();
    this.getbuycarts();
    this.get_article({key:'1',title:'推荐'});
    this.onSelect()
  };
  /**
   *  自定义
   * getUserInfo 用户信息
   * setHomeTab 轮播
   * getIcon 首页icon
   * get_index_config 配置
   * index_for_order 首页公告
   * index_goods 首页商品列表
   * 
   * 
   * goods_category 商品分类
   * goods_lists 商品列表
   * setRecommend 推荐分类开关
   * showpay 支付弹窗
   * 
   * get_article_type 知识库类型
   * get_article 知识库列表
   * 
   * add_shop_car 加入购物车
   * getbuycarts 购物车列表
   * onChange 购物车选择
   * 
   * myOrder 我的订单
   * myService 我的服务
   * favoriteGoods 商品收藏
   * 
   * setCountDown 抢购倒计时
   * 
   */ 
  //用户信息
  getUserInfo = () => {
    UIUtil.showLoading('加载中');                
    // let openid = UserStorage.getCookie("User.openid") || "1234";
    UserService.Instance.getUserInfo().then((userInfo:any) => {
        UserStorage.setCookie("userInfo", JSON.stringify(userInfo));
        UserStorage.setCookie("knower_status", userInfo.knower_status);
        this.setState({
          userInfo: userInfo,
          hasmsg:userInfo.is_read == 1?true:false
        });
        UIUtil.hideLoading();
      }).catch(err => {
        UIUtil.hideLoading();
      });
  };
//轮播
setHomeTab = () => {
  UserService.Instance.banner('1')
    .then(res => {
      this.setState({
        banners: res.data ? res.data : [{ img_path: res.data }]
      });
      let that = this;
      setTimeout(() => {
        that.setState({
          bannerState: true
        })
      }, 1000);
    })
    .catch(err => {
      UIUtil.showError(err);
      this.setState({
        banners: [{ img_path: banner }]
      });
    UIUtil.hideLoading();
  });
};
//首页公告
index_for_order = () => {
  UserService.Instance.index_for_order().then(res => {
      this.setState({
        indexfororder: res.data ? res.data : [{ img_path: res.data }]
      });
    })
    .catch(err => {
      UIUtil.showError(err);
      this.setState({
        banners: [{ img_path: banner }]
      });
    UIUtil.hideLoading();
  });
}
//首页icon
getIcon = () => {
  //轮播
  UserService.Instance.index_icon().then(res => {
    let list:any = []
      res.data.map((data:any)=>{
        list.push({
          icon: data.img_url,
          text: data.title,
          id: data.id
        })
      })
      this.setState({
        indexicon:list
      })
    })
    .catch(err => {
    UIUtil.hideLoading();
  });
};
//配置
get_index_config = () => {
  UserService.Instance.get_index_config().then(res => {
      this.setState({
        setBox:res.data
      })
    UIUtil.hideLoading();
  })
    .catch(err => {
    UIUtil.hideLoading();
  });
  
}
//首页文章
index_article = () => {
  UserService.Instance.index_article().then(res => {
    let list = 0,goods = 0;
    res.data.goods.map((data:any)=>{
      list = list + data.sales_num
      goods++
    })
    res.data['sales_num'] = list;
    res.data['goods_num'] = goods;
      this.setState({
        indexarticle:res.data,
        indexarticleList:res.data.goods
      })
    UIUtil.hideLoading();
  })
    .catch(err => {
    UIUtil.hideLoading();
  });
}
//首页商品列表
index_goods = () => {
  UserService.Instance.index_goods().then(res => {
    let list:any = []
      res.data.data.map((data:any)=>{
        list.push(data)
      })
      this.setState({
        indexgoodslist:list
      })
    UIUtil.hideLoading();
  })
    .catch(err => {
    UIUtil.hideLoading();
  });
}
//商品分类
goods_category = () =>{
  // let self = this;
  UserService.Instance.goods_category().then( (res:any) => {
    this.setState({
      categorylist:res.data
    })
    let hotlist:any = [];
    let usedlist:any = [];
    res.data[0].children_hot.map((data:any)=>{
      hotlist.push({
        icon: data.img_url,
        text: data.title,
        id: data.id
      })
    })
    res.data[0].children_used.map((data:any)=>{
      usedlist.push({
        icon: data.img_url,
        text: data.title,
        id: data.id
      })
    })
    this.setState({
      myHotData:hotlist,
      myCommonData:usedlist
    })
  }).catch( err => {
    UIUtil.showError(err)
    UIUtil.hideLoading();
  })
}
//商品列表
goods_lists = (category_id:string) =>{
  UserService.Instance.goods_lists(category_id).then( (res:any) => {
    let newList:any = []
    res.data.map((data:any)=>{
      newList.push(data)      
    })
  }).catch( err => {
      UIUtil.showError(err)
  })
}
//推荐分类开关
setRecommend = (e:any) =>{
  let id = e.currentTarget.dataset.id;
  if(e.currentTarget.dataset.title == '为你推荐'){
    this.setState({
      isrecommendX:true,
      titleid:id
    })
    return;
  } 
  let list = this.state.categorylist;
  list.map((data:any)=>{
    if(data.id == id){
      var datas:any = [];
      data.children.map((res:any)=>{
        datas.push({
          icon: res.img_url,
          text: res.title,
          id: res.id
        })
      })
      this.setState({
        titleid:id,
        recommendlist:datas,
        isrecommendX:false
      })
    }
  })
}
//跳转列表
goDetails = (e:any)=>{
  let id = e.currentTarget.dataset.id;
  let name = e.currentTarget.dataset.name;
  this.props.history.push({pathname:'/searchclassify',state:{id:id,search:name}})
}

//个人中心
myOrder = (el: object, index: number) => {
  if (index == 0) {
    this.props.history.push({pathname:"/order",state:{type:1}});
  } else if (index == 1) {
    this.props.history.push({pathname:"/order",state:{type:2}});
  } else if (index == 2) {
    this.props.history.push({pathname:"/order",state:{type:3}});
  } else if (index == 3) {
    this.props.history.push({pathname:"/order",state:{type:6}});
  } else if (index == 4) {
    this.props.history.push({pathname:"/refund",state:{type:6}});
  }
};
myService = (el: object, index: number) => {
  if (index == 0) {
  } else if (index == 1) {
  } else if (index == 2) {
    this.props.history.push("/couponshare");
  } else if (index == 3) {
    this.props.history.push("/coupon");
  } else if (index == 4) {
    this.props.history.push("/goodsLimitedList");
  } else if (index == 5) {
    this.props.history.push("/goodsGroupList");
  } else if (index == 6) {
    this.props.history.push("/address");
  } else if (index == 7) {
    this.props.history.push("/feedback");
  } else if (index == 8) {
    window.location.href = 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=Mzg4MDE1ODU1Nw==&scene=110#wechat_redirect'
    // this.props.history.push("/customer");
  } else if (index == 9) {
    this.props.history.push("/coupontype");
  } else if (index == 10) {
    this.props.history.push("/Qandanswersmy");
  } else if (index == 11) {
    this.props.history.push("/about");
  }  
};
//商品收藏
favoriteGoods = (id:string,type:number) => {
  UserService.Instance.favorite(id,type).then( (res:any) => {
    Toast.info('收藏成功')
  }).catch( err => {
    UIUtil.showError(err)
    // Toast.info('收藏失败')
  })
}

//知识库类型
get_article_type = () => {
  UserService.Instance.get_article_type().then( (res:any) => {
    let newList:any = []
    res.data.map((data:any)=>{
      newList.push({ title: data.name,key:data.id })      
    })
    this.setState({
      tabs:newList
    })
    UIUtil.hideLoading();
  }).catch( err => {
    UIUtil.hideLoading();
    UIUtil.showError(err)
  })
}
//知识库列表
get_article = (tab:any) => {
  let type = tab.key;
  UserService.Instance.get_article(type).then( (res:any) => {
    let newList1:any = [];
    let newList2:any = [];
    let num = 1;
    res.data.data[0].articles.map((data:any)=>{
      if(num%2 == 0){
        newList2.push(data)
      }else{
        newList1.push(data)
      }
      num++
    })
    this.setState({
      repository1:newList1,
      repository2:newList2
    })
    UserStorage.setStorage('newType',tab.title);
    UIUtil.hideLoading();
  }).catch( err => {
    UIUtil.hideLoading();
    UIUtil.showError(err)
  })
}
//加入购物车
// add_shop_car = (id:string,num:string) => {
//   UserService.Instance.add_shop_car(id,num).then( (res:any) => {
//     Modal.alert('提示', '添加购物车成功');
//   }).catch( err => {
//       const message = (err as Error).message
//       Toast.fail(message)
//   })
// }
//购物车列表
getbuycarts = () => {
  UserService.Instance.my_shop_car().then( (res:any) => {
    if(res.data.length != 0){
      let prices = 0;
      let cartgoods:any = [],num:number = 0
      res.data.map((data:any)=>{
        let sizes:any = []
        data.param.format.map((data:any)=>{
          sizes.push(data.title)
        })
        num = num + data.num;
        data['goodssize'] = sizes.join();
        data['totalprices'] = (data.num)*(data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price)
        prices = prices+(data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price)*1;
        cartgoods.push(false);
      })
      this.setState({
        cartgoods:cartgoods,
        cartfreight:res.data[0].param.goods.freight,
        cartnum:num,
        buycartList:res.data,
      })
      UIUtil.hideLoading();
    }
  }).catch( err => {
      UIUtil.showError(err)
      UIUtil.hideLoading();
    })
}
//购物车选择
onChange= (e:any,id:string) => {
  if(id == 'z'){
    this.setState({
      cango:e.target.checked
    })
    return;
  }
  let goods:any = [];
  if(id == 'x'){
    this.state.cartgoods.map((data:any)=>{
      goods.push(e.target.checked)
    })
    this.setState({
      cartgoods:goods,
      buycarpaytList:this.state.buycartList
    })
  }else{
    goods = this.state.cartgoods;
    goods[id] = e.target.checked;
    this.setState({
      cartgoods:goods
    })
  }
  let list = this.state.buycartList;
  let ids = [],total = 0,num = 0,buyList:any = [],goodsnum:any = [];
  for (let i = 0; i < list.length; i++) {
    if(goods[i]){
      buyList.push(list[i]);
      num = num + list[i].num;
      goodsnum.push(list[i].num);
      ids.push(list[i].id)
      total = total+list[i].totalprices;
    }
  }
  this.setState({
    buycarpaytList:buyList,
    cartnum:num,
    cartprices:total,
    cartids:ids.join(),
    goodsnum:goodsnum.join(),
  })
};
//支付弹窗
showpay = () => {
  let add = window.localStorage.getItem('add');
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  });
  this.setState({
    addchange:add,
    isBG:true,
    showpay:true,
  });
}
//关闭
closeselect = () => {
  this.setState({
    isBG:false,
    showpay:false,
  });
}
//跳订单
goorder = () => {
  if (this.state.buycarpaytList.length == 0) {
    Toast.info('请选择商品');
    return
  }
  let list = this.state.buycartList;
  let goodsnum:any = [];
  for (let i = 0; i < list.length; i++) {
    if(this.state.cartgoods[i]){
      goodsnum.push(list[i].num);
    }
  }
  if(this.state.cango){
    this.props.history.push({pathname:"/ordercartconfirm",state:{
      data:this.state.buycarpaytList,
      goodssizeid:this.state.cartids,
      goodsnum:goodsnum.join(),
      numValue:this.state.cartnum,
      price:this.state.cartprices,
    }});
  }else{
    Toast.info('请勾选协议')
  }
}
//抢购倒计时
setCountDown = () => {
  let thistime = this.state.countDown,that = this;
  thistime++
  let panicTime = UIUtil.setTime(thistime)
  setTimeout(() => {
    that.setState({
      panicTime:panicTime
    })
    that.setCountDown();
  }, 1000);
}

//
onSelect = () => {
  UserService.Instance.coupon_center('0').then((res: any) => {
    this.setState({
      indexcoupon:res.data,
    })
  }).catch(err => {
  });
}
//购物车改数量
upnum = (e:any) => {
  e.stopPropagation()
  let indexs = e.currentTarget.dataset.index;
  let list = this.state.buycartList;
  let total = 0;
  list.map((data:any,index:string)=>{
    if(indexs == index){
      data.num = data.num+1
      data.totalprices = data.num*(data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price)
    }
    if(this.state.cartgoods[index]){
      total = total+data.totalprices;
    }
  })
  this.setState({
    cartprices:total,
    buycartList:list
  })
}
downnum = (e:any) => {
  e.stopPropagation()
  let indexs = e.currentTarget.dataset.index;
  let list = this.state.buycartList;
  let total = 0,cartnum = 0;
  list.map((data:any,index:string)=>{
    if(indexs == index){
      data.num = data.num>1?data.num-1:1
      data.totalprices = data.num*(data.param.price.is_limit==1?data.param.price.price:data.param.price.original_price)
    }
    if(this.state.cartgoods[index]){
      total = total+data.totalprices;
      cartnum = cartnum + data.num;
    }
  })
  this.setState({
    cartnum:cartnum,
    cartprices:total,
    buycartList:list
  })
}
  public render() {
    return (
      <div className="home-container">
        <div className="tab-bar-container margin-t0">
          <TabBar
            unselectedTintColor="#666666"
            tintColor="#333333"
            barTintColor="#fff"
            tabBarPosition="bottom"
          >
            <TabBar.Item
              title="首页"
              key="HomeTab"
              selected={this.state.selectedTab === "HomeTab"}
              onPress={() => {
                this.setState({
                  // ...this.state,
                  selectedTab: "HomeTab"
                  // goQuestion: true
                });
                this.props.history.push("#HomeTab");
                UserStorage.setCookie("type", "HomeTab");
              }}
              icon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background:
                      "url(" +
                      tab_home_n +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: "#1FA4FC",
                    background:
                      "url(" +
                      tab_home +
                      ") center center /  21px 21px no-repeat"
                  }}
                ></div>
              }
            >

              {/* <div className={this.state.selectedTab === "HomeTab"?"goQuestion":"none"} onClick={()=>{this.setState({selectedTab:"SearchTab"})}}>
                <img src={icon_question}/>
              </div> */}
              <div style={{ height: pageheight, width: pagewidth}}>
                <div onClick={()=>{this.props.history.push("/search");}}><img src={search} alt=""/></div>
                <div className="home-banner pr">
                  <div className="banner-top">
                  {/* <Carousel vertical={true} dots={false} autoplay={this.state.bannerState} infinite={true} >
                    {
                      this.state.indexfororder.map((data:any)=>(
                        <div className="flex"><img src={data.member.headimgurl}></img><div className="v-item"><span>{data.param.goods.goodsname}</span><span>{data.goodsNum}</span>件</div></div>
                      ))
                    }
                  </Carousel> */}
                  </div>
                  <div className="banner_height">
                    <Carousel autoplay={this.state.bannerState} infinite={true} dots>
                      {this.state.banners.map((val: any, index: string) => (
                        val.link && val.link != null && val.link.indexOf('goodsid') != -1?
                        <a key={index}
                          onClick={()=>this.props.history.push({ pathname: '/goodsDetails', state: { id: val.link.split('=')[1] } })}
                          style={{ display: "inline-block", width: "100%", height: this.state.imgHeight }}>
                          <img src={val.img_path} alt={val.title} style={{ width: "100%", height: "1.8rem", verticalAlign: "top"}} onLoad={() => { window.dispatchEvent(new Event("resize")); this.setState({ imgHeight: "1.8rem" });}}/>
                        </a>:
                        <a key={index}
                          href={val.link}
                          style={{ display: "inline-block", width: "100%", height: this.state.imgHeight }}>
                          <img src={val.img_path} alt={val.title} style={{ width: "100%", height: "1.8rem", verticalAlign: "top"}} onLoad={() => { window.dispatchEvent(new Event("resize")); this.setState({ imgHeight: "1.8rem" });}}/>
                        </a>
                      ))}
                    </Carousel>
                  </div>
                </div>
                <div className="index_icon Grid">
                      <Grid
                      isCarousel
                      data={this.state.indexicon}
                      square={false}
                      hasLine={false}
                      // onClick={this.onindexMenu}
                      columnNum={5}
                      renderItem={(dataItem:any) => (
                        <div data-id={dataItem.id} data-title={dataItem.title} onClick={(e:any)=>{
                          this.setState({
                            ...this.state,
                            titleid:e.currentTarget.dataset.id,
                            selectedTab: "Classify"
                          });
                          this.props.history.push("#Classify");
                          UserStorage.setCookie("type", "Classify");
                          this.setRecommend(e);
                        }}>
                          <img src={dataItem.icon} style={{marginTop: '0.05rem', width: '0.42rem', height: '0.42rem' }} alt="" />
                          <div style={{ color: '#5c5c5c', fontSize: '11px', marginTop: '0.05rem',marginBottom: '0.05rem' }}>{dataItem.text}</div>
                        </div>
                      )}
                    />
                </div>
                <IndexboxView datas={this.state.setBox} history={this.props.history}/>
                <div className={"index-coupon w100 bff margin-t "+(this.state.indexcoupon.length == 0?"none":'')}>
                  <Carousel autoplay={false} infinite={false} dots>
                    {this.state.indexcoupon.map((data: any, index: string) => (
                        <div className="index_coupon_list coupon_index flex" onClick={() => { this.props.history.push({ pathname: '/coupongoDetails', state: { data: JSON.stringify(data),page:'0' } }) }}>
                          <div className="w70 h100 padding-tbl ">
                            {/* <div ><span className="c999 fs15">No.</span><span className="c066 fs13">{data.orderid}</span></div> */}
                            <div className="flex margin-tsm">
                              <img className="coupon_image" src={data.headimgurl} alt="" />
                              <div className="conpou_center_desc margin-ls flex-column flex-j-sb">
                                <div className=" fs15 c333 "><span className="bd5e cfff fs13 padding3 margin-rsm">{data.is_forever==1?"永久券":data.type == "2"?"新人券":data.least?"满减券":"现金券"}</span>{data.brand_name}</div>
                                <div className="">
                                  <span className="fs15 cf11 fb">¥</span>
                                  <span className="coupon_money fs30 cf11 fb">{data.reduce}</span>
                                  <span className="cd5e fs13 padding-lsm">满{data.least}可用</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="w30 h100   tac  flex-column flex-j-sb">
                            <div className="c066 fs13">距开抢</div>
                            {data.is_forever!=1?<CountDownView date={new Date(data.start_time * 1000)} />:
                              <div className="margin-a padding-tb05"><span className="count_down_item bce0 cfff fs13 tac">99</span><span className="count_down_item_spector  c000 fs13 fb tac">:</span><span className="count_down_item bce0 cfff fs13 tac">99</span><span className="count_down_item_spector  c000 fs13 fb tac">:</span><span className="count_down_item bce0 cfff fs13 tac">99</span></div>
                            }
                            <div className="margin-a"><div className="coupon_fetch_button block w7 bd5e cfff fb fs12 tac ">领取</div></div>
                          </div>
                        </div>
                    ))}
                  </Carousel>
                </div>
                <div className="index_news padding bff margin-tsm">
                    <div onClick={()=>{this.props.history.push({pathname:'/articleDetails',state:{datas:JSON.stringify(this.state.indexarticle)}})}}>
                      <div className="fs15 c101">{this.state.indexarticle.title}</div>
                      <div className="fs13 c999 margin-tsm">{this.state.indexarticle.description}</div>
                      <div className="article_goods">
                        {
                          this.state.indexarticleList.map((data:any)=>(
                            <div className="index-goods padding"><img src={data.img_url} alt=""/></div>
                          ))
                        }
                      </div>
                      <div className="flex flex-j-sb fs10">
                        <div className="c999">{this.state.indexarticle.goods_num}款商品 | {this.state.indexarticle.sales_num}人购买</div>
                        <div><img className="simg" src={this.state.indexarticle.favorite==1?coll:articelcoll} alt=""/></div>
                      </div>
                    </div>
                </div>
                <div className="index_goodList margin-tsm">
                  {
                    this.state.indexgoodslist.map((data:any)=>(
                      <div className="index_goods bff padding borcccb">
                        <div className="flex" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                          <div className="tac goods_list"><img src={data.img_url} alt=""/></div>
                          <div className="padding-l2 w100">
                            <div className="fs18 fb index_goods_title">{data.goodsname}</div>
                            <div className="fs12 c999 margin-t index_goods_content ">{data.description}</div>
                            <div className="flex flex-j-sb margin-tsm">
                              <div className="fs13 ce3e">{data.type == '1'?'':'其他'}</div>
                              <div className="fs12 c999"><img className="index-collection" src={goodscoll} onClick={()=>{this.favoriteGoods(data.goodsid,1)}} />{data.sales_num}人购买</div>
                            </div>
                            <div className="flex flex-j-sb margin-tsm">
                              <div className="fs14 fb cce0">¥<span className="fs22">{data.price}</span></div>
                              <div className="fs12 cd5e padding05 bord5e br">加入购物车</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
            </div>
            </TabBar.Item>
            <TabBar.Item
              title="分类"
              key="Classify"
              selected={this.state.selectedTab === "Classify"}
              onPress={() => {
                // if (UIUtil.not_weixin()) {
                //   UIUtil.showInfo("请在微信浏览器打开！");
                //   return;
                // }
                this.setState({
                  ...this.state,
                  selectedTab: "Classify"
                });
                this.props.history.push("#Classify");
                UserStorage.setCookie("type", "Classify");

              }}
              icon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background:
                      "url(" +
                      tab_classify_n +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: "#1FA4FC",
                    background:
                      "url(" +
                      tab_classify +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
            >
              <div className="home2" style={{ height: pageheight, width: pagewidth, background: "#f2f2f2", position:'relative'}} >
                <div onClick={()=>{this.props.history.push("/search");}}><img src={search} alt=""/></div>
                <div className=" flex"style={{ height: pageheight-52,}}>
                  <div className="bor999r w30 h100 bff">
                    {
                      this.state.categorylist.map((val: any, index: string) => (
                        <div className={"tac index_category "+(this.state.titleid == val.id?'recommend-level fs12':'')} data-id={val.id} data-title={val.title} onClick={this.setRecommend}>
                          <span>{val.title}</span>
                        </div>
                      ))
                    }
                  </div>
                  <div className="w70 h100 bff">
                    <div className={this.state.isrecommendX?'':'none'}>
                      <div className="index-recommend b009">
                          <img src={bg2_1} style={{ width: "100%", height: "0.83rem", verticalAlign: "top"}}/>
                      </div>
                      <div className="borcccb padding-bs">
                        <div className="padding2">常用分类</div>
                        <Grid
                            data={this.state.myCommonData}
                            hasLine={false}
                            // onClick={this.onTapMyMenu}
                            columnNum={3}
                            square={false}
                            renderItem={(dataItem:any) => (
                              <div data-id={dataItem.id} data-name={dataItem.text} onClick={this.goDetails}>
                                <img src={dataItem.icon} style={{ width: '0.6rem', height: '0.6rem'  }} alt="" />
                                <div style={{ color: '#5c5c5c', fontSize: '12px' }}>{dataItem.text}</div>
                              </div>
                            )}
                          />
                      </div>
                      <div className="borcccb padding-bs">
                        <div className="padding2">热门分类</div>
                        <Grid
                            data={this.state.myHotData}
                            hasLine={false}
                            // onClick={this.onTapMyMenu}
                            columnNum={3}
                            square={false}
                            renderItem={(dataItem:any) => (
                              <div data-id={dataItem.id} data-name={dataItem.text} onClick={this.goDetails}>
                                <img src={dataItem.icon} style={{ width: '0.6rem', height: '0.6rem'  }} alt="" />
                                <div style={{ color: '#5c5c5c', fontSize: '12px' }}>{dataItem.text}</div>
                              </div>
                            )}
                          />
                      </div>
                    </div>
                    <div className={this.state.isrecommendX?'none':''}>
                      <Grid
                        data={this.state.recommendlist}
                        hasLine={false}
                        // onClick={this.onTapMyMenu}
                        columnNum={3}
                        square={false}
                        renderItem={(dataItem:any) => (
                          <div data-id={dataItem.id} data-name={dataItem.text} onClick={this.goDetails}>
                            <img src={dataItem.icon} style={{ width: '0.6rem', height: '0.6rem' }} alt="" />
                            <div style={{ color: '#5c5c5c', fontSize: '12px' }}>{dataItem.text}</div>
                          </div>
                        )}
                      />
                    </div>                  
                  </div>
                  </div>
                </div>
            </TabBar.Item>
            <TabBar.Item
              title="知识库"
              key="News"
              selected={this.state.selectedTab === "News"}
              onPress={() => {
                // if (UIUtil.not_weixin()) {
                //   UIUtil.showInfo("请在微信浏览器打开！");
                //   return;
                // }
                this.setState({
                  ...this.state,
                  selectedTab: "News"
                });
                this.props.history.push("#News");
                UserStorage.setCookie("type", "News");

              }}
              icon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background:
                      "url(" +
                      tab_question_n +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: "#1FA4FC",
                    background:
                      "url(" +
                      tab_question +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
            >
              <div className="repository" style={{ height: pageheight, width: pagewidth, background: "#f2f2f2", position:'relative'}} >
                <div className="repository_content pr">
                  <div className="tac cfff padding fs18">知识库</div>
                  <div className="repository_profile_list bff br pa">
                    <div className="repository_search"  onClick={()=>{this.props.history.push('/searcharticle')}}>在社区搜索内容</div>
                    <div className="flex flex-j-sb w40 margin-a">
                      <div>
                        <div className="repository_top_img"><img src={repository1} alt=""/></div>
                        <div className="tac fs12 c707">看文章</div>
                      </div>
                      <div onClick={()=>{this.props.history.push('/Qandanswers')}}>
                        <div className="repository_top_img"><img src={repository2} alt=""/></div>
                        <div className="tac fs12 c707">问答</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="repository_top_div c101"></div>
                <div className="repository_tabs c101">
                  <Tabs tabs={this.state.tabs}
                      initialPage={0}
                      swipeable={false}
                      onChange={(tab, index) => {this.get_article(tab)}}
                  >
                    <div className="flex-no padding-b50">
                      <div className="repository_list">
                        {
                          this.state.repository1.map((data:any)=>(
                            <div className="repository_new_data bff" onClick={()=>{this.props.history.push({pathname:'/articleDetails',state:{datas:JSON.stringify(data)}})}}>
                              <div className="repository_img">
                                <div><img src={data.img_url} alt=""/></div>
                              </div>
                              <div className="padding10">
                                <div className="margin-t fs18">{data.title}</div>
                                <div className="margin-t fs14 c999 xh95 overhi">{data.description}</div>
                                <div className="flex margin-t fs14 cada"><img className="simg br" src={data.author_head_img}></img><div className="v-item">{data.author}</div></div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      <div className="repository_list">
                        {
                          this.state.repository2.map((data:any)=>(
                            <div className="repository_new_data bff" onClick={()=>{this.props.history.push({pathname:'/articleDetails',state:{datas:JSON.stringify(data)}})}}>
                              <div className="repository_img">
                                <div><img src={data.img_url} alt=""/></div>
                              </div>
                              <div className="padding10">
                                <div className="margin-t fs18">{data.title}</div>
                                <div className="margin-t fs14 c999 xh95 overhi">{data.description}</div>
                                <div className="flex margin-t fs14 cada"><img className="simg br" src={data.author_head_img}></img><div className="v-item">{data.author}</div></div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </Tabs>
                </div>
              </div>
            </TabBar.Item>
            <TabBar.Item
              title="购物车"
              key="ShoppingCart"
              selected={this.state.selectedTab === "ShoppingCart"}
              onPress={() => {
                // if (UIUtil.not_weixin()) {
                //   UIUtil.showInfo("请在微信浏览器打开！");
                //   return;
                // }
                this.setState({
                  ...this.state,
                  selectedTab: "ShoppingCart"
                });
                this.props.history.push("#ShoppingCart");
                UserStorage.setCookie("type", "ShoppingCart");

              }}
              icon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background:
                      "url(" +
                      tab_buycart_n +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: "#1FA4FC",
                    background:
                      "url(" +
                      tab_buycart +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
            >
              <div className="shoppingcart" style={{ height: pageheight-50, width: pagewidth}}>
                <NavBar className="home-navbar">购物车</NavBar>
                <List>
                  <List.Item thumb={order1}>暨妒商城</List.Item>
                </List>
                <div className="cart_list margin-t bff os" style={{ height: pageheight-192}}>
                  {
                    this.state.buycartList.map((data:any,index:string)=>(
                    <List>
                      <SwipeAction
                        style={{ backgroundColor: 'gray'}}
                        autoClose
                        right={[
                          {
                            text: '删除',
                            onPress: () => {
                                UserService.Instance.delete_shop_car(data.id).then( (res:any) => {
                                    Modal.alert('提示', '删除成功');
                                    UserStorage.setCookie('bank','')
                                    this.getbuycarts();
                                }).catch( err => {
                                    const message = (err as Error).message
                                    Toast.fail(message)
                                })
                            },
                            style: { backgroundColor: '#F4333C', color: 'white' },
                            },    
                          ]}
                          >
                          <div className="flex-no">
                            <div className="w75">
                              <CheckboxItem checked={this.state.cartgoods[index]} onChange={(e:any) => this.onChange(e,index)}>
                              <div className="flex-no"  onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.param.goods.goodsid}})}}>
                                <div className="cart_img padding-r1"><img src={data.param.goods.img_url} alt=""/></div>
                                <div className="fs14 h60 text-p padding-r1">{data.param.goods.goodsname}</div>
                              </div>
                            </CheckboxItem>
                            </div>
                            <div className="fs12 padding-t margin-r">
                              <div className="tac fs16">¥{data.totalprices}</div>
                              <div className="flex-no margin-t">
                                <div className="w02" data-index={index} onClick={this.downnum}><img src={downicon}/></div>
                                <div className="fs16 padding-lr w03 tac">{data.num}</div>
                                <div className="w02" data-index={index} onClick={this.upnum}><img src={upicon}/></div>
                              </div>
                            </div>
                          </div>
                          <div className="c88f w100 tar fs12 padding-lrb">{data.goodssize}</div>
                        </SwipeAction>
                      </List>
                    ))
                  }
                </div>
                <div className="foot_cart">
                  <div className="cart_pay bff flex flex-j-sb">
                    <CheckboxItem onChange={(e:any) => this.onChange(e,'x')}>
                        <div className="padding-l2">
                          <div className="fs16">总计（不含税）：<span className="cred">¥{this.state.cartprices}</span></div>
                          <div className="fs10 cb3b">运费：<span>{this.state.cartfreight == '0.00'?"免运费":'¥'+this.state.cartfreight}</span></div>
                        </div>
                    </CheckboxItem>
                    <div className="showpay" onClick={this.showpay}>结算</div>
                  </div>
                </div>
              </div>
            </TabBar.Item>
            <TabBar.Item
              title="个人中心"
              key="MyTab"
              selected={this.state.selectedTab === "MyTab"}
              onPress={() => {
                if (UIUtil.not_weixin()) {
                  UIUtil.showInfo("请在微信浏览器打开！");
                  return;
                }
                this.setState({
                  // ...this.state,
                  selectedTab: "MyTab"
                  // goQuestion: false
                });
                this.props.history.push("#MyTab");
                UserStorage.setCookie("type", "MyTab");
              }}
              icon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    background:
                      "url(" +
                      tab_my_n +
                      ") center center /  21px 21px no-repeat"
                  }}
                />
              }
              selectedIcon={
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    color: "#1FA4FC",
                    background:
                      "url(" + tab_my + ") center center /  21px 21px no-repeat"
                  }}
                />
              }
            >
              <div className="index-my" style={{ height: (pageheight), width: pagewidth}}>
                <div className="my_content pr">
                  <div className="my-setting pa" onClick={()=>{this.props.history.push("/setting")}}><img src={setting} alt=""/></div>
                  <div className={"pa "+(this.state.hasmsg?'my-msg-dom':'none')}></div>
                  <div className="my-message pa" onClick={()=>{this.props.history.push("/message")}}><img src={message} alt=""/></div>
                  <div className="my_profile_list bff br pa">
                    <div className="my_haed">
                      <img
                        className="my_logo"
                        src={ (this.state.userInfo && this.state.userInfo.headimgurl) || defaults }
                      />
                    </div>
                    <div className="my_nickname flex flex-j-sb">
                        <div>{this.state.userInfo && this.state.userInfo.nickname}</div>
                        {/* <div>用户呢称</div> */}
                        <div className={"my_add fs12 padding-txs "+ (this.state.userInfo.is_daili == 1?'':'none')}> 代理等级{this.state.userInfo && this.state.userInfo.manage_status} </div>
                    </div>
                    <div className="flex flex-j-sa w85 margin-a padding-tm">
                      <div onClick={()=>{this.props.history.push({pathname:'/collection',state:{id:'1'}})}}>
                        <div className="fs13">{this.state.userInfo.favorite_num}</div>
                        <div className="padding-txs fs13 c179">收藏</div>
                      </div>|
                      <div className="pr" onClick={()=>{this.props.history.push({pathname:"/order",state:{type:1}})}}>
                        <div className="fs13">{this.state.userInfo.order_num}</div>
                        <div className="padding-txs fs13 c179">待付款</div>
                        <div className={"pa domred2 " + (this.state.userInfo.daifukuan == 1?'':'none')}></div>
                      </div><span className={this.state.userInfo.is_fenxiao == 1?'':'none'}>|</span>
                      <div className={this.state.userInfo.is_fenxiao == 1?'':'none'} onClick={()=>{this.props.history.push("/myTeam");}}>
                        <div className="fs13">{this.state.userInfo.tuiguang}</div>
                        <div className="padding-txs fs13 c179">推广奖励</div>
                      </div><span className={this.state.userInfo.is_daili == 1?'':'none'}>|</span>
                      <div className={this.state.userInfo.is_daili == 1?'':'none'} onClick={()=>{this.props.history.push("/myTeam2");}}>
                        <div className="fs13">{this.state.userInfo.shequn}</div>
                        <div className="padding-txs fs13 c179">社群奖励</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w100 h30 bf2"></div>
                <List className="">
                  <List.Item extra="查看全部" arrow="horizontal" onClick={()=>{this.props.history.push({pathname:"/order",state:{type:0}});}}>我的订单</List.Item>
                  <div className={this.state.userInfo && this.state.userInfo.isread_status == '1'?"doc":'none'}>·</div>
                  <Grid
                    data={myOrder}
                    hasLine={false}
                    onClick={this.myOrder}
                    columnNum={5}
                    renderItem={(dataItem:any) => (
                      <div>
                        <img src={dataItem.icon} style={{ width: '0.25rem', height: '0.25rem' }} alt="" />
                        <div style={{ color: '#5c5c5c', fontSize: '12px', marginTop: '0.05rem' }}>{dataItem.text}</div>
                      </div>
                    )}
                  />
                </List>
                
                <List className="">
                <List.Item>我的服务</List.Item>
                  <div className={this.state.userInfo && this.state.userInfo.isread_status == '1'?"doc":'none'}>·</div>
                  <Grid
                    data={myService}
                    hasLine={false}
                    onClick={this.myService}
                    columnNum={4}
                    renderItem={(dataItem:any) => (
                      <div>
                        <img src={dataItem.icon} style={{ width: '0.25rem', height: '0.25rem' }} alt="" />
                        <div style={{ color: '#5c5c5c', fontSize: '12px', marginTop: '0.05rem' }}>{dataItem.text}</div>
                        <div style={{ color: '#999', fontSize: '10px'}}>{dataItem.content}</div>
                      </div>
                    )}
                  />
                </List>
                
              </div>
            </TabBar.Item>
          </TabBar>
        </div>
        <div className={this.state.isBG?"bg_back":'none'}>
          <div className={this.state.showpay?"success_box":'none'}>
            <List>
              {/* <List.Item extra={this.state.addchange} arrow="horizontal" onClick={()=>{this.props.history.push('/address')}}>收货地址</List.Item> */}
              <List.Item extra="X" onClick={this.closeselect}>请确认提交</List.Item>
              <List.Item extra="快递">配送</List.Item>
              {/* <List.Item extra="暂无" arrow="horizontal">优惠券</List.Item> */}
              <List.Item extra="微信支付" arrow="horizontal">支付方式</List.Item>
              <List.Item extra={<div className="">总计（不含税）：<span className="cred">¥{this.state.cartprices}</span></div>}>应付总额</List.Item>
              <List.Item thumb={<CheckboxItem onChange={(e:any) => this.onChange(e,'z')}>本人同意并接受一下协议</CheckboxItem>} extra=""></List.Item>
              <Button onClick={this.goorder}>提交订单</Button>
            </List>
          </div>
          <div className={this.state.changepay?"success_box":'none'}>
            
          </div>
        </div>
      </div>
    );
  }
}
