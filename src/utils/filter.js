import Vue from 'vue'
import Decimal from 'decimal.js'
import Web3 from 'web3'

Vue.filter('PrefixInteger', function (v, n) {
  return (Array(n).join(0) + v).slice(-n)
})

Vue.filter('weiToEther', function (v) {
  if (!v || v === '0' || parseInt(v) === 0) {
    return '-'
  }
  return new Decimal(Web3.utils.fromWei(Web3.utils.toBN(v), 'ether')).toDP(6, Decimal.ROUND_FLOOR)
})

Vue.filter('addressOmit', function (v, n = 4) {
  if (typeof v == 'undefined') {
    return '-';
  }

  return v.substr(0, n + 2) + '...' + v.substr(-4, n)
})