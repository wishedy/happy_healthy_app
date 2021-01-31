export const login = ()=>{
    return new Promise((resolve,reject)=>{
        tt.login({
            force: true,
            success(res) {
                resolve(res)
                console.log(`login 调用成功${res.code} ${res.anonymousCode}`);
            },
            fail(res) {
                reject(res)
                console.log(`login 调用失败`);
            },
        });
    })
}
