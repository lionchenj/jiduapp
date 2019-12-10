export class Util {
  public static trim(origin: string): string {
    return origin.replace(/\s+/g, "");
  };
  public static validPhone(phone: string): boolean {
    return phone.length == 11;
  };
  public static validPassword(password: string): boolean {
    return password.length >= 6;
  };
  public static formatNumber = (n: any) => {
    n = n.toString();
    return n[1] ? n : "0" + n;
  };
  public static timeDown = (timestr: any) => {
    var now = new Date();    // 当前时间戳
    let time = (timestr*1000-now.getTime())/1000
    let h = Math.floor(time / (60 * 60))
    time = time - h * (60 * 60);
    let m = Math.floor(time / 60)
    time = time - m * 60;
    let s = Math.floor(time);
    return (h==0?'00':h<10?"0"+h:h)+':'+(m==0?'00':m<10?"0"+m:m)+':'+(s==0?'00':s<10?"0"+s:s)
};
public static isCan = (n: any) => {
  let time:any = new Date();
  let time2:any = new Date(n*1000)
  let isCan = time2-time <=0?true:false;
  return isCan
};
  public static formatDate(data: any, n?: number): string {
    var newDate;
    newDate = new Date(data);
    var newYear = new Date().getFullYear();
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    const hour = newDate.getHours();
    const minute = newDate.getMinutes();
    const second = newDate.getSeconds();
    switch (n) {
      case 1:
        return year + "年" + month + "月" + day + "日";
        break;
      case 2:
        return (
          [year, month, day].map(Util.formatNumber).join("/") + " " + [hour, minute, second].map(Util.formatNumber).join(":")
        );
        break;
      case 3:
        return [newYear, month, day].map(Util.formatNumber).join("-");
        break;
      case 4:
        return month + "月" + day + "日";
        break;
      case 5:
        return [month, day].map(Util.formatNumber).join(".");
        break;
      case 6:
        return [newYear, month, day].map(Util.formatNumber).join("-");
        break;
      case 7:
        return [hour, minute, second].map(Util.formatNumber).join(":");
        break;
      default:
        return (
          [year, month, day].map(Util.formatNumber).join("-") + " " + [hour, minute, second].map(Util.formatNumber).join(":")
        );
        break;
    }
  }
}
