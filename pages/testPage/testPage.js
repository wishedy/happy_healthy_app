const app = getApp()
import { getPageResult,getQuestionsPage,saveAnswerInfo} from '../../resource/index'
Page({
    data: {
        testIndex:0,
        content:{},
        resultData:'',
        changeOnOff:true,
        list:[],
        userId:'',
        orderId:'',
        answerValue:'',
        choiceId:'',
        url:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1771100680,3506712823&fm=26&gp=0.jpg'
    },
    bindDateChange: function (e) {
        console.log("picker发送选择改变，携带值为", e.detail.value);
        this.setData({
            date: e.detail.value,
        });
    },
    formatIndex(index){
      console.log(index)
    },
    changeNowIndex(){
        const _this = this
        _this.setData({
            content:_this.data.list[_this.data.testIndex]
        })
    },
    nextTest(){
      const _this = this
        console.log(_this.data.changeOnOff)
        if(_this.data.changeOnOff){
            _this.setData({
                changeOnOff:false
            },()=>{
                const type = parseInt(_this.data.content.types,10)
                let checkOnOff = true
                if(type===1||type===2){
                    if(_this.data.choiceId.length===0){
                        tt.showToast({title:'请选择',icon:'fail'})
                        _this.setData({
                            changeOnOff:true
                        })
                        checkOnOff = false
                    }
                }else{
                    if(_this.data.answerValue.length===0){
                        tt.showToast({title:'请答题',icon:'fail'})
                        _this.setData({
                            changeOnOff:true
                        })
                        checkOnOff = false
                    }
                }
                checkOnOff&& _this.saveAnswer()
            })
        }
    },
    async saveAnswer(){
        const _this = this
        const type = parseInt(_this.data.content.types,10)
        const param = {
            questionId:_this.data.content.id,
            types:_this.data.content.types,
            userId:_this.data.userId,
            orderId:_this.data.orderId,
            answerInfo:type===1||type===2?_this.data.choiceId:_this.data.answerValue
        }
        const res = await saveAnswerInfo(param)
        _this.setData({
            changeOnOff:true
        },()=>{
            _this.setData({
                choiceId:''
            },async ()=>{
                _this.setChoice('')
/*
                tt.showToast({title:_this.data.testIndex+1+'-'+_this.data.list.length,icon:'fail'})
*/
                if(_this.data.testIndex+1===_this.data.list.length){
                    //最后一道题跳转结果页
                    const resultData = await getPageResult({
                        userId:_this.data.userId,
                        orderId:_this.data.orderId,
                        paperId:_this.data.testId
                    })
                    _this.setData({
                        resultData:JSON.stringify(resultData)
                    })
                    if(resultData){
                        tt.showToast({
                            title:'保存成功！',
                            icon:'success',
                            success() {
                                tt.redirectTo({
                                    url:'/pages/conclusion/conclusion?testId='+_this.data.testId+'&userId='+_this.data.userId+'&orderId='+_this.data.orderId+'&describes='+resultData.describes+'&garde='+resultData.garde+'&results='+resultData.results+'&name='+resultData.name+'&autoResule='+resultData.autoResule
                                })
                            }
                        })
                    }else{
                        tt.showModal({
                            title: "系统出现异常请联系系统管理员",
                            content: "18704598093",
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
                    }
                }else{
                    _this.setData({
                        testIndex:_this.data.testIndex+1
                    },()=>{
                        _this.changeNowIndex()
                    })
                }
            })
        })
    },
    handleAnswerInput(event){
        const _this = this
        _this.setData({
            'answerValue':event.detail.value
        },()=>{
            console.log(_this.data.answerValue)
        })
    },
    setChoice(id){
        const _this = this
        const originalList = JSON.parse(JSON.stringify(_this.data.list))
        for(let num = 0;num<originalList.length;num++){
            const item = originalList[num]
            const type = parseInt(item.types,10)
            if(item.optionInfoList){
                for(let inNum = 0;inNum<item.optionInfoList.length;inNum++){
                    const innerItem = item.optionInfoList[inNum]
                    if(type===1){
                        //单选
                        if(innerItem.id===id){
                            innerItem.isChoice = 1
                        }else{
                            innerItem.isChoice = 0
                        }

                    }else{
                        //多选
                        if(id.length===0){
                            innerItem.isChoice = 0
                        }else{
                            if(innerItem.id===id){
                                innerItem.isChoice = parseInt(innerItem.isChoice,10)===1?0:1

                            }

                        }
                    }

                }
            }
        }
        _this.setData({
            list:originalList
        },()=>{
            _this.changeNowIndex()
            console.log(_this.data.list)
        })
    },
    answerTest(event){
        const _this = this
        const choiceId = event.currentTarget.dataset.id
        _this.setChoice(choiceId)
        if(parseInt(_this.data.content.types,10)===1){
            _this.setData({
                choiceId:choiceId
            })
        }else{
            _this.setData({
                choiceId:_this.data.choiceId.length?_this.data.choiceId+','+choiceId:choiceId
            })
        }
    },
    async getContent(id){
        const _this = this
        const res = await getQuestionsPage({paperInfoId:id })
        if(res){
            const formatList = (list)=>{
                const originalList = JSON.parse(JSON.stringify(list))
                let  resultList = []
                for(let num = 0;num<originalList.length;num++){
                    const item = originalList[num]
                    if(item.optionInfoList){
                        for(let inNum = 0;inNum<item.optionInfoList.length;inNum++){
                            const innerItem = item.optionInfoList[inNum]
                            innerItem.isChoice = 0
                            innerItem.label = String.fromCharCode(65 + parseInt(inNum,10))
                        }
                    }
                    resultList.push(item)
                }
                return resultList
            }
            _this.setData({
                list:formatList(res)
            },()=>{
                _this.changeNowIndex()
                console.log(_this.data.list)
            })
        }
    },
    saveTestId(opt){
        const _this = this
        _this.setData({
            testId:opt.testId,
            userId:opt.userId,
            orderId:opt.orderId
        },()=>{
            _this.getContent(_this.data.testId)
        })
    },
    onLoad: async function (options) {
        const _this = this
        _this.saveTestId(options)
    },
})
