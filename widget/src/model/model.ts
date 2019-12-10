export namespace model {
  //用户信息
  export interface User {
    errno: string;
    errmsg: string;
    mobile: string;
    nickname: string;
    referee: string;
    renickname: string;
    head_imgurl: string;
    level: number;
    friends_count: number;
    stay_by: number;
  }
  //列表
  export interface TransactionItem {
    orderid: string;
    number: string;
    plusminus: string;
    surplus: string;
    coin_id: string;
    userid: string;
    time: string;
    style: string;
    head_imgurl: string;
  }
  //好友列表
  export interface FriendsList {
    errno: string;
    errmsg: string;
    id: string;
    userid: string;
    nickname: string;
    mobile: string;
    level: string;
    head_imgurl: string;
    time: string;
    user_type: string;
  }
  //data
  export interface data {
    errno: string;
    errmsg: string;
    data: any;
  }
  //分数
  export interface score {
    score: string; //托福@分数
  }
  //注册
  export interface Register {
    // id: "", //用户id
    // page1
    headimgurl: string; //微信授权头像
    nickname: string; //昵称
    wechatnum: string; //微信号
    email: string; //邮箱
    profile: string; //个人简介
    // page2
    adeptCountry: string; //擅长留学国家
    school: string; //学校
    major: string; //专业
    education: string; //学历
    studentimg: string; //学生证
    // page3
    examination: string; //托福@分数
    examination2: string; //新SAT@分数
    examination3: string; //ACT@分数
    examination4: string; //雅思@分数
    examination5: string; //GRE考试@分数
    identity_name: string; //姓名
    identity_phone: string; //手机
    identity_card: string; //身份证
    // page4
    topic: string; //话题标签
    topic2: string; //话题主题标签
    communication: string; //交流方式
    apmentime: string; //预约时间

    // country: string, //国家
    // province: string, //省份
    // adeptEducation: string, //擅长阶段申请
    // schooltype: string, //学校性质
  }
  //我的消息
  export interface myMsg {
    id: string;
    title: string;
    issueid: string;
    type: string;
    content: string;
    is_read:number;
    describe: string;
    question_title: string;
    question_type: string;
    create_time:string;
    update_time: string;
    userid: string;
  }
  export interface bankCardItem {
    id: string,
    bank_number: string,
    bank_username: string,
    bank_name: string,
    type: string
  }
  //订单列表
  export interface myOrder {
    answer_number: string;
    answer_price: string;
    answered_number: string;
    knower_type: string;
    knower_headimgurl: string;
    knower_nickname: string;
    knower_school: string;
    knower_profile: string;
    knower_potic: string;
    knower_mark: string;
    apmentime: string;
    communication: string;
    description: string;
    duration: string;
    fabs: string;
    favo: string;
    favostatus: string;
    headimgurl: string;
    knower_type_id: string;
    knower: string;
    knowerid: string;
    nickname: string;
    openid: string;
    orderid: string;
    price: string;
    question: string;
    question_type: string;
    requirement: string;
    status: string;
    topic: any;
    type: string;
    corderid: string;
    create_time: string;
    id: string;
    sonlist: Array<sonlist>;
    sumPrice: string;
  }
  export interface sonlist {
    answer_number: string;
    answer_price: string;
    answered_number: string;
    create_time: string;
    fabs: string;
    headimgurl: string;
    id: string;
    nickname: string;
    openid: string;
    orderid: string;
    price: string;
    question: string;
    question_type: string;
    status: string;
    userSee: string;
    type: string;
  }

  export interface TimeLimitColumn {
    id: number,
    title: string,
    status: number
  }

  export interface TimeLimitGoods {
    goodsid: number,
    goodsname: string,
    img_url: string,
    original_price: string,
    price: string,
    price_scale: number,
    residue_stock: string,
    stock: string,
    stock_scale: number,
    description: string
  }

  export interface GroupGoods {
    goodsid: number,
    img_url: string,
    goodsname: string,
    stock: string,
    residue_stock: string,
    stock_scale: string,
    sale_stock: string,
    price: string,
    original_price: string,
    price_scale: string,
    user_number: string,
    status: number, //1:正常 2无效
    statdescription: string,
  }

  export interface ICash {
    brand_name: string, // 优惠劵名称
    type: string,
    least: string,  // 使用门槛
    description: string,  // 优惠劵描述
    description_use: string, // 优惠劵使用说明
    reduce: number, // 减免金额
    start_time: number, // 优惠券开始时间/使用时间
    end_time: number,
    goods_id: number,
    is_forever:number,
  }

  export interface ICoupon {
    id: number,
    orderid: number,
    origin:string,
    update_time:number,
    cash: ICash
  }
  export interface IBox {
    id: number,
    orderid: number,
    origin:string,
    cash: ICash
  }
}
