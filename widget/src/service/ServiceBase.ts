
import axios from "axios";
import { ApiBaseUrl } from "../utils/Constants";
import qs from "qs";
import { ApiError } from "../utils/ApiError";
import { UserStorage } from "../storage/UserStorage";
import { UIUtil } from "../utils/UIUtil";
import { homePage } from "../utils/Constants";

export abstract class ServiceBase {
   
    protected static accessToken: string

    protected async httpGet(path: string, params: any = {}): Promise<any> {
        return await this.http("get", path, params) 
    }

    protected async httpPost(path: string, params: any = {}): Promise<any> {
        return await this.http("post", path, params) 
    }

    protected async httpUpload(file: File): Promise<any> {
        let url: string = `${ApiBaseUrl}/api/upload`
        const formData = new FormData()
        formData.append("imageFile", file)
        return await axios.post(url, formData, {
            headers: {
                'content-type': 'multipart/form-data',
                'Authorization': 'Bearer '+UserStorage.getCookie("token")
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
            }
        })
    }

    private async http(method: "get"|"post", path: string, params: any): Promise<any> {
        let url: string = `/api/${path}`
        const config = {
            url: url,
            method: method,
            baseURL: ApiBaseUrl,
            headers: {'Authorization': (path == "wechatlogin"?'':'Bearer '+UserStorage.getCookie("token"))},
            params: {},
            data: {}
        }

        if (method === "get") {
            config.params = params
        } else if (method === "post") {
            config.data = qs.stringify(params)
        }
                
        const resp = await axios.request(config)
        if (resp.status < 200 || resp.status > 299) {
            UIUtil.hideLoading();
            throw new Error(`服务器错误。(status:${resp.status},statusText:${resp.statusText})`)
        }
        const errCode: number = parseInt(resp.data.errno)
        if (resp.data.errmsg=="用户不存在，请联系管理员"){
            UIUtil.hideLoading();
            if(UserStorage.getAccessToken()){
                const accessToken = UserStorage.getAccessToken()
                if (accessToken) {
                    ServiceBase.accessToken = accessToken
                }                
            }
        }     
        else if (resp.data.errmsg=="缺少参数：accessToken"){
            UIUtil.hideLoading();
            window.history.go(-1);
            if(UserStorage.getAccessToken()){
                const accessToken = UserStorage.getAccessToken()
                if (accessToken) {
                    ServiceBase.accessToken = accessToken
                }                
            }
        }  
        else if (resp.data.errno=="30002"){
            UIUtil.hideLoading();
            UserStorage.clearAccessToken();
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbfb93569bee3f4f3&redirect_uri="+homePage+"&response_type=code&scope=snsapi_userinfo#wechat_redirect";
        }    
        else if (resp.data.errmsg!="access_token不合法或已过期"&&errCode !== 0) {
            UIUtil.hideLoading();
            const errMsg = resp.data.errmsg
            throw new ApiError(errCode, errMsg)
        }
        return resp.data
    }
}