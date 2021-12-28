<template>
  <div class="home">
    <div class="buySellContainer">
      <div class="connectBtn">
        <Button type="primary" size="large" @click="connectClick">
          connect Wallet
        </Button>
        <div class="address">Address:{{ address || "--" }}</div>
        <div v-if="showCoinBtn" class="currencyContainer" @click="showFunClick">
          <div class="currencyTop">
            <div>USDT-BUSD</div>
            <div>11.19%</div>
          </div>
          <div class="currencyBottom">
            <div>Biswap</div>
            <div>0.03%</div>
          </div>
        </div>
        <div v-if="showFun">
          <div class="currencyContainer">
            <div class="currencyBottom">
              <div>Deposit</div>
              <div>{{ depositBalance }}</div>
            </div>
            <div class="currencyBottom">
              <div>APY</div>
              <div>--</div>
            </div>
            <div class="currencyBottom">
              <div>share of pool</div>
              <div>{{ sharePool }}</div>
            </div>
          </div>
          <Space direction="vertical" :size="16">
            <Button type="primary" size="large" @click="earn">Earn</Button>
            <Space :size="16">
              <Input
                class="amountInput"
                placeholder="liquidate address"
                :value="liquidateAddress"
                @change="(e) => (liquidateAddress = e.target.value)"
              />
              <Button type="primary" size="large" @click="liquidate"
                >Liquidate</Button
              >
            </Space>
          </Space>
          <div class="transactionTabs">
            <Tabs defaultActiveKey="1" @change="showTabPane">
              <TabPane tab="Deposit" key="1">
                <div>LP balance: {{ balance }}</div>
                <Input
                  class="amountInput"
                  placeholder="deposit amount"
                  :value="amount"
                  @change="(e) => (amount = e.target.value)"
                />
                <Space :size="16">
                  <Button type="primary" size="large" @click="approve">
                    Approve
                  </Button>
                  <Button type="primary" size="large" @click="deposit">
                    Deposit
                  </Button>
                </Space>
              </TabPane>
              <TabPane tab="Withdraw" key="2">
                <div>LP balance: {{ balance }}</div>
                <Input
                  class="amountInput"
                  placeholder="withdraw amount"
                  :value="withdrawAmount"
                  @change="(e) => (withdrawAmount = e.target.value)"
                />
                <Button type="primary" size="large" @click="withdraw">
                  Withdraw
                </Button>
              </TabPane>
              <TabPane tab="Borrow" key="3">
                <Space :size="8" direction="vertical">
                  <div>Share token: {{ shareToken }}</div>
                  <div>borrowed(USDA): {{ usdaBorrowed }}</div>
                  <div>interest rate: {{ interestRate }}%</div>
                </Space>
                <Input
                  class="amountInput"
                  placeholder="Share token"
                  :value="borrowAmount"
                  @change="shareTokenChange"
                />
                <Input
                  placeholder="cycle(1-10)"
                  disabled
                  :value="cycle"
                  @change="(e) => (cycle = e.target.value)"
                />
                <div class="spaceSty">
                  can borrow {{ canBorrowAmount }}(USDA)
                </div>
                <Space :size="16">
                  <Button type="primary" size="large" @click="approveBorrow">
                    Approve
                  </Button>
                  <Button type="primary" size="large" @click="borrow">
                    Borrow
                  </Button>
                </Space>
              </TabPane>
              <TabPane tab="Repay" key="4">
                <Space :size="8" direction="vertical">
                  <div>share token(collateral): {{ shareTokenRepay }}</div>
                  <div>need to repay: {{ needToRepay }}</div>
                </Space>
                <div></div>
                <Space direction="vertical" :size="16">
                  <Space :size="16">
                    <Button type="primary" size="large" @click="approveRepay">
                      approve USDA
                    </Button>
                    <Button type="primary" size="large" @click="approveUSDA">
                      use USDA
                    </Button>
                  </Space>
                  <Button type="primary" size="large" @click="repay">
                    use LP
                  </Button>
                </Space>
              </TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Button, message, Space, Tabs, TabPane, Input } from "ant-design-vue";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import Erc20Abi from "@/utils/erc20.abi.json";
import ManageAbi from "@/utils/manageAbi.abi.json";
import Psc from "@/utils/psc.abi.json";
import {
  lpContract,
  manageContract,
  shareContract,
  pscContract,
  usdaContract,
} from "@/utils/config";
// import { Options, Vue } from "vue-class-component";
// import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

