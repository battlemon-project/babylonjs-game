<template>
  <button @click="connectOrChangeWallet" class="wkit-button">
    {{ isConnected ? walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) : 'Connect' }}
  </button>
</template>

<script>
import Web3 from 'web3'
import '../../../styles/suiet.sass'

export default {
  data() {
    return {
      isConnected: false,
      walletAddress: '',
      web3: null
    }
  },
  async created() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
      const accounts = await this.web3.eth.getAccounts()
      if (accounts.length > 0) {
        this.isConnected = true
        this.walletAddress = accounts[0]
      }
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          this.isConnected = false
        } else {
          this.walletAddress = accounts[0]
        }
      })
    } else {
      console.log('Metamask is not installed. Please consider installing it: https://metamask.io/download.html')
    }
  },
  methods: {
    async connectOrChangeWallet() {
      if (window.ethereum) {
        if (this.isConnected) {
         //  window.ethereum.disconnect()
          this.isConnected = false
        } else {
          try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            this.isConnected = true
            this.walletAddress = accounts[0]
          } catch (error) {
            console.error('User rejected connection:', error)
          }
        }
      }
    }
  }
}
</script>