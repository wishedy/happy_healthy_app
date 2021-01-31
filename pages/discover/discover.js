const app = getApp()
import {getArticle} from '../../resource/index'

Page({
    data: {
        list:[]
    },
    reviewArticle(event){
        const targetSrc = event.currentTarget.dataset.src
        const title = event.currentTarget.dataset.title
        console.log(targetSrc)
        tt.navigateTo({
            url:'/pages/article/article?targetSrc='+encodeURIComponent(targetSrc)+'&title='+title
        })
    },
    async getArticleInfo(){
        const _this = this
        try {
            const res = await getArticle()
            console.log(res)
            if(res){
                _this.setData({
                    list:res
                })
            }
        }catch (e) {
            tt.showToast({title:'数据获取失败',icon:'fail'})
        }
    },
    onLoad: function () {
        const _this = this
        tt.setNavigationBarTitle({
            title: "美满健康-发现"
        });
        _this.getArticleInfo()
    },
})
