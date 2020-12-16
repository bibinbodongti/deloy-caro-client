export const getListGameAPI=(endpoint, method = 'GET', body, token)=>{
    //something...
    return new Promise((resolve,reject)=>{
        resolve([
            {
                id:'123',
                hostRoom:'Đăng Khoa',
                count:2,
                dateCreate:new Date()
            },
            {
                id:'456',
                hostRoom:'Tấn Hưng',
                count:1,
                dateCreate:new Date()
            },
            {
                id:'789',
                hostRoom:'Quang Huy',
                count:2,
                dateCreate:new Date()
            },
        ])
    })
}
export const addGameAPI=()=>{
    //somthing...
    return true;
}
export const deleteGameAPI=()=>{
    //something...
    return true;
}