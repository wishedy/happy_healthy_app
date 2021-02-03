import {login} from "../../utils/index";

const app = getApp()
import {getOrderStatus,orderPayInfo, addOrder, getQuestions, authorization} from '../../resource/index'

Page({
    data: {
        date:'',
        payOnOff:true,
        showSuccess:false,
        content:{},
        orderId:'',
        payInfo:'',
        userId:'',
        testId:''
    },
    bindDateChange: function (e) {
        this.setData({
            date: e.detail.value,
        });
    },
    async payTest(){
        const _this = this
        const payFunc = async ()=>{
            const beginOrder = async ()=>{
                if(_this.data.orderId){

                    const payInfo = await orderPayInfo({
                        orderId:_this.data.orderId
                    })

                    _this.setData({
                        payInfo:payInfo
                    })
                    tt.showLoading({
                        title: "正在支付,请稍等",
                        success(res) {
                            console.log(`${res}`);
                        },
                        fail(res) {
                            console.log(`showLoading调用失败`);
                        },
                    });
                    if(_this.data.payOnOff){
                        _this.setData({
                            payOnOff:false
                        })
                        if(payInfo){
                            tt.pay({
                                orderInfo: payInfo,
                                service: 4,
                                payChannel: {
                                    default_pay_channel: "alipay", // wx || alipay
                                },
                                getOrderStatus(res) {
                                    _this.setData({
                                        payInfo:JSON.stringify(res)
                                    })
                                    let { out_order_no } = res;
                                    return new Promise(function (resolve, reject) {
                                        // 商户前端根据 out_order_no 请求商户后端查询微信支付订单状态
                                        tt.request({
                                            url: "/api/orders/getOrderStatus",
                                            success(res) {
                                                // 商户后端查询的微信支付状态，通知收银台支付结果
                                                resolve(res);
                                            },
                                            fail(err) {
                                                reject(err);
                                            },
                                        });
                                    });
                                },
                                success(res) {
                                    tt.hideLoading({
                                        success(res) {
                                            console.log(`${res}`);
                                        },
                                        fail(res) {
                                            console.log(`showLoading调用失败`);
                                        },
                                    });
                                    _this.setData({
                                        payOnOff:true
                                    })
                                    _this.setData({
                                        payInfo:JSON.stringify(res)
                                    })
                                    if (res.code == 0||res.code == 9) {
                                        // 支付成功处理逻辑，只有res.code=0时，才表示支付成功
                                        // 但是最终状态要以商户后端结果为准
                                        const checkStatus = async ()=>{
                                            try {
                                                const data = await getOrderStatus({orderId:_this.data.orderId})
                                                _this.setData({
                                                    payInfo:JSON.stringify(data)
                                                })
                                                if(parseInt(data,10)===1){
                                                    clearInterval(timer)
                                                    if(!_this.data.showSuccess){
                                                        _this.setData({
                                                            showSuccess:true
                                                        })
                                                        tt.showModal({
                                                            title: "支付成功",
                                                            content: "恭喜您支付成功，请开始内容",
                                                            success(res) {
                                                                if (res.confirm) {
                                                                    tt.redirectTo({
                                                                        url:'/pages/baseinfo/baseinfo?testId='+_this.data.testId+'&orderId='+_this.data.orderId+'&userId='+_this.data.userId
                                                                    })
                                                                    console.log("confirm, continued");
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
                                                }else if(parseInt(data,10)===2){
                                                    clearInterval(timer)
                                                    tt.hideLoading({
                                                        success(res) {
                                                            console.log(`${res}`);
                                                        },
                                                        fail(res) {
                                                            console.log(`showLoading调用失败`);
                                                        },
                                                    });
                                                    tt.showModal({
                                                        title: "抱歉您支付失败",
                                                        content: "对不起您支付失败，请联系客服090-11910019",
                                                        success(res) {
                                                            console.log('支付失败')

                                                        },
                                                        fail(err) {
                                                            console.log(`showModal 调用失败`, err);
                                                        },
                                                    });
                                                }
                                            }catch (e) {
                                                clearInterval(timer)
                                                tt.showToast({title:'支付失败',icon:'fail'})

                                            }

                                        }
                                        const timer = setInterval(()=>{
                                            checkStatus()
                                        },500)

                                    }else{
                                        tt.showToast({title:'支付失败',icon:'fail'})
                                    }
                                },
                                fail(res) {
                                    tt.hideLoading({
                                        success(res) {
                                            console.log(`${res}`);
                                        },
                                        fail(res) {
                                            console.log(`showLoading调用失败`);
                                        },
                                    });
                                    tt.showModal({
                                        title: "抱歉您支付失败系统",
                                        content: "对不起您支付失败，请联系客服090-11910019",
                                        success(res) {
                                            console.log('支付失败')
                                        },
                                        fail(err) {
                                            console.log(`showModal 调用失败`, err);
                                        },
                                    });
                                    _this.setData({
                                        payInfo:JSON.stringify(res)
                                    })
                                    // 调起收银台失败处理逻辑
                                },
                            });
                        }
                    }

                }
            }
            if(_this.data.orderId.length===0){
                const res = await addOrder({
                    userId:_this.data.userId,
                    paperId:_this.data.testId
                })
                _this.setData({
                    orderId:res.id
                },()=>{
                    beginOrder()
                })
            }else{
                beginOrder()
            }
        }
        if(parseInt(_this.data.content.isCharge,10)!==1){
            tt.getSystemInfo({
                success(res){
                    if(res.platform.indexOf('ios')!==-1){
                        tt.showModal({
                            title: "IOS系统暂不支持",
                            content: "IOS系统暂不支持支付功能，敬请期待",
                            success(res) {
                                if (res.confirm) {
                                    console.log("confirm, continued");
                                    tt.redirectTo({
                                        url:'/pages/index/index'
                                    })
                                } else if (res.cancel) {
                                    tt.redirectTo({
                                        url:'/pages/index/index'
                                    })
                                } else {
                                    // what happend?
                                }
                            },
                            fail(err) {
                                console.log(`showModal 调用失败`, err);
                            },
                        });
                    }else{
                        payFunc()
                    }
                },
                fail(){
                    tt.showToast({title:'系统错误',icon:'fail'})

                }
            })
        }else{
            //免费的逻辑
            const res = await addOrder({
                userId:_this.data.userId,
                paperId:_this.data.testId
            })
            _this.setData({
                orderId:res.id
            },()=>{
                tt.redirectTo({
                    url:'/pages/baseinfo/baseinfo?testId='+_this.data.testId+'&orderId='+_this.data.orderId+'&userId='+_this.data.userId
                })
            })
        }


    },
    async getContent(id){
        const _this = this
        console.log(id)
        const res = await getQuestions({id:id })
        if(res){
            console.log('获取到')
            console.log(res)
            _this.setData({
                content:res[0]
            })
        }
    },
    saveTestId(opt){
        const _this = this
        _this.setData({
            testId:opt.testId,
            userId:opt.userId
        },()=>{
            _this.getContent(_this.data.testId)
        })
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
            })
        }).catch((error)=>{
            console.log(error)
        })
    },
    onLoad: function (options) {
        console.log(options)
        const _this = this
        _this.saveTestId(options)
       //_this.getUserId()
        tt.setNavigationBarTitle({
            title: "内容简介"
        });
    },
})
