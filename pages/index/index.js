import {login} from "../../utils/index";

const app = getApp()
import {getQuestions, getQuestionsType, getBanner, authorization} from '../../resource/index'

Page({
  data: {
    background: ['demo-text-1', 'demo-text-2', 'demo-text-3'],
    indicatorDots: true,
    vertical: false,
    onOff: true,
    autoplay: true,
    circular: false,
    interval: 2000,
    contentList:[],
    banner:[],
    typeList:[],
    tabIndex:0,
    leftDis:0,
    duration: 500
  },
  async getTypeList(){
    const _this = this
    const res = await getQuestionsType({status:1})
    if(res){
      _this.setData({
        typeList:res,
        len:res.length
      },()=>{
        console.log(_this)
        console.log('获取完毕',_this.getContentList,_this.data.typeList[_this.tabIndex])

        _this.getContent()
      })
    }
  },
  async getContentList(id){
    const _this = this
    console.log(id)
    const res = await getQuestions({typeId:id,status:1 })
    if(res){
      _this.setData({
        contentList:res
      })
    }
  },
  changeIndex(event){
    const _this = this
    const targetIndex = parseInt(event.currentTarget.dataset.index,10)
    const nowIndex = parseInt(_this.tabIndex,10)
    if(targetIndex!==nowIndex){
      _this.setData({
        tabIndex:targetIndex,
        leftDis:targetIndex===0?0:event.currentTarget.offsetLeft-20
      },()=>{
        _this.getContent()
      })
    }
  },
  getUserId(){
    const _this = this
    login().then(async (res)=>{
      console.log(res)
      const resData = await authorization({
        code:res.code
      })
      _this.setData({
        userId:resData.id
      },()=>{
        tt.setStorageSync('userId',resData.id)
      })
    }).catch((error)=>{
      console.log(error)
    })
  },
  getContent(){
    const _this = this
    const typeList = _this.data.typeList
    const typeIndex = _this.data.tabIndex
    _this.getContentList(typeList[typeIndex].id)

  },
  reviewInfo(event){
    const _this = this
    const testId = event.currentTarget.dataset.id
    console.log('点击')
    tt.navigateTo({
      url:'/pages/testDetail/testDetail?testId='+testId+'&userId='+_this.data.userId
    })
  },
  async getBannerList(){
    const _this = this
    const res = await getBanner()
    if(res){
      console.log('获取到banner参数')
      console.log(res)
      _this.setData({
        banner:res
      })
    }
  },
  onLoad: function () {
    const _this = this
    _this.getUserId()
    tt.setNavigationBarTitle({
      title: "美满健康-首页"
    });
    setTimeout(()=>{
      _this.setData({
        onOff:false
      },()=>{
        console.log(_this.data.onOff)
      })
    },3000)
    _this.getTypeList()
    _this.getBannerList()
    console.log('Welcome to Mini Code')
  },
})
