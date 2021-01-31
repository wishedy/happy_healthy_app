import api from "./ajax";
export function getQuestionsType (params) {
    return api({
        url:`/api/paperType/query`,
        data:params?params:{},
        method:'GET'
    });
}
export function getBanner (params) {
    return api({
        url:`/api/sysBanner/query`,
        data:params?params:{},
        method:'GET'
    });
}
export function getArticle (params) {
    console.log(params)
    return api({
        url:`/api/sysArticle/query`,
        data:params?params:{},
        method:'GET'
    });
}
export function getOrderStatus (params) {
    console.log(params)
    return api({
        url:`/api/orders/getOrderStatus`,
        data:params?params:{},
        method:'GET'
    });
}
export function getQuestions (params) {
    console.log(params)
    return api({
        url:`/api/paperInfo/query`,
        data:params?params:{},
        method:'GET'
    });
}
export function getOrderList (params) {
    console.log(params)
    return api({
        url:`/api/orders/query`,
        data:params?params:{},
        method:'GET'
    });
}
export function getPayInfo (params) {
    console.log(params)
    return api({
        url:`/api/pay/pay`,
        data:params?params:{},
        method:'GET'
    });
}
export function addOrder (params) {
    console.log(params)
    return api({
        url:`/api/orders/insert`,
        data:params?params:{},
        method:'POST'
    });
}
export function orderPayInfo (params) {
    console.log(params)
    return api({
        url:`/api/pay/payMent`,
        data:params?params:{},
        method:'GET'
    });
}
export function authorization (params) {
    console.log(params)
    return api({
        url:`/api/user/dyOauth`,
        data:params?params:{},
        method:'GET'
    });
}
export function getQuestionsPage (params) {
    console.log(params)
    return api({
        url:`/api/paperInfo/selectQuestionById`,
        data:params?params:{},
        method:'GET'
    });
}
export function getPageResult (params) {
    console.log(params)
    return api({
        url:`/api/answer/getUserGard`,
        data:params?params:{},
        method:'GET'
    });
}
export function saveUserInfo (params) {
    console.log(params)
    return api({
        url:`/api/user/insertOrUpdate`,
        data:params?params:{},
        method:'POST'
    });
}
export function updateUserInfo (params) {
    console.log(params)
    return api({
        url:`/api/user/update`,
        data:params?params:{},
        method:'POST'
    });
}
export function saveAnswerInfo (params) {
    console.log(params)
    return api({
        url:`/api/answer/insert`,
        data:params?params:{},
        method:'POST'
    });
}
