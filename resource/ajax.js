/**
 * @Desc：ajax请求封装
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Zhangheng on 20/9/17.
 */

export default function ajax (param) {
  return new Promise((resolve,reject)=>{
    const header = {
      'Content-Type': 'application/json'
    }
    const domainHref = 'https://api.foodiu.cn'
    console.log(param)
    const options = {
      url: domainHref + param.url,
      data: param.data,
      header: header,
      method: param.method || 'POST',
      dataType: "JSON", // 指定返回数据的类型为 json
      responseType: "text",
      success(res) {
        const responseData = JSON.parse(res.data)
        console.log(responseData)
        if (responseData.code === 200) {
          resolve(responseData.result)
        }else{
          reject(responseData)
        }
      },
      fail(res) {
        reject(res)
        console.log("调用失败", res.errMsg);
      },
    }
    tt.request(options);
  });
};
