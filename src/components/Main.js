import React, { Component } from 'react'
import './Main.css'
import tether from '../tether.png'
import Airdrop from './Airdrop'


class Main extends Component {
    render() {
        return (

            <div className='main'>

                <table className='tab'>
                    <thead className='tabhead'>
                        <tr>
                            <th>Staked Balance</th>
                            <th>Rewards</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{window.web3.utils.fromWei(this.props.stakingBalance, 'Ether')} USD</td>
                            <td>{window.web3.utils.fromWei(this.props.rwdBalance, 'Ether')} RWD</td>
                        </tr>
                    </tbody>
                </table>
                <form className='tab2'
                onSubmit={(event) =>{
                    event.preventDefault()
                    let amount
                    amount = this.input.value.toString()     //this 'input' is retrived from the 'ref' under the input tag below
                    amount = window.web3.utils.toWei(amount, 'Ether')
                    this.props.stakeTokens(amount)
                }}>
                    <div className='tab2head'>
                            <div className='tab2lhs'>Stake Tokens

                            <div className='currency'>
                                        <input 
                                        ref = {(input)=> {this.input = input}}
                                        type="text" placeholder='0' required style={{ height: '30px', width: '120px' }} />
                                        <img src={tether} alt='tether' />USD

                                    </div>

                            </div>
                            <div className='tab2rhs'>Balance:{window.web3.utils.fromWei(this.props.tetherBalance, 'Ether')}
                            </div>

                                    

                    </div>
                    <button type='submit'>DEPOSIT</button>
                <button
                type='submit'
                onClick= {(event)=>{
                    event.preventDefault(
                        this.props.unstakeTokens()
                    )
                }}
                >WITHDRAW</button>
                <div className='airdrop'>
                    AIRDROP <Airdrop 
                    stakingBalance = {this.props.stakingBalance}
                    />
                </div>
                </form>
                

            </div>

        )
    }
}

export default Main;