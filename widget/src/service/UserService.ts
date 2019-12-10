import { ServiceBase } from "./ServiceBase";
import { UserStorage } from "../storage/UserStorage";
import { model } from "../model/model";

export class UserService extends ServiceBase {

    private static _instance: UserService
    public static get Instance(): UserService {
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        super()
    }
    //判断是否登陆
    public isLogined(): boolean {
        if (ServiceBase.length > 0) {
            return true
        }
        const accessToken = UserStorage.getCookie("token");
        if (accessToken) {
            ServiceBase.accessToken = accessToken
            return true
        }
        return false
    }
    //登陆
    public async wechatLogin(params: any): Promise<void> {
        return await this.httpPost("wechatlogin", params)
    }
    //获取手机验证码
    public async getMobileMassges(mobile: string): Promise<void> {
        const params = {
            mobile: mobile,
        }
        return await this.httpPost("get_mobile_massges", params)
    }
    //修改手机号码
    public async bindmobile(mobile: string, verification_code: string): Promise<void> {
        const params = {
            mobile: mobile,
            verification_code: verification_code
        }
        return await this.httpPost("bindmobile", params)
    }
    //个人信息
    public async getUserInfo(): Promise<model.User> {
        const resp = await this.httpPost("get_user_info")
        if (resp.data) {
            return resp.data as model.User
        } else {
            return resp
        }
    }
    //我的收藏
    public async myFavorite(type: string): Promise<void> {
        return await this.httpPost("my_favorite", { type })
    }
    /**
     * 添加收藏
     * @param id 收藏id
     * @param type 收藏类型：1、商品、2、文章
     */
    public async favorite(id: string, type: number): Promise<void> {
        return await this.httpPost("favorite", { id, type })
    }
    //取消收藏
    public async cancel_favorite(id: string, type: number): Promise<void> {
        return await this.httpPost("cancel_favorite", { id, type })
    }
    /** 首页 */
    //轮播
    public async banner(type: string): Promise<any> {
        return await this.httpPost("banner", { type })
    }
    //首页icon
    public async index_icon(): Promise<any> {
        return await this.httpPost("index_icon")
    }
    //配置
    public async get_index_config(): Promise<any> {
        return await this.httpPost("get_index_config")
    }
    //商品分类
    public async goods_category(): Promise<any> {
        return await this.httpPost("goods_category")
    }
    //商品列表
    public async goods_lists(category_id: string, params?: any): Promise<any> {
        let data: any = {}
        if (!params) {
            data['category_id'] = category_id;
        } else {
            data = params;
            data['category_id'] = category_id;
        }
        return await this.httpPost("goods_lists", data)
    }
    //商品详情
    public async goods_details(goods_id: string): Promise<any> {
        return await this.httpPost("goods_details", { goods_id })
    }
    //推荐搜索
    public async search_recommend(): Promise<any> {
        return await this.httpPost("search_recommend")
    }
    //搜索
    /**
     * 
     * @param search 搜索的商品名称
     * @param type 商品性质
     * @param freight 是否免运费：1、是
     * @param lowest_price 最低价格
     * @param higest_price 最高价格
     * @param sort 价格排序：1、升序、2、降序
     * @param page 分页
     */
    public async search_goods(params: any): Promise<any> {
        return await this.httpPost("search_goods", params)
    }
    //我的购物车
    public async my_shop_car(): Promise<any> {
        return await this.httpPost("my_shop_car")
    }
    /**
     * 加入购物车
     * @param goods_id 商品id
     * @param goods_sku_id 商品SKU的id
     * @param num 商品数量
     * @param is_limit 是否限时秒杀：1、是、0、否
     */
    public async add_shop_car(goods_id: string, goods_sku_id: string, num: number, is_limit: string): Promise<any> {
        return await this.httpPost("add_shop_car", { goods_id, goods_sku_id, num, is_limit })
    }
    //删除购物车商品
    public async delete_shop_car(id: string): Promise<any> {
        return await this.httpPost("delete_shop_car", { id })
    }
    //系统公告
    public async system_bulletin(): Promise<any> {
        return await this.httpPost("system_bulletin")
    }

