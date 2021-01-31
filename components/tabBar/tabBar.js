Component({
    properties: {
        // 这里定义了 headerText 属性，属性值可以在组件使用时指定
        tabIndex: {
            type: String,
            value: "",
        },
    },
    data: {
        // 组件内部数据
        defaultStates: {},
    },
    onLoad() {
        console.log('进入')

    },
    ready: function() {
        console.log(this)
    },
    methods: {
        // 自定义方法
        tabTo: function (event) {
            const num = event.currentTarget.dataset.index
            console.log(num)
            switch (parseInt(num,10)) {
                case 0:
                    tt.navigateTo({
                        url:'/pages/index/index'
                    })
                    break;
                case 1:
                    console.log(tt)
                    tt.navigateTo({
                        url:'/pages/discover/discover'
                    })
                    break;
                case 2:
                    tt.navigateTo({
                        url:'/pages/personal/personal'
                    })
                    break;
            }
        },
    },
});
