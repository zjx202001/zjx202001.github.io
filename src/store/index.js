import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/config'

Vue.use(Vuex)

function setIntervalImmediately(func, interval) {
    func()
    return setInterval(func, interval)
}

export default new Vuex.Store({
    state: {
        enabled: undefined, // 是否web3
        address: '', // 当前用户地址
        funds: 0, // 资金池
        prize: 0, // 奖池
        yesterdayPrize: [],
        cycle: 60 * 60 * 24,
        countdown: 86400, // 分红/开奖倒计时
        account: {}, // 我的账户数据
        statistics: {}, // 统计
        userBurnTime: 0, // 烧伤时间
    },
    mutations: {
        setAddress(state, address) {
            state.address = address
        },
        setEnabled(state, enabled) {
            state.enabled = enabled
        },
        setFunds(state, funds) {
            state.funds = funds
        },
        setPrize(state, prize) {
            state.prize = prize
        },
        setCycle(state, cycle) {
            state.cycle = cycle
        },
        setCountdown(state, countdown) {
            state.countdown = countdown
        },
        setAccount(state, account) {
            state.account = Object.assign({}, state.account, account)
        },
        setStatistics(state, statistics) {
            state.statistics = Object.assign({}, state.statistics, statistics)
        },
        setYesterdayPrize(state, { index, value }) {
            Vue.set(state.yesterdayPrize, index, value)
        },
        setUserBurnTime(state, userBurnTime) {
            state.userBurnTime = parseInt(userBurnTime);
            // state.userBurnTime = parseInt(1599879300);
        }
    },
    actions: {
        setAddress({ commit, dispatch }, address) {
            commit('setAddress', address.toLowerCase())
            dispatch('loadAccount')
        },
        setEnabled({ commit, dispatch, state }, enabled) {
            commit('setEnabled', enabled)

            if (enabled) {
            //    const  hex2int = function(hex) {
            //         var len = hex.length, a = new Array(len), code;
            //         for (var i = 0; i < len; i++) {
            //             code = hex.charCodeAt(i);
            //             if (48<=code && code < 58) {
            //                 code -= 48;
            //             } else {
            //                 code = (code & 0xdf) - 65 + 10;
            //             }
            //             a[i] = code;
            //         }
                    
            //         return a.reduce(function(acc, c) {
            //             acc = 16 * acc + c;
            //             return acc;
            //         }, 0);
            //     }

                // 定时获取资金池余额
                setIntervalImmediately(() => {
                    // window.ethereum.request({ method: 'eth_getBalance' ,params:[config.mainAddress, "latest"]}).then(value => {
                    //     let r = hex2int("13b7b21280e0000")
                    //     console.log("r=",r, "value=", value.substring(1, value.length -1))
                    // })
                    

                    window.web3.eth.getBalance(config.mainAddress, (err, value) => {
                        if (!err) {
                            console.log("value=",value)
                            commit('setFunds', value)
                        }
                    })
                }, 10000)

                // 定时获取奖池金额
                setIntervalImmediately(async () => {
                    // 当前奖池ID
                    const id = await window.mc.methods.dailyPrizePoolId().call()

                    // 获取今日直推ETH
                    if (state.address) {
                        window.mc.methods.dailyInvites(state.address, id).call().then(res => {
                            commit('setAccount', { dailyInvite: res })
                        })
                    }

                    // 获取当前奖池数据
                    const dailyPool = await window.mc.methods.dailyPrizePools(id).call()
                    commit('setPrize', dailyPool.amount)

                    // 获取周期
                    const cycle = await window.mc.methods.dailyPrizePoolCycle().call()
                    commit('setCycle', parseInt(cycle))
                    commit('setCountdown', parseInt(dailyPool.date) + parseInt(cycle))

                    // // 获取昨天奖池的数据
                    if (id >= 1 && state.address) {
                        for (let i = 1; i < 4; i++) {
                            // console.log("addr=", state.address, "id=", id - 1, "index=", i)
                            // const d = await window.mc.methods.getPrizePoolLevelAmount(state.address, id - 1, i).call()
                            // console.log("d=", d)
                            // commit('setYesterdayPrize', { index: i, value: d })
                        }
                    }
                }, 10000)

                // 定时获取账户数据
                setInterval(() => {
                    dispatch('loadAccount')
                }, 10000)
            }
        },
        async loadAccount({ commit, state }) {
            if (state.address) {
                // 账户信息
                const account = await window.mc.methods.users(state.address).call()
                commit('setAccount', account)

                // 烧伤时间
                const userBurnTime = await window.mc.methods.userBurnTime(state.address).call()
                commit('setUserBurnTime', userBurnTime)

                // 收益统计
                const statistics = await window.mc.methods.statistics(state.address).call()
                commit('setStatistics', statistics)

                // 计算静态收益
                let staticBalance = await window.mc.methods.calculateStaticIncome(state.address).call()
                commit('setAccount', { staticBalance })

                // 解锁收益
                let unlockBalance = await window.mc.methods.calculateUnlockIncome(state.address).call()
                commit('setAccount', { unlockBalance })

                // 获取邀请人数
                let res = await window.mc.methods.invites(state.address, 1).call()
                commit('setAccount', { invited: res.number })
            }
        }
    },
    modules: {}
})
