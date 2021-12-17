import { FC, useState } from 'react';
import Web3 from 'web3';
import BigNumber from "bignumber.js";
import { Button, message, Tabs, Space, Input } from "antd";
import Erc20Abi from "@/utils/erc20.abi.json";
import ManageAbi from "@/utils/manageAbi.abi.json";
import Psc from "@/utils/psc.abi.json";
import { lpContract, manageContract, shareContract, pscContract, usdaContract } from "@/utils/config";
import BasicLayout from "@/layouts/BasicLayout";
import './index.less';

const { TabPane } = Tabs;

const Home: FC = () => {

  const [address, handleAddress] = useState<string>('')
  const [relWeb3, handleRelWeb3] = useState<any>('')
  const [showCoinBtn, handleShowCoinBtn] = useState<boolean>(false)
  const [showFun, handleShowFun] = useState<boolean>(false)
  const [balance, handleBalance] = useState<string | number>('--')
  const [depositBalance, handleDepositBalance] = useState<string | number>('--')
  const [sharePool, handleSharePool] = useState<string | number>('--')
  const [shareToken, handleShareToken] = useState<string | number>('--')
  const [shareTokenRepay, handleShareTokenRepay] = useState<string | number>('--')
  const [needToRepay, handleNeedToRepay] = useState<string | number>('--')
  const [usdaBorrowed, handleUsdaBorrowed] = useState<string | number>('--')
  const [interestRate, handleInterestRate] = useState<string | number>('--')
  const [amount, handleAmount] = useState<string | number>('')
  const [withdrawAmount, handleWithdrawAmount] = useState<string | number>('')
  const [borrowAmount, handleBorrowAmount] = useState<string | number>('')
  const [cycle, handleCycle] = useState<string | number>('1')

  //后期需要调整
  const [testNeedToRepay, handleTestNeedToRepay] = useState<string | number>('--')

  const connectClick = () => {
    if (!Web3.givenProvider) {
      message.error('no_available_provider')
      return;
    }
    let relWeb3 = new Web3(Web3.givenProvider)
    handleRelWeb3(relWeb3)
    relWeb3.eth.requestAccounts().then(async (res: any) => {
      let address = res[0];
      handleAddress(address)
      getBalanceOf(relWeb3, address)
      handleShowCoinBtn(true)
    }).catch((err: any) => {
      message.error(err.message)
    })
  }

  const getBalanceOf = async (relWeb3: Web3, address: string) => {
    //获取LP balance
    let Contract = new relWeb3.eth.Contract(Erc20Abi as any, lpContract)
    let resBalance = await Contract.methods.balanceOf(address).call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return '--'
      }
    })
    let balance = new BigNumber(resBalance).dividedBy(Math.pow(10, 18)).toFixed(4)
    handleBalance(balance)

    //获取 deposit balance
    let MagContract = new relWeb3.eth.Contract(ManageAbi as any, manageContract)
    let resDepositBalance = await MagContract.methods.getStakedTokens(0, address).call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return '--'
      }
    })
    let depositBalance = new BigNumber(resDepositBalance).dividedBy(Math.pow(10, 18)).toFixed(4)
    handleDepositBalance(depositBalance)

    //获取sharePool
    let ShareContract = new relWeb3.eth.Contract(Erc20Abi as any, shareContract)
    let resShareBalance = await ShareContract.methods.balanceOf(address).call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return '--'
      }
    })
    let shareTotal = await ShareContract.methods.totalSupply().call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return 0
      }
    })
    let sharePool = shareTotal === '0' ? '0.00%' : new BigNumber(resShareBalance).dividedBy(new BigNumber(shareTotal)).dividedBy(100).toFixed(4) + '%'
    handleSharePool(sharePool)
  }

  const showFunClick = () => {
    handleShowFun(true)
  }

  const approve = () => {
    let Contract = new relWeb3.eth.Contract(Erc20Abi as any, lpContract, {
      from: address
    });
    //approve参数: 1.币种地址,2.金额
    Contract.methods.approve(manageContract, new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toFixed()).send({ from: address }, (err: any, result: any) => {
      if (err) {
        message.error(err)
      } else {
        message.success(result)
      }
    })
  }

  const deposit = async () => {
    let Contract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
      from: address
    });
    let gasPrice = await relWeb3.eth.getGasPrice(); //获取当前gas价格
    //approve参数: 1.第0个币种,2.金额
    Contract.methods.deposit(0, new BigNumber(amount).multipliedBy(Math.pow(10, 18)).toFixed()).send({ from: address, gasPrice: gasPrice, gas: relWeb3.utils.toHex(900000) }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const earn = async () => {
    let Contract = new relWeb3.eth.Contract(Psc as any, pscContract, {
      from: address
    });
    Contract.methods.earn().send({ from: address }, (err: any, result: any) => {
      if (err) {
        message.error(err)
      } else {
        message.success(result)
      }
    })
  }

  const withdraw = async () => {
    let Contract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
      from: address
    });
    let gasPrice = await relWeb3.eth.getGasPrice(); //获取当前gas价格
    //approve参数: 1.第0个币种,2.金额
    Contract.methods.withdraw(0, new BigNumber(withdrawAmount).multipliedBy(Math.pow(10, 18)).toFixed()).send({ from: address, gasPrice: gasPrice, gas: relWeb3.utils.toHex(900000) }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const showTabPane = async (item: any) => {
    if (item === '3') {
      //获取sharePool
      let ShareContract = new relWeb3.eth.Contract(Erc20Abi as any, shareContract)
      let shareToken = await ShareContract.methods.balanceOf(address).call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return '--'
        }
      })
      handleShareToken(new BigNumber(shareToken).dividedBy(Math.pow(10, 18)).toFixed(4))

      //获取borrowed
      let borrowedContract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
        from: address
      });
      let borrowedArr = await borrowedContract.methods.userInfos(0, address).call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return '--'
        }
      })
      handleUsdaBorrowed(new BigNumber(borrowedArr.usdaBorrowed).dividedBy(Math.pow(10, 18)).toFixed(4))

      //获取interest rate
      let interestRateArr = await borrowedContract.methods.poolInfos(0).call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return '--'
        }
      })
      handleInterestRate(new BigNumber(interestRateArr.interestRate).dividedBy(100).toFixed(2))
    }
    if (item === '4') {
      //获取share token(collateral)
      let borrowedContract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
        from: address
      });
      let borrowedArr = await borrowedContract.methods.userInfos(0, address).call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return '--'
        }
      })
      handleShareTokenRepay(new BigNumber(borrowedArr.collateralAmount).dividedBy(Math.pow(10, 18)).toFixed(4))

      //test利率(后期调整)
      let interestRateArr = await borrowedContract.methods.poolInfos(0).call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return '--'
        }
      })
      handleNeedToRepay(new BigNumber(borrowedArr.usdaBorrowed).dividedBy(Math.pow(10, 18)).multipliedBy(new BigNumber(10000).plus(interestRateArr.interestRate)).dividedBy(10000).toFixed(4))
      handleTestNeedToRepay(new BigNumber(borrowedArr.usdaBorrowed).multipliedBy(new BigNumber(10000).plus(interestRateArr.interestRate)).toFixed(0))
    }
  }

  const approveBorrow = async () => {
    let Contract = new relWeb3.eth.Contract(Erc20Abi as any, shareContract, {
      from: address
    });
    Contract.methods.approve(manageContract, new BigNumber(borrowAmount).multipliedBy(Math.pow(10, 18)).toFixed()).send({ from: address }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const borrow = async () => {
    let Contract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
      from: address
    });
    let gasPrice = await relWeb3.eth.getGasPrice(); //获取当前gas价格
    //approve参数: 1.第0个币种,2.金额
    Contract.methods.borrow(0, new BigNumber(borrowAmount).multipliedBy(Math.pow(10, 18)).toFixed(), cycle).send({ from: address, gasPrice: gasPrice, gas: relWeb3.utils.toHex(900000) }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const approveRepay = async () => {
    let Contract = new relWeb3.eth.Contract(Erc20Abi as any, usdaContract, {
      from: address
    });
    Contract.methods.approve(manageContract, testNeedToRepay).send({ from: address }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const approveUSDA = async () => {
    let Contract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
      from: address
    });
    let gasPrice = await relWeb3.eth.getGasPrice(); //获取当前gas价格
    Contract.methods.repay(0, true).send({ from: address, gasPrice: gasPrice, gas: relWeb3.utils.toHex(900000) }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  const repay = async () => {
    let Contract = new relWeb3.eth.Contract(ManageAbi as any, manageContract, {
      from: address
    });
    let gasPrice = await relWeb3.eth.getGasPrice(); //获取当前gas价格
    Contract.methods.repay(0, false).send({ from: address, gasPrice: gasPrice, gas: relWeb3.utils.toHex(900000) }, (err: any, result: any) => {
      if (err) {
        message.error(err.message)
      } else {
        message.success(result)
      }
    })
  }

  return (
    <BasicLayout>
      <div className='buySellContainer'>
        <div className='connectBtn'>
          <Button type='primary' size='large' onClick={connectClick}>
            connect Wallet
          </Button>
          <div className='address'>Address:{address || '--'}</div>
          {showCoinBtn ? <div className='currencyContainer' onClick={showFunClick}>
            <div className='currencyTop'>
              <div>USDT-BUSD</div>
              <div>11.19%</div>
            </div>
            <div className='currencyBottom'>
              <div>Biswap</div>
              <div>0.03%</div>
            </div>
          </div> : null}
          {showFun ? <>
            <div className='currencyContainer'>
              <div className='currencyBottom'>
                <div>Deposit</div>
                <div>{depositBalance}</div>
              </div>
              <div className='currencyBottom'>
                <div>APY</div>
                <div>--</div>
              </div>
              <div className='currencyBottom'>
                <div>share of pool</div>
                <div>{sharePool}</div>
              </div>
            </div>
            <Button type='primary' size='large' onClick={earn}>Earn</Button>
            <div className='transactionTabs'>
              <Tabs defaultActiveKey="1" onChange={showTabPane}>
                <TabPane tab="Deposit" key="1">
                  <div>LP balance: {balance}</div>
                  <Input className='amountInput' placeholder='deposit amount' value={amount} onChange={(e) => handleAmount(e.target.value)} />
                  <Space size={16}>
                    <Button type='primary' size='large' onClick={approve}>
                      Approve
                    </Button>
                    <Button type='primary' size='large' onClick={deposit}>
                      Deposit
                    </Button>
                  </Space>
                </TabPane>
                <TabPane tab="Withdraw" key="2">
                  <div>LP balance: {balance}</div>
                  <Input className='amountInput' placeholder='withdraw amount' value={withdrawAmount} onChange={(e) => handleWithdrawAmount(e.target.value)} />
                  <Button type='primary' size='large' onClick={withdraw}>
                    Withdraw
                  </Button>
                </TabPane>
                <TabPane tab="Borrow" key="3">
                  <Space size={8} direction='vertical'>
                    <div>Share token: {shareToken}</div>
                    <div>borrowed(USDA): {usdaBorrowed}</div>
                    <div>interest rate: {interestRate}%</div>
                  </Space>
                  <Input className='amountInput' placeholder='Share token' value={borrowAmount} onChange={(e) => handleBorrowAmount(e.target.value)} />
                  <Input placeholder='cycle(1-10)' disabled value={cycle} onChange={(e) => handleCycle(e.target.value)} />
                  <div className='spaceSty'>can borrow 0.00</div>
                  <Space size={16}>
                    <Button type='primary' size='large' onClick={approveBorrow}>
                      Approve
                    </Button>
                    <Button type='primary' size='large' onClick={borrow}>
                      Borrow
                    </Button>
                  </Space>
                </TabPane>
                <TabPane tab="Repay" key="4">
                  <Space size={8} direction='vertical'>
                    <div>share token(collateral): {shareTokenRepay}</div>
                    <div>need to repay: {needToRepay}</div>
                  </Space>
                  <div></div>
                  <Space direction='vertical' size={16}>
                    <Space size={16}>
                      <Button type='primary' size='large' onClick={approveRepay}>
                        approve USDA
                      </Button>
                      <Button type='primary' size='large' onClick={approveUSDA}>
                        by USDA
                      </Button>
                    </Space>
                    <Button type='primary' size='large' onClick={repay}>
                      by withdraw(only share of borrowed)
                    </Button>
                  </Space>
                </TabPane>
              </Tabs>
            </div></> : null}
        </div>
      </div>
    </BasicLayout>
  )
};

export default Home