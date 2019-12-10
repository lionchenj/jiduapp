import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, Toast, Modal, SegmentedControl, List, Button, Carousel, Stepper, Accordion } from "antd-mobile";
import { History, Location } from "history";
// import good1 from "../../assets/appimg/good1.png";
import cart from "../../assets/appimg/tab4-2.png";
import coll from "../../assets/appimg/goodscoll.png";
import defaults from "../../assets/default.png";
import collection_bg from "../../assets/collection_bg.png";
import star from "../../assets/appimg/start.png";
import star_n from "../../assets/appimg/start_n.png";
import { UserService } from '../../service/UserService';
import { UserStorage } from '../../storage/UserStorage';
import { UIUtil } from '../../utils/UIUtil';
import { Util } from "src/utils/Util";
import articelcoll from "../../assets/appimg/article-collection.png";
// const district = [
//   {
//     label:'1',
//     value:'至1'
//   },
//   {
//     label:'2',
//     value:'至2'
//   },
//   {
//     label:'3',
//     value:'至3'
//   }
// ]

let lv = 0;
interface goodsDetailsProps {
  history: History;
  location: Location;
}

interface goodsDetailsState {
    selectedCoinId:number;
    isBG:boolean;
    showbuy:boolean;
    showsize:boolean;
    setbox:string;
    setboxt:string;
    setboxclass:string;
    bannerState:boolean;
    banners:any;
    pickerArea:any;
    goodssizeid:string;
    goodssize:string;
    sizeid:string;
    sizevalue:string;
    sizetid:string;
    sizetvalue:string;
    setSize:string;
    setcollextion:boolean;
    goodsname:string;
    description:string;
    details:string;
    freight:string;
    serviceDescp:string;
    format_name:any;
    price:number;
    numValue:number;
    addcart:boolean;
    img_url:string;
    goodsid:string;
    goods_commit:any;
    deliveryStar:number;
    is_xinashi:boolean;
    endTime:any;
    oneprice:number;
    favorite:number;
    goodsqa:any;
    allqa:any;
    skuids:any;
    couponid:string;
}
let he = document.documentElement.clientHeight;
export class goodsDetails extends React.Component<goodsDetailsProps, goodsDetailsState> {
  lv: any;
  downtime:any;
  names:any;
  idstring:any;
  skujson:string;
  constructor(props: goodsDetailsProps) {
    super(props);
    this.downtime = [];
    this.names = [];
    this.idstring = [];
    this.skujson = '';
    this.state = {
        selectedCoinId:0,
        isBG:false,
        showbuy:false,
        showsize:false,
        setbox:'',
        setboxt:'',
        setboxclass:'',
        bannerState:true,
        banners:[],
        pickerArea:[],
        goodssizeid:'',
        goodssize:'请选择',
        sizetid:'',
        sizetvalue:'',
        sizeid:'',
        sizevalue:'',
        setSize:'1',
        setcollextion:false,
        goodsname:'',
        description:'',
        details:'',
        freight:'',
        serviceDescp:'',
        price:0,
        format_name:[],
        numValue:1,
        addcart:false,
        img_url:'',
        goodsid:'',
        goods_commit:[],
        deliveryStar:0,
        is_xinashi:false,
        endTime:'',
        oneprice:0,
        favorite:0,
        goodsqa:[],
        allqa:[],
        skuids:[],
        couponid:''
    };
  }
componentDidMount() {
  if(!this.props.location.state){
    clearInterval(this.downtime);
    this.props.history.push('/')
    return;
  }
  let couponid = this.props.location.state.couponid||'';
  let id = this.props.location.state.id;
  // let id = '303'
  this.getDetails(id);
  this.goods_commit(id);
  let that = this;
  setTimeout(() => {
    that.setState({
      couponid,
      goodsid:id,
      bannerState: true
    })
  }, 1000);
}
onRedirectBack = () => {
  clearInterval(this.downtime);
  const history = this.props.history;
  history.push('/');
};
//获取评价
goods_commit = (id:string) => {
  UserService.Instance.goods_commit(id).then( (res:any) => {
    var userreg = /^(.).+(.)$/g;//加密用户名
    res.data.map((data:any)=>{
      data.member.nickname.replace(userreg, "*$2")
    })
    this.setState({
      goods_commit:res.data,
    })
    UIUtil.hideLoading();
  }).catch( err => {
      UIUtil.hideLoading()
      UIUtil.showError(err)
  })
}
//判断id
pids = (id:string) =>{
  id.indexOf('4')
}
//获取详情
getDetails = (id:string) => {
  UIUtil.showLoading("加载中");
  UserService.Instance.goods_details(id).then( (res:any) => {
    let banners = res.data.banner
    banners = banners.split(",");
    let format = res.data.format_name;
    let minids = res.data.attrbute_string.split(',');
    lv = format.length;
    format.map((data:any)=>{
      data.children.map((res:any)=>{
        let id:any = [];
        res.param.map((e:any)=>{
          id.push(e.id)
        })
        res['ids'] = id.join()
        if(res.param.length == 0){
          res['ishas'] = true;
        }else{
          res['ishas'] = false;
        }
        res['isIt'] = false;
      })
    })
    let times = 0;
    let skustring:any = []
    // let oneset = true;
    format.map((data:any)=>{
      data.children.map((z:any)=>{
        z.param.map((x:any)=>{
          // if(x.price.is_limit == 1 && oneset){
          if(x.price.is_limit == 1 && x.attrbute_string == res.data.attrbute_string){
            times = x.price.end_time;
            this.setState({
              // price:x.price.is_limit == 1?x.price.price:x.price.original_price,
              is_xinashi:x.price.is_limit == 1?true:false,
              endTime:Util.timeDown(times)
            })
            this.names.push(z.title);
            this.idstring.push(z.ids);
            z['isIt'] = true;
            skustring.push(z.id);
            // oneset = false
          }
        })
      })
    });
    this.skujson = skustring.join();
    this.idstring = this.idstring.join();
    this.idstring = this.idstring.split(',');
    var maxCount = 0,
        name='',
        maxItem = '',
        obj = {}
        this.idstring.forEach(function(item:any){
        obj[item] ? (obj[item].count += 1) : obj[item] = {count: 1}
        obj[item].count > maxCount && (maxCount = obj[item].count, maxItem = item)
    })
    this.names.map((data:any)=>{
      name = name+data;
    })
    this.downtimes(times)
    // this.setSizea();
    let qa1:any = [];
    let qa2:any = [];
    res.data.goods_faq.map((data:any)=>{
      if(data.type == 1){
        qa1.push(data)
      }else{
        qa2.push(data)
      }
    })
    this.setState({
      serviceDescp:res.data.serviceDescp,
      goodssizeid:maxItem,
      goodssize:name,
      banners:banners,
      favorite:res.data.favorite,
      img_url:res.data.img_url,
      goodsname:res.data.goodsname,
      freight:res.data.freight,
      description:res.data.description,
      details:res.data.details,
      oneprice:res.data.original_price,
      price:res.data.sku_min_price,
      goodsqa:qa1,
      allqa:qa2,
      format_name:format,
      skuids:minids,
    })
    UIUtil.goodsshare(res.data.goodsname,res.data.img_url,this.props.location.state.id);
    UIUtil.hideLoading();
  }).catch( err => {
      UIUtil.hideLoading()
      UIUtil.showError(err)
  })
}
//商品收藏
favoriteGoods = () => {
  if(this.state.favorite==1){
    this.delfavorQue();
    return;
  }
  UserService.Instance.favorite(this.state.goodsid,1).then( (res:any) => {
  this.getDetails(this.state.goodsid);
  this.goods_commit(this.state.goodsid);
  this.setState({
    setcollextion:true
  })
  }).catch( err => {
    UIUtil.showError(err)
  })
}
//取消收藏
delfavorQue = () => {
  UserService.Instance.cancel_favorite(this.state.goodsid,1).then( (res:any) => {
    this.getDetails(this.state.goodsid);
    this.goods_commit(this.state.goodsid);
    Modal.alert('提示','取消收藏成功')
  }).catch( err => {
      UIUtil.showError(err)
  })
}
//加入购物车
add_shop_car = () => {
  UserService.Instance.add_shop_car(this.state.goodsid,this.state.goodssizeid,this.state.numValue,'0').then( (res:any) => {
    Modal.alert('提示','添加购物车成功')
    this.setState({
      isBG:false,
      showbuy:false,
      showsize:false,
      addcart:false,
    });
  }).catch( err => {
      const message = (err as Error).message
      Toast.fail(message)
  })
}
//切换
changeTab = (e: any) => {
    this.setState({
      selectedCoinId: e.nativeEvent.selectedSegmentIndex * 1
    });
  };
//选择配送地区
changeArea = (v:any) => {
  this.setState({
    pickerArea:v
  })
}
stepperValue = (v:any) => {
  this.setState({
    numValue:v
  })
}
//显示选择规格
changeSize = () => {
  this.setState({
    showbuy:false,
    showsize:true,
  });
}
//套餐选择
changeSetSize = (e:any) => {
  let id = e.currentTarget.dataset.id;
  this.setState({
    setSize:id,
  })
}

//选择
setSize = (e:any) => {
  let isno = e.currentTarget.dataset.isno;
  if(isno == 'true'){
    return
  }
  let title = e.currentTarget.dataset.title;
  let id = e.currentTarget.dataset.id;
  let list = this.state.format_name;
  let skujsons:any = [];
  for(let x in list){
    if(title == list[x].title){
      for(let z in list[x].children){
        if(list[x].children[z].id == id) {
          list[x].children[z].isIt = !list[x].children[z].isIt;
          if(list[x].children[z].isIt){
            skujsons.push(list[x].children[z].id)
          }
          for(let y in list[x].children[z].param){
            let skujson = skujsons.join();
            if(list[x].children[z].param[y].attrbute_string.indexOf(skujson) != -1){
              this.setState({
                price:list[x].children[z].param[y].price.is_limit == 1?list[x].children[z].param[y].price.price:list[x].children[z].param[y].price.original_price,
                is_xinashi:list[x].children[z].param[y].price.is_limit == 1?true:false,
                endTime:Util.timeDown(list[x].children[z].param[y].price.end_time)
              })
              if(list[x].children[z].param[y].residue_stock != 0){
                list[x].children[z].ishas = false;
              }else{
                list[x].children[z].ishas = true;
              }
            }
          }
        }else{
          list[x].children[z].isIt = false;
        }
      }
    }
  }
  this.skujson = skujsons.join();
  this.setState({
    format_name:list,
    sizeid:id,
    sizevalue:e.currentTarget.dataset.v
  })
}
setSizet = (e:any) => {
  let id = e.currentTarget.dataset.id;
  this.setState({
    setboxt:id,
    sizetid:id,
    sizetvalue:e.currentTarget.dataset.v
  })
}
//确认sku
setSizea = () => {
  let lvs = 0;
  let format = this.state.format_name;
  let name:any=[];
  this.names = [];
  this.idstring = [];
    format.map((data:any)=>{
      data.children.map((res:any)=>{
        if(res.isIt){
          lvs++;
          this.names.push(res.title)
          this.idstring.push(res.ids)
        }
      })
    })
    // idstring = idstring.join().replace(/,/g, "");
    this.idstring = this.idstring.join();
    this.idstring = this.idstring.split(',');
    var maxCount = 0,
        maxItem = '',
        obj = {}
        this.idstring.forEach(function(item:any){
        obj[item] ? (obj[item].count += 1) : obj[item] = {count: 1}
        obj[item].count > maxCount && (maxCount = obj[item].count, maxItem = item)
    })
    this.names.map((data:any)=>{
      name.push(data);
    })
    var times = 0
    format.map((data:any)=>{
      data.children.map((res:any)=>{
        if(res.isIt){
          res.param.map((x:any)=>{
            if(maxItem == x.id){
              times = x.price.end_time
              this.setState({
                price:x.price.is_limit == 1?x.price.price:x.price.original_price,
                is_xinashi:x.price.is_limit == 1?true:false,
                endTime:Util.timeDown(times)
              })
            }
          })
        }
      })
    })
  this.downtimes(times)
  if(lv != lvs){
    Modal.alert('提示','请选择完整规格/套装')
    return;
  }
  this.setState({
    goodssizeid:maxItem,
    goodssize:name.join(),
    showbuy:true,
    showsize:false,
  })
}
//倒计时
downtimes = (times:number) => {
  this.downtime = setInterval(() => {
    if(times<0){
      this.setState({
        is_xinashi:false,
        price:this.state.oneprice
      })
      clearInterval(this.downtime);
      return;
    }
    this.setState({
      endTime:Util.timeDown(times)
    })
  }, 1000);
}
  //打开弹窗
openselect = () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  });
  this.setState({
    isBG:true,
    showbuy:true,
  });
}
openselect2 = () => {
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: 'smooth',
  });
  this.setState({
    isBG:true,
    addcart:true,
  });
}
  //关闭弹窗
