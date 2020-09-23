<template>
<v-app>
    <router-view></router-view>
</v-app>
</template>

<script>
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import config from '@/config'
import ticket from './config/ticket'

export default {
    name: 'App',
    created() {
        // 获取Web3提供者
        detectEthereumProvider().then(provider => {
            if (provider) {
                // 实例化Web3
                window.web3 = new Web3(provider)
                // 实例化合约
                window.mc = new window.web3.eth.Contract(config.mainAbi, config.mainAddress)
                // 门票合约
                window.ticket = new window.web3.eth.Contract(ticket.mainAbi, ticket.mainAddress)

                this.$store.dispatch('setEnabled', true)
            } else {
                this.$toast.error('请使用MetaMask或者imToken打开此网页')

                this.$store.dispatch('setEnabled', false)
            }
        })
    }
}
</script>

<style lang="less">
body {
    background-color: #090405;
}

.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