// @Options({
//   components: {
//     HelloWorld,
//   },
// })
// export default class Home extends Vue {}
const address = ref<string>("");
const relWeb3 = ref<any>("");
const showCoinBtn = ref<boolean>(false);
const showFun = ref<boolean>(false);
const balance = ref<string | number>("");
const depositBalance = ref<string | number>("--");
const sharePool = ref<string | number>("");
const shareToken = ref<string | number>("");
const shareTokenRepay = ref<string | number>("");
const needToRepay = ref<string | number>("");
const usdaBorrowed = ref<string | number>("");
const interestRate = ref<string | number>("");
const amount = ref<string | number>("");
const withdrawAmount = ref<string | number>("");
const borrowAmount = ref<string | number>("");
const canBorrowAmount = ref<string | number>("");
const liquidateAddress = ref<string | number>("");
const cycle = ref<string | number>("");

//后期需要调整
const testNeedToRepay = ref<string | number>("");

const connectClick = () => {
  console.log(1);
  if (!Web3.givenProvider) {
    message.error("no_available_provider");
    return;
  }
  let RelWeb3 = new Web3(Web3.givenProvider);
  relWeb3.value = RelWeb3;
  relWeb3.value.eth
    .requestAccounts()
    .then(async (res: any) => {
      address.value = res[0];
      getBalanceOf(RelWeb3, address.value);
      showCoinBtn.value = true;
    })
    .catch((err: any) => {
      message.error(err.message);
    });
};

const getBalanceOf = async (relWeb3: Web3, address: string) => {
  //获取LP balance
  let Contract = new relWeb3.eth.Contract(Erc20Abi as any, lpContract);
  let resBalance = await Contract.methods
    .balanceOf(address)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  let Balance = new BigNumber(resBalance)
    .dividedBy(Math.pow(10, 18))
    .toFixed(4);
  balance.value = Balance;

  //获取 deposit balance
  let MagContract = new relWeb3.eth.Contract(ManageAbi as any, manageContract);
  let resDepositBalance = await MagContract.methods
    .getStakedTokens(0, address)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  let DepositBalance = new BigNumber(resDepositBalance)
    .dividedBy(Math.pow(10, 18))
    .toFixed(4);
  depositBalance.value = DepositBalance;

  //获取sharePool
  let ShareContract = new relWeb3.eth.Contract(Erc20Abi as any, shareContract);
  let resShareBalance = await ShareContract.methods
    .balanceOf(address)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  let shareTotal = await ShareContract.methods
    .totalSupply()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return 0;
      }
    });
  let SharePool =
    shareTotal === "0"
      ? "0.00%"
      : new BigNumber(resShareBalance)
          .dividedBy(new BigNumber(shareTotal))
          .dividedBy(100)
          .toFixed(4) + "%";
  sharePool.value = SharePool;
};

const showFunClick = () => {
  showFun.value = true;
};

const approve = () => {
  let Contract = new relWeb3.value.eth.Contract(Erc20Abi as any, lpContract, {
    from: address.value,
  });
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      manageContract,
      new BigNumber(amount.value).multipliedBy(Math.pow(10, 18)).toFixed()
    )
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const deposit = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //deposit参数: 1.第0个币种,2.金额
  Contract.methods
    .deposit(
      0,
      new BigNumber(amount.value).multipliedBy(Math.pow(10, 18)).toFixed()
    )
    .send(
      {
        from: address.value,
        gasPrice: gasPrice,
        gas: relWeb3.value.utils.toHex(900000),
      },
      (err: any, result: any) => {
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(JSON.stringify(result));
        }
      }
    );
};

const earn = async () => {
  let Contract = new relWeb3.value.eth.Contract(Psc as any, pscContract, {
    from: address.value,
  });
  Contract.methods
    .earn()
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const liquidate = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //deposit参数: 1.第0个币种,2.liquidate Address
  Contract.methods.liquidate(0, liquidateAddress.value).send(
    {
      from: address.value,
      gasPrice: gasPrice,
      gas: relWeb3.value.utils.toHex(900000),
    },
    (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    }
  );
};

const withdraw = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //withdraw参数: 1.第0个币种,2.金额
  Contract.methods
    .withdraw(
      0,
      new BigNumber(withdrawAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed()
    )
    .send(
      {
        from: address.value,
        gasPrice: gasPrice,
        gas: relWeb3.value.utils.toHex(900000),
      },
      (err: any, result: any) => {
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(JSON.stringify(result));
        }
      }
    );
};