setCollextion=()=>{
  this.setState({
      isBG:false,
      showbuy:false,
      showsize:false,
      addcart:false,
    });
}
//确认购买
buy = () => {
  if(this.state.goodssize == ''){
    UIUtil.showInfo('请选择规格');
    return;
  }
  if(this.state.numValue == 0){
    UIUtil.showInfo('请输入数量');
    return;
  }
  clearInterval(this.downtime);
  this.props.history.push({pathname:"/orderconfirm",state:{
    img_url:this.state.img_url,
    goodsname:this.state.goodsname,
    goodssize:this.state.goodssize,
    goodssizeid:this.state.goodssizeid,
    numValue:this.state.numValue,
    price:this.state.price,
    freight:this.state.freight,
    goodsid:this.state.goodsid,
    couponid:this.state.couponid,
  }});
}
closeselect = () => {
    this.setState({
      isBG:false,
      showbuy:false,
      showsize:false,
      addcart:false,
    });
}
  public render() {
    return (
      <div className={"message-container "+(this.state.isBG?"oh":'')} style={{height: he, backgroundColor: '#ffffff' }}>
        <div className={this.state.isBG?"bg_back":'none'}>
          <div className={this.state.showbuy?"success_box":'none'}>
            <List>
              <List.Item extra="X" onClick={this.closeselect}><span className="cce0">¥{this.state.price*this.state.numValue}</span>（库存充足）</List.Item>
              <List.Item arrow="horizontal" onClick={this.changeSize}>规格/套装</List.Item>
              <List.Item>{this.state.goodssize}</List.Item>
              <List.Item extra={<Stepper min={0} showNumber={true} defaultValue={1} onChange={this.stepperValue}/>}>数量：</List.Item>
              <Button className="bd5e cfff" onClick={this.buy}>确认购买</Button>
            </List>
          </div>
          <div className={this.state.addcart?"success_box":'none'}>
            <List>
              <List.Item extra="X" onClick={this.closeselect}><span className="cce0">¥{this.state.price*this.state.numValue}</span>（库存充足）</List.Item>
              <List.Item arrow="horizontal" onClick={this.changeSize}>规格/套装</List.Item>
              <List.Item>{this.state.goodssize}</List.Item>
              <List.Item extra={<Stepper min={0} showNumber={true} defaultValue={1} onChange={this.stepperValue}/>}>数量：</List.Item>
              <Button className="bd5e cfff" onClick={this.add_shop_car}>加入购物车</Button>
            </List>
          </div>
          <div className={this.state.showsize?"success_box":'none'}>
            <List>
              <List.Item extra="X" onClick={this.closeselect}>规格/套装</List.Item>
            </List>
            <div className="flex">
              <div className="details-select-img"><img src={this.state.img_url} alt=""/></div>
              <div>
                <div className="c333 fs15">{this.state.goodsname}</div>
                <div className="cce0 fs11 margin-t">¥<span className="fs15">{this.state.price}</span></div>
                <div className="c999 fs11 margin-tsm">请选择规格/套餐</div>
                <div className="c666 fs11 margin-tsm">库存充足</div>
              </div>
            </div>
            <div>
            {
              this.state.format_name.map((data:any,index:string)=>(
                <div className="padding borcccb" key={index}>
                  <div className="c333">{data.title}</div>
                  <div className="flex flex-w margin-tsm">
                    {data.children.map((res:any)=>(
                      <div className={"size-box "+ (res.ishas?"setNo":res.isIt?'setbox':'')} data-isit={res.isIt} data-isno={res.ishas} data-idt={data.id} data-id={res.id} data-ids={res.ids} data-title={data.title} data-v={res.title} onClick={this.setSize}>{res.title}</div>
                    ))}
                  </div>
                </div>
              ))
            }
            </div>
            <Button className="bd5e cfff" onClick={this.setSizea}>确认</Button>
          </div>
        </div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">商品详情</div>
        </NavBar>
        <div className={"w100 fixed999 "+(this.state.setcollextion?'':'none')} style={{height: he-100}}><img src={collection_bg} alt="" onClick={()=>{this.setState({setcollextion:false})}}/></div>
        <div className="os padding-txl" style={{height: he-100}}>

          <div>
            <Carousel autoplay={this.state.bannerState} infinite={true} dots>
              {
                this.state.banners.map((val: any, index: string) => (
                  <div className="details-img w100" key={index}><img src={val}></img></div>
                ))
              }
            </Carousel>
          </div>
          <div>
            <div className="padding">
              <div className="flex">
                <div className="fs13 cce0 margin-r">¥<span className="fs18">{this.state.price}</span></div>
                <div className="fs11 c666 margin-r td">原价:¥{this.state.oneprice}</div>
                <div className={"cfff bd5e padding05 " + (this.state.is_xinashi?'':'none')}>限时购</div>
              </div>
              <div className={"padding cred " + (this.state.is_xinashi?'':'none')}>限时购还有<span>{this.state.endTime}</span>结束</div>
              {/* <div className="flex margin-t">

                <div className={'margin-rs '+(this.state.setSize=='1'?'select-yes':'select-no')} data-id="1" onClick={this.changeSetSize}>一件装 | 单件46元</div>
                <div className={'margin-rs '+(this.state.setSize=='2'?'select-yes':'select-no')} data-id="2" onClick={this.changeSetSize}>三件装 | 单件36元</div>

              </div> */}
              <div>
                <div className="fs16 margin-t">{this.state.goodsname}</div>
                <div className="fs12 c999 margin-tl">{this.state.description}</div>
              </div>
            </div>
            {/* <Picker data={district} cols={1} className="forss" value={this.state.pickerArea} onChange={this.changeArea}>
              <List.Item arrow="horizontal">配送：至</List.Item>
            </Picker> */}
            <List>
              <List.Item extra={this.state.freight == '0'?"免运费":this.state.freight}>运费</List.Item>
              {/* <List.Item extra={this.state.serviceDescp}>说明</List.Item> */}
            </List>
            <Accordion className="my-accordion">
              <Accordion.Panel header="说明">
                <div className="padding">{this.state.serviceDescp}</div>
              </Accordion.Panel>
            </Accordion>
          </div>
          <div>
            <div className="padding bff flex flex-j-sb margin-t">
              <div>商品评价</div>
              {/* <div className="cred">好评999</div> */}
            </div>
            <div>
              {
                this.state.goods_commit.map((data:any)=>(
                  <List>
                    <div className="flex-no padding">
                      <div className="headimg br"><img src={data.member.headimgurl||defaults} alt=""/></div>
                      <div className="margin-l">
                        <div className="flex c999 fs12">
                          <div>{data.member.nickname}</div>
                          <div className="comment flex">
                                <img src={data.avg > 0?star:star_n} data-index='1'/>
                                <img src={data.avg > 1?star:star_n} data-index='2'/>
                                <img src={data.avg > 2?star:star_n} data-index='3'/>
                                <img src={data.avg > 3?star:star_n} data-index='4'/>
                                <img src={data.avg > 4?star:star_n} data-index='5'/>
                            </div>
                        </div>
                        <div className="margin-tsm fs14">{data.content}</div>
                        <div className="margin-tsm c999 fs12">
                          <div>{Util.formatDate(data.create_time*1000,6)}</div>
                          <div className="margin-tsm">{data.param}</div>
                        </div>
                      </div>
                    </div>
                  </List>
                ))
              }
            </div>
            <div className="question_tab">
              <SegmentedControl
                values={["图文详情", "使用答疑"]}
                selectedIndex={this.state.selectedCoinId}
                onChange={this.changeTab}
                style={{
                  height: ".35rem",
                  maxWidth: "3.45rem",
                  margin: "auto"
                }}
              />
            </div>
            <div className={this.state.selectedCoinId == 0 ? "bff" : "none"}>
              <div className="padding-lrt">产品信息</div>
              <div className="about_content goods-info" dangerouslySetInnerHTML={{__html: this.state.details}} />
            </div>
            <div className={this.state.selectedCoinId == 1 ? "bff" : "none"}>
              <div className="tac padding">商品FAQ</div>
              <Accordion defaultActiveKey="0" className="my-accordion">
                {this.state.goodsqa.map((data:any,index:string)=>(
                    data.type == 1?
                    <Accordion.Panel header={(index+1)+"."+data.title}>
                      <div className="goodsqa" dangerouslySetInnerHTML={{__html: data.content}} />
                        {/* <div className="goodsqa">{data.content}</div> */}
                    </Accordion.Panel>:''
                ))}
              </Accordion>
              <div className="tac padding">常见疑问</div>
              <Accordion defaultActiveKey="0" className="my-accordion">
                {this.state.allqa.map((data:any,index:string)=>(
                    data.type == 1?'':
                    <Accordion.Panel header={(index+1)+"."+data.title}>
                      <div className="goodsqa" dangerouslySetInnerHTML={{__html: data.content}} />
                        {/* <div className="goodsqa">{data.content}</div> */}
                    </Accordion.Panel>
                ))}
              </Accordion>
            </div>
          </div>
        
        </div>
        <div className="h55"></div>
        <div className="flex tac margin-t bff foot-fixed">
            <div className="w15" onClick={this.favoriteGoods}><img className="w02" src={this.state.favorite==1?coll:articelcoll} alt=""/><div>收藏</div></div>
            <div className="w15" onClick={()=>{UserStorage.setCookie("type",'ShoppingCart');clearInterval(this.downtime);this.props.history.push('/')}}><img className="w02" src={cart} alt=""/><div>购物车</div></div>
            <div className="w35 b3e3 cd5e padding-tb2" onClick={this.openselect2}>加入购物车</div>
            <div className="w35 bd5e cfff padding-tb2" onClick={this.openselect}>立即购买</div>
        </div>
      </div>
    );
  }
}
