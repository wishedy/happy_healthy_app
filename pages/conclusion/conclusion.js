const app = getApp()
import {getQuestions} from '../../resource/index'

Page({
  data: {
    date:'',
    describes:'',
    orderId:'',
    results:'',
    garde:'',
    userId:'',
    autoResule:true,
    name:'',
    content:{},
    testId:''
  },
  bindDateChange: function (e) {
    console.log("picker发送选择改变，携带值为", e.detail.value);
    this.setData({
      date: e.detail.value,
    });
  },
  payTest(){
    const _this = this
    tt.redirectTo({
      url:'/pages/baseinfo/baseinfo?testId='+_this.data.testId
    })
  },
  async getContent(id){
    const _this = this
    console.log(id)
    const res = await getQuestions({id:id })
    if(res&&res[0]){
      console.log('获取到')
      console.log(res)
      _this.setData({
        content:res[0]
      })
    }
  },
  linkDoctor(){
    tt.showModal({
      title: "联系方式如下",
      content: "18745958599",
      success(res) {
        if (res.confirm) {
          console.log("confirm, continued");
          tt.redirectTo({
            url:'/pages/index/index'
          })
        } else if (res.cancel) {
          console.log("cancel, cold");
        } else {
          // what happend?
        }
      },
      fail(err) {
        console.log(`showModal 调用失败`, err);
      },
    });
  },
  saveTestId(opt){
    const _this = this
    _this.setData({
      testId:opt.testId,
      orderId:opt.orderId,
      autoResule:opt.autoResule,
      describes:opt.describes,
      results:opt.results,
      name:opt.name,
      garde:opt.garde,
      userId:opt.userId
    },()=>{
      _this.getContent(_this.data.testId)
    })
  },
  onLoad: function (options) {
    console.log(options)
    const _this = this
    _this.saveTestId(options)
    tt.setNavigationBarTitle({
      title: "内容简介"
    });
  },
})