    //统一上传
    public async uploadFile(file: File): Promise<string> {
        const resp = await this.httpUpload(file)
        return resp.data.data.path as string
    }
    //关于
    public async aboutus(): Promise<void> {
        return await this.httpPost("aboutus")
    }
    //投诉
    public async suggest(content: string, img_url: string): Promise<void> {
        const params = {
            content: content,
            img_url: img_url
        }
        return await this.httpPost("suggest", params)
    }
    /**
    * 添加地址
    * @param name 收货人
    * @param mobile 收货人电话
    * @param province 省
    * @param city 市
    * @param county 区
    * @param address 详细地址
    * @param defaults 是否为默认地址：1、是、2、否
    */
    public async address(name: string, mobile: string, province: string, city: string, county: string, address: string, defaults: string): Promise<void> {
        return await this.httpPost("address", { name, mobile, province, city, county, address, default: defaults })
    }
    //我的地址
    public async my_address(): Promise<void> {
        return await this.httpPost("my_address")
    }
    //删除地址
    public async delete_address(id: string): Promise<void> {
        return await this.httpPost("delete_address", { id })
    }
    /**
    * 修改地址
    * @param name 收货人
    * @param mobile 收货人电话
    * @param province 省
    * @param city 市
    * @param county 区
    * @param address 详细地址
    * @param defaults 是否为默认地址：1、是、2、否
    */
    public async update_address(id: string, name: string, mobile: string, province: string, city: string, county: string, address: string, defaults: string): Promise<void> {
        return await this.httpPost("update_address", { id, name, mobile, province, city, county, address, default: defaults })
    }
    /**
     * 下单
     * @param id 商品id
     * @param num 数量
     * @param money 金额
     */
    public async user_order(goods_id: string, goods_sku_id: string, num: number, money: number, province: string, city: string, county: string, address: string, name: string, mobile: string, is_limit: string,cardlistid:string): Promise<void> {
        return await this.httpPost("user_order", { goods_id, goods_sku_id, num, money, province, city, county, address, name, mobile, is_limit ,cardlistid})
    }
    /**
     * 团购下单
     * @param id 商品id
     * @param num 数量
     * @param money 金额
     */
    public async user_group_order(params:any): Promise<void> {
        return await this.httpPost("user_group_order", params)
    }
    //开团
    public async user_group(orderid:string): Promise<void> {
        return await this.httpPost("user_group",{orderid})
    }
    //购物车下单
    public async user_order_car(id: string, num:string, province: string, city: string, county: string, address: string, name: string, mobile: string): Promise<any> {
        return await this.httpPost("user_order_car", { id, num, province, city, county, address, name, mobile })
    }
    //取消订单
    public async cancel_order(id: string): Promise<void> {
        return await this.httpPost("cancel_order", { id })
    }

    /**
     * 获取申请代理或分销说明
     * @param type 1、代理商申请说明、2、申请分销商说明 
     */
    public async get_description(type: string): Promise<void> {
        return await this.httpPost("get_description", { type })
    }
    /**
     * 申请代理或分销商
     * @param mobile 手机号码
     * @param verification_code 验证码
     * @param type 1、代理申请、2分销申请
     */
    public async apply_for(mobile: string, verification_code: string, type: string): Promise<void> {
        return await this.httpPost("apply_for", { mobile, verification_code, type })
    }

    //获取知识文章分类
    public async get_article_type(): Promise<void> {
        return await this.httpPost("get_article_type")
    }
    //获取知识文章
    public async get_article(type: number): Promise<void> {
        return await this.httpPost("get_article", { type })
    }
    //首页商品列表
    public async index_goods(): Promise<any> {
        return await this.httpPost("index_goods")
    }
    //首页循环公告
    public async index_for_order(): Promise<any> {
        return await this.httpPost("index_for_order")
    }
    //官方问题列表
    public async question_answer(): Promise<any> {
        return await this.httpPost("question_answer")
    }
    //用户问题列表
    public async question_answer_list(): Promise<any> {
        return await this.httpPost("question_answer_list")
    }
    //提问事例
    public async question_answer_example(): Promise<any> {
        return await this.httpPost("question_answer_example")
    }
    //提问
    public async add_question_answer(title: string): Promise<void> {
        return await this.httpPost("add_question_answer", { title })
    }
    //推荐文章搜索
    public async article_search_popular(): Promise<any> {
        return await this.httpPost("article_search_popular")
    }
    //文章搜索
    public async article_search(title: string): Promise<any> {
        return await this.httpPost("article_search", { title })
    }
    //提现大小
    public async get_assetsminmax(): Promise<any> {
        return await this.httpPost("get_assetsminmax")
    }
    /**
     * 提现
     * @param type 1、推广、2、社群
     * @param money 提现金额
     */
    public async add_assets(type: string, money: number, name:string ,cardID:string): Promise<any> {
        return await this.httpPost("add_assets", { type, money, name, cardID })
    }
    //提现记录
    /**
     * @param type ：1、推广、2、社群
     */
    public async get_assets_recording(type: string): Promise<any> {
        return await this.httpPost("get_assets_recording", { type })
    }
    //我的团队
    public async my_teams(): Promise<any> {
        return await this.httpPost("my_teams")
    }
    //推广订单
    public async promotion_order(): Promise<any> {
        return await this.httpPost("promotion_order")
    }