const showTabPane = async (item: any) => {
  if (item === "3") {
    //获取sharePool
    let ShareContract = new relWeb3.value.eth.Contract(
      Erc20Abi as any,
      shareContract
    );
    let ShareToken = await ShareContract.methods
      .balanceOf(address.value)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    shareToken.value = new BigNumber(ShareToken)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);

    //获取borrowed
    let borrowedContract = new relWeb3.value.eth.Contract(
      ManageAbi as any,
      manageContract,
      {
        from: address.value,
      }
    );
    let borrowedArr = await borrowedContract.methods
      .userInfos(0, address.value)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    usdaBorrowed.value = new BigNumber(borrowedArr.usdaBorrowed)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);

    //获取interest rate
    let interestRateArr = await borrowedContract.methods
      .poolInfos(0)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    interestRate.value = new BigNumber(interestRateArr.interestRate)
      .dividedBy(100)
      .toFixed(2);
  }
  if (item === "4") {
    //获取share token(collateral)
    let borrowedContract = new relWeb3.value.eth.Contract(
      ManageAbi as any,
      manageContract,
      {
        from: address.value,
      }
    );
    let borrowedArr = await borrowedContract.methods
      .userInfos(0, address.value)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    shareTokenRepay.value = new BigNumber(borrowedArr.collateralAmount)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);

    //test利率(后期调整)
    let interestRateArr = await borrowedContract.methods
      .poolInfos(0)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    needToRepay.value = new BigNumber(borrowedArr.usdaBorrowed)
      .dividedBy(Math.pow(10, 18))
      .multipliedBy(new BigNumber(10000).plus(interestRateArr.interestRate))
      .dividedBy(10000)
      .toFixed(4);
    testNeedToRepay.value = new BigNumber(borrowedArr.usdaBorrowed)
      .multipliedBy(new BigNumber(10000).plus(interestRateArr.interestRate))
      .toFixed(0);
  }
};

const approveBorrow = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    shareContract,
    {
      from: address.value,
    }
  );
  Contract.methods
    .approve(
      manageContract,
      new BigNumber(borrowAmount.value).multipliedBy(Math.pow(10, 18)).toFixed()
    )
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const borrow = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //borrow参数: 1.第0个币种,2.金额
  Contract.methods
    .borrow(
      0,
      new BigNumber(borrowAmount.value).multipliedBy(Math.pow(10, 18)).toFixed()
    )
    .send(
      {
        from: address.value,
        gasPrice: gasPrice,
        gas: relWeb3.value.utils.toHex(900000),
      },
      (err: any, result: any) => {
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(result);
        }
      }
    );
};

const approveRepay = async () => {
  let Contract = new relWeb3.value.eth.Contract(Erc20Abi as any, usdaContract, {
    from: address.value,
  });
  Contract.methods
    .approve(manageContract, testNeedToRepay.value)
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(result);
      }
    });
};

const approveUSDA = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  Contract.methods.repay(0, true).send(
    {
      from: address.value,
      gasPrice: gasPrice,
      gas: relWeb3.value.utils.toHex(900000),
    },
    (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(result);
      }
    }
  );
};

const repay = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  Contract.methods.repay(0, false).send(
    {
      from: address.value,
      gasPrice: gasPrice,
      gas: relWeb3.value.utils.toHex(900000),
    },
    (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(result);
      }
    }
  );
};

const shareTokenChange = async (e: Event) => {
  borrowAmount.value = (e.target as HTMLInputElement).value;
  if ((e.target as HTMLInputElement).value) {
    let Contract = new relWeb3.value.eth.Contract(
      ManageAbi as any,
      manageContract,
      {
        from: address.value,
      }
    );
    let canBorrowRes = await Contract.methods
      .getCanBorrow(
        0,
        new BigNumber((e.target as HTMLInputElement).value)
          .multipliedBy(Math.pow(10, 18))
          .toFixed(),
        1
      )
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    canBorrowAmount.value = new BigNumber(canBorrowRes)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
  }
};
</script>

<style lang="less" scoped>
.buySellContainer {
  width: 1280px;
  display: flex;
  margin: auto;
  min-height: calc(100vh - 120px);
  flex-direction: column;
  .connectBtn {
    margin: 40px auto;
    text-align: center;
  }
  .address {
    margin-top: 20px;
    font-size: 24px;
  }
  .currencyContainer {
    padding: 40px;
    background: #0045ff;
    cursor: pointer;
    border-radius: 10px;
    margin-top: 20px;
    margin-bottom: 20px;
    color: #fff;
    .currencyTop {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 24px;
      font-weight: bold;
      div {
        padding: 0 20px;
      }
    }
    .currencyBottom {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      opacity: 0.5;
      div {
        padding: 0 20px;
      }
    }
  }
  .transactionTabs {
    margin-top: 40px;
    .amountInput {
      margin: 40px auto;
    }
  }
  .spaceSty {
    margin-top: 10px;
    margin-bottom: 10px;
  }
}
</style>
