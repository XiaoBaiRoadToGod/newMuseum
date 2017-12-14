export const fun = ({commit}, value) => {
    commit({
        type: 'getMsg',       // 对应 mutation.js 中的 getMsg 方法
        msg: value
    })
}
export const comZhantingId = ({commit}, value) => {
    commit({ 
        type: "setZhantingId",
        value: value
     });
}