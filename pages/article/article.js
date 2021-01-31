const app = getApp()
Page({
    data: {
        targetSrc:'',
        title:''
    },
    saveTestId(opt){
        const _this = this
        console.log(opt.targetSrc)
        _this.setData({
            title:opt.title,
            targetSrc:decodeURIComponent(opt.targetSrc)
        },()=>{
            tt.setNavigationBarTitle({
                title: _this.data.title
            });
        })
    },
    onLoad: function (options) {
        const _this = this
        _this.saveTestId(options)
    },
})
