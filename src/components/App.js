import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Main from './Main'
import Tether from '../truffle_abis/Tether.json'
import RWD from '../truffle_abis/RWD.json'
import DecentralBank from '../truffle_abis/DecentralBank.json'
import ParticleSettings from './ParticleSettings'
import bank from '../bank.png'


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }


  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()

    //LOAD Tether TOKEN
    const tetherData = Tether.networks[networkId]
    if (tetherData) {
      const tether = new web3.eth.Contract(Tether.abi, tetherData.address)
      this.setState({ tether })
      let tetherBalance = await tether.methods.balanceOf(this.state.account).call()
      this.setState({ tetherBalance: tetherBalance.toString() })
    } else {
      window.alert("tether contract not deployed to detect network")
    }

    //LOAD RWD TOKEN
    const rwdTokenData = RWD.networks[networkId]
    if (rwdTokenData) {
      const rwd = new web3.eth.Contract(RWD.abi, rwdTokenData.address)
      this.setState({ RWD })
      let rwdTokenBalance = await rwd.methods.balanceOf(this.state.account).call()
      this.setState({ rwdTokenBalance: rwdTokenBalance.toString() })
    } else {
      window.alert("Reward Token contract not deployed to detect network")
    }

    //Load DecentralBank
    const decentralBankData = DecentralBank.networks[networkId]
    if (decentralBankData) {
      const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address)
      this.setState({ decentralBank })
      let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call()
      this.setState({ stakingBalance: stakingBalance.toString() })
    } else {
      window.alert("TokenForm contract not deployed to detect network")
    }

    this.setState({ loading: false })
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non ethereum browser detected. You should consider Metamask!')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.decentralBank.methods.depositTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }



  unstakeTokens = () => {
    this.setState({ loading: true })
    this.state.decentralBank.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }


  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      tether: {},
      rwd: {},
      decentralBank: {},
      tetherBalance: '0',
      rwdTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content
    // eslint-disable-next-line
    {
      this.state.loading ? content = <p className='text-center' id='loader' style={{ margin: '30px', color: 'white', fontFamily: "Georgia, 'Times New Roman', Times, serif" }}>please wait, LOADING.... </p> :
      content =


      <Main
        tetherBalance={this.state.tetherBalance}
        rwdBalance={this.state.rwdTokenBalance}
        stakingBalance={this.state.stakingBalance}
        stakeTokens={this.stakeTokens}
        unstakeTokens={this.unstakeTokens}
        decentralBankContract={this.decentralBank}
      />
      // eslint-disable-next-line
    }

    return (
      <>
        <div className='App' style={{ position: 'relative' }}>
          <div className='particle' style={{ position: 'absolute' }}>
            <ParticleSettings />
          </div>
          <div className="body">
            <nav className='navbar'>
              <span>
                <img src={bank} alt="bank logo" /> &nbsp; Decentralized Bank
              </span>

              <span className="accno">ACCOUNT NO: {this.state.account}</span>
            </nav>
          </div>
          <div className='content'>
            {content}
          </div>
        </div>
      </>
    );
  }
}

export default App;
