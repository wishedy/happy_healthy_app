const app = getApp()
import {addOrder, getOrderList, getOrderStatus, getPageResult, orderPayInfo} from '../../resource/index'

Page({
    data: {
        contentList:[],
        orderId:'',
        payOnOff:true,
        testId:'',
        userId:''
    },
    payTest(){
        const _this = this
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
        beginOrder()

    },
    async getOrderListData(){
      const _this = this
      const res =   await getOrderList({
          userId:_this.data.userId
      })
        function timestampToTime(timestamp) {
            var date = new Date();//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
            var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

            const strDate = Y+M+D+h+m+s;
            return strDate;

        }
        const checkStatus = (status,isOver)=>{
          let statusDes = '未支付'
            if(parseInt(status,10)===1){
                statusDes = '已付款-内容未完成'
                if(parseInt(isOver,10)===1){
                    statusDes = '已付款-内容已完成'
                }
            }
            return statusDes
        }
        const checkStatusNum = (status,isOver)=>{
            let statusDes = 0
            if(parseInt(status,10)===1){
                statusDes = '1'
                if(parseInt(isOver,10)===1){
                    statusDes = '2'
                }
            }
            return statusDes
        }
        const checkStatusBtn = (status,isOver)=>{
            let statusDes = '开始内容'
            if(parseInt(status,10)===1){
                statusDes = '继续内容'
                if(parseInt(isOver,10)===1){
                    statusDes = '查看结果'
                }
            }
            return statusDes
        }
        const formatList = (list)=>{
          const originalList = JSON.parse(JSON.stringify(list))
            for(let num = 0;num<originalList.length;num++){
                const item = originalList[num]
                item.createTime = timestampToTime(item.createTime)
                item.payTime = timestampToTime(item.payTime)
                item.orderDes = checkStatus(item.status,item.isOver)
                item.allStatus = checkStatusNum(item.status,item.isOver)
                item.statusBtn = checkStatusBtn(item.status,item.isOver)
            }
            return originalList
        }
        _this.setData({
            contentList:formatList(res)
        })
    },
    checkStatus(event){
        console.log('点击')
        const _this = this
        const status = parseInt(event.currentTarget.dataset.status,10)
        const paperId =  event.currentTarget.dataset.paper
        const userId =  event.currentTarget.dataset.user
        const orderId =  event.currentTarget.dataset.id
        const isCharge =  event.currentTarget.dataset.ischarge
        console.log(JSON.stringify(event.currentTarget.dataset))
        switch (status) {
            case 0:
                /*tt.redirectTo({
                    url:'/pages/baseinfo/baseinfo?testId='+paperId+'&orderId='+orderId
                })*/
                _this.setData({
                    orderId:orderId,
                },()=>{
                    if(parseInt(isCharge,10)!==1){
                        _this.payTest()
                    }else{
                        tt.redirectTo({
                            url:'/pages/baseinfo/baseinfo?testId='+_this.data.testId+'&orderId='+orderId+'&userId='+userId
                        })
                    }
                })
                break
            case 1:
                tt.redirectTo({
                    url:'/pages/baseinfo/baseinfo?testId='+paperId+'&orderId='+orderId+'&userId='+userId
                })
                break
            case 2:
                const checkResult = async ()=>{
                    const resultData = await getPageResult({
                        userId:userId,
                        orderId:orderId,
                        paperId:paperId
                    })
                    if(resultData){
                        tt.redirectTo({
                            url:'/pages/conclusion/conclusion?testId='+paperId+'&userId='+userId+'&orderId='+orderId+'&describes='+resultData.describes+'&garde='+resultData.garde+'&results='+resultData.results+'&name='+resultData.name
                        })
                    }
                }
                checkResult()
                break
        }

    },
    onLoad: function () {
        tt.setNavigationBarTitle({
            title: "美满健康-个人中心"
        });
        const _this = this
        _this.setData({
            userId:tt.getStorageSync('userId')
        },()=>{
            _this.getOrderListData()
        })
    },
})