    //我的优惠券
    public async my_coupon(type: number): Promise<Array<model.ICoupon>> {
        const rsp = await this.httpPost("my_coupon", { type })
        return rsp.data as Array<model.ICoupon>
    }
    //我的订单
    public async my_order(type?: number): Promise<any> {
        return await this.httpPost("my_order", { type })
    }
    //领券中心
    public async coupon_center(type:string): Promise<any> {
        return await this.httpPost("coupon_center",{type})
    }
    //领取优惠券
    public async add_coupon(id: string): Promise<any> {
        return await this.httpPost("add_coupon", { id })
    }
    //获取微信id
    public async wechat_info(): Promise<any> {
        return await this.httpPost("wechat_info")
    }
    //评价
    public async comment(orderid: string, content: string, deliveryStar: number, serviceStar: number, goodStar: number,goods_id:string, img_url: string): Promise<any> {
        return await this.httpPost("comment", { orderid, content, deliveryStar, serviceStar, goodStar, goods_id, img_url })
    }
    //付钱
    public async pay_order(id: string): Promise<any> {
        return await this.httpPost("pay_order", { id })
    }
    //付钱test
    public async pay_order_test(id: string): Promise<any> {
        return await this.httpPost("pay_order", { id })
    }
    public async nation_address(): Promise<any> {
        return await this.httpPost("nation_address")
    }
    //代理分销开关
    public async witch_agent(): Promise<any> {
        return await this.httpPost("witch_agent")
    }
    //直接成为代理或分销
    public async member_agent(type: string): Promise<any> {
        return await this.httpPost("member_agent", { type })
    }
    //商品评价
    public async goods_commit(goods_id: string): Promise<any> {
        return await this.httpPost("goods_commit", { goods_id })
    }
    //调微信
    public async get_sign_package(url: string): Promise<any> {
        return await this.httpPost("get_sign_package", { url })
    }
    //修改头像
    public async update_head(headimgurl: string): Promise<any> {
        return await this.httpPost("member_update", { headimgurl })
    }
    //修改用户名
    public async update_name(nickname: string): Promise<any> {
        return await this.httpPost("member_update", { nickname })
    }
    //裂变券详情
    public async add_share_detail(orderid: string): Promise<any> {
        return await this.httpPost("add_share_detail", { orderid })
    }
    //裂变券领取
    public async add_share_coupon(orderid: string): Promise<any> {
        return await this.httpPost("add_share_coupon", { orderid })
    }

    // 限时购
    public async getTimeLimitColumn(): Promise<Array<model.TimeLimitColumn>> {
        const rsp = await this.httpGet("timelimit/column")
        return rsp.data as Array<model.TimeLimitColumn>
    }

    // 限时购某个活动下的商品列表
    public async getTimeLimitGoodsList(activityId: number, page: number, limit = 10): Promise<{ goodsList: Array<model.TimeLimitGoods>, isLastPage: boolean }> {
        const params = {
            activity_id: activityId,
            page: page,
            limit: limit
        }
        const rsp = await this.httpPost("timelimit/goods_list", params)
        const goodsList = rsp.data.data as Array<model.TimeLimitGoods>
        const isLastPage = rsp.data.current_page == rsp.data.total
        return { goodsList, isLastPage }
    }
    // 团购商品列表
    public async index_goods_group(): Promise<any> {
        return await this.httpPost("index_goods_group")
    }

    //团购商品详情
    public async index_goods_detail_group   (goods_id: string): Promise<any> {
        return await this.httpPost("index_goods_detail_group   ", { goods_id })
    }
    //查看物流
    public async get_logistic(id: string): Promise<any> {
        return await this.httpPost("get_logistic", { id })
    }
    //1退款2退货3提醒4确认
    public async cancel_refund(id: string, type: number): Promise<any> {
        return await this.httpPost("cancel_refund", { id, type })
    }

    // 优惠劵兑换码
    public async redeem_coupon(code: string): Promise<void> {
        const params = {
            code: code
        }
        await this.httpPost("redeem_coupon", params)
        return
    }
    //我的社群
    public async get_my_manage(): Promise<any> {
        return await this.httpPost("get_my_manage")
    }
    //首页文章
    public async index_article(): Promise<any> {
        return await this.httpPost("index_article")
    }
    //合单取消
    public async cancel_order_toget(orderid_total:string): Promise<any> {
        return await this.httpPost("cancel_order_toget",{orderid_total})
    }
    //合单退货
    public async cancel_refund_toget(orderid_total:string,type:string): Promise<any> {
        return await this.httpPost("cancel_refund_toget",{orderid_total,type})
    }
    //设置已读消息
    public async read_message(message_id:string,type:number): Promise<any> {
        return await this.httpPost("read_message",{message_id,type})
    }
}