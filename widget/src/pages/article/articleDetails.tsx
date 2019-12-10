import * as React from "react";
// import ReactDOM from "react-dom";
import { NavBar, Icon, Modal } from "antd-mobile";
import { History, Location } from "history";
import coll from "../../assets/appimg/goodscoll.png";
import articelcoll from "../../assets/appimg/article-collection.png";
import defaults from "../../assets/default.png";

import { UserService } from '../../service/UserService';
import { UIUtil } from '../../utils/UIUtil';
import { Util } from "src/utils/Util";
import { UserStorage } from "src/storage/UserStorage";

interface articleDetailsProps {
  history: History;
  location: Location;
}

interface articleDetailsState {
    datas:any;
    indexgoodslist:any;
    iscollection:boolean;
    titleType:string;
}
let he = document.documentElement.clientHeight;
export class articleDetails extends React.Component<articleDetailsProps, articleDetailsState> {
    constructor(props: articleDetailsProps) {
        super(props);
        this.state = {
        datas:{},
        indexgoodslist:[],
        iscollection:false,
        titleType:'推荐'
        };
    }
    componentDidMount() {
      if(!this.props.location.state){
        this.props.history.goBack();
        return
    }
        let data = this.props.location.state.datas;
        data = JSON.parse(data);
        this.setState({
            titleType:UserStorage.getStorage('newType')||'推荐',
            datas:data,
            indexgoodslist:data.goods,
            iscollection:data.isCollection
        })
    }
    onRedirectBack = () => {
        const history = this.props.history;
        history.goBack();
    };
    //收藏
    favoriteGoods = (id:string,type:number) => {
        if(this.state.datas.favorite==1){
          UserService.Instance.cancel_favorite(id,type).then( (res:any) => {
            Modal.alert('提示','取消收藏成功')
            let data = this.state.datas;
            data.favorite=0;
            this.setState({
              datas:data
            })
          }).catch( err => {
              UIUtil.showError(err)
          })
          return;
        }
        UserService.Instance.favorite(id,type).then( (res:any) => {
            Modal.alert('提示','收藏成功')
            let data = this.state.datas;
            data.favorite=1;
            this.setState({
              datas:data
            })
        }).catch( err => {
            UIUtil.showError(err)
            // Toast.info('收藏失败')
        })
    }

  public render() {
    return (
      <div className="message-container" style={{height: he, backgroundColor: '#ffffff' }}>
        <NavBar
          
          icon={<Icon type="left" />}
          onLeftClick={this.onRedirectBack}
          className="home-navbar"
        >
          <div className="nav-title">{this.state.titleType}</div>
        </NavBar>
            <div className="article-title fs18 w100 flex flex-j-c">{this.state.datas.title}<img className="article-collcetion" src={this.state.datas.favorite==1?coll:articelcoll} onClick={()=>{this.favoriteGoods(this.state.datas.id,2)}}/></div>
            {/* <div className="article-head margin-a"><img src={this.state.datas.author_head_img||defaults} alt=""/></div> */}
            <div className="article-head margin-a"><img src={this.state.datas.author_head_img||defaults} alt=""/></div>
            <div className="fs12 c666 tac">{this.state.datas.author}</div>
            <div className="article-time fs12 c999 tac">{Util.formatDate(this.state.datas.update_time*1000)}</div>
            <div className="article-content fs16 bff padding html_content" dangerouslySetInnerHTML={{__html: this.state.datas.content}} />
            <div className="index_goodList margin-tsm">
                    {
                      this.state.indexgoodslist.map((data:any)=>(
                        <div className="index_goods bff padding borcccb" onClick={()=>{this.props.history.push({pathname:'/goodsDetails',state:{id:data.goodsid}})}}>
                          <div className="flex">
                            <div className="tac goods_list"><img src={data.img_url} alt=""/></div>
                            <div className="padding-l2 w100">
                              <div className="fs18 fb">{data.goodsname}</div>
                              <div className="fs12 c999 margin-tl ">{data.content}</div>
                              <div className="flex flex-j-sb margin-tsm">
                                <div className="fs13 ce3e">{data.type == '1'?'我要健康':'其他'}</div>
                                {/* <div className="fs12 c999">22人购买</div> */}
                              </div>
                              <div className="flex flex-j-sb margin-tsm">
                                <div className="fs14 fb cce0">¥<span className="fs22">{data.price}</span></div>
                                {/* <div className="fs12 cd5e padding05 bord5e br" onClick={()=>{this.add_shop_car(data.goodsid,'1')}}>加入购物车</div> */}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
      </div>
    );
  }
}
