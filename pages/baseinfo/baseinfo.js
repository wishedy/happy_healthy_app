const app = getApp()
import {updateUserInfo} from '../../resource/index'
import {testPhoneNum,testEmail} from '../../utils/regularTest'
Page({
    data: {
        date:'',
        userId:'',
        testId:'',
        orderId:'',
        form:{
            id:'',
            sex:'',
            names:'',
            birthday:'',
            phone:'',
            email:''
        }
    },
    changeSex(event){
        const sex = parseInt(event.currentTarget.dataset.sex,10)
        const _this = this
        _this.setData({
            'form.sex':sex
        },()=>{
        })
    },
    async submit(){
        const _this = this
        try {
             await updateUserInfo(_this.data.form)
            tt.showToast({
                title:'保存成功！',
                icon:'success',
                success() {
                    setTimeout(()=>{
                        tt.redirectTo({
                            url:'/pages/testPage/testPage?testId='+_this.data.testId+'&userId='+_this.data.userId+'&orderId='+_this.data.orderId
                        })
                    },1000)
                }
            })
        }catch (e) {
            tt.showToast({title:'保存失败',icon:'fail'})

        }
    },
    handlePhoneInput(event){
        console.log(event.detail.value);
        const _this = this
        _this.setData({
            'form.phone':event.detail.value
        },()=>{
            console.log(_this.data.form.phone)
        })
    },
    handleNameInput(event){
        console.log(event.detail.value);
        const _this = this
        _this.setData({
            'form.names':event.detail.value
        },()=>{
            console.log(_this.data.form.phone)
        })
    },
    handleEmailInput(event){
        console.log(event.detail.value);
        const _this = this
        _this.setData({
            'form.email':event.detail.value
        },()=>{
            console.log(_this.data.form.phone)
        })
    },
    bindDateChange: function (e) {
        const _this = this
        console.log("picker发送选择改变，携带值为", e.detail.value);
        _this.setData({
            'form.birthday': e.detail.value,
        });
    },
    beginTest(){
        const _this = this
        console.log(_this.data.form.names.length)
        if(_this.data.form.names.length===0){
            tt.showToast({title:'姓名未填',icon:'fail'})
            return false
        }
        if(_this.data.form.sex!==0&&_this.data.form.sex!==1){
            tt.showToast({title:'性别未填',icon:'fail'})
            return false
        }
        /*if(_this.data.form.phone.length===0){
            tt.showToast({title:'电话号未填',icon:'fail'})
            return false
        }*/
        if(_this.data.form.phone.length!==0&&!testPhoneNum(_this.data.form.phone)){
            tt.showToast({title:'电话号错误',icon:'fail'})
            return false
        }
        /*if(_this.data.form.birthday.length===0){
            tt.showToast({title:'生日未填',icon:'fail'})
            return false
        }*/
        /*if(_this.data.form.email.length===0){
            tt.showToast({title:'邮箱未填',icon:'fail'})
            return false
        }*/
        if(_this.data.form.email.length!==0&&!testEmail(_this.data.form.email)){
            tt.showToast({title:'邮箱错误',icon:'fail'})
            return false
        }
        _this.submit()
    },
    saveTestId(opt){
        const _this = this
        _this.setData({
            testId:opt.testId,
            userId:opt.userId,
            'form.id':opt.userId,
            orderId:opt.orderId
        },()=>{
        })
    },
    onLoad: function (options) {
        const _this = this
        _this.saveTestId(options)
        tt.setNavigationBarTitle({
            title: "填写基本信息"
        });
    },
})
