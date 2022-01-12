<template>
  <div class="home">
    <div class="buySellContainer">
      <div class="connectBtn">
        <Button type="primary" size="large" @click="connectClick">
          connect Wallet
        </Button>
        <div class="address">Address:{{ address || "--" }}</div>
        <Tabs
          defaultActiveKey="1"
          v-if="showCoinBtn"
          @change="farmOrLendOnChange"
        >
          <TabPane tab="Farm" key="1">
            <div class="currencyContainer" @click="showFunClick">
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
                      <Button
                        type="primary"
                        size="large"
                        @click="approveBorrow"
                      >
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
                        <Button
                          type="primary"
                          size="large"
                          @click="approveRepay"
                        >
                          approve USDA
                        </Button>
                        <Button
                          type="primary"
                          size="large"
                          @click="approveUSDA"
                        >
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
          </TabPane>
          <TabPane tab="Lend" key="2">
            <div class="currencyContainer">
              <div class="currencyTop">
                <div>Pool Overview</div>
              </div>
              <div class="currencyBottom">
                <div>Total Borrow</div>
                <div>--</div>
              </div>
              <div class="currencyBottom">
                <div>Total Supply</div>
                <div>--</div>
              </div>
            </div>
            <Table :columns="columns" :data-source="data">
              <template #bodyCell="{ column, record }">
                <template v-if="column.keys === 'userUsePoolAsCollateral'">
                  <div>
                    <Switch
                      :checked="record.userUsePoolAsCollateral"
                      @click="() => clickSwitch(record)"
                    />
                  </div>
                </template>
                <template v-if="column.keys === 'APR'">
                  <div>
                    {{
                      new BigNumber(record?.APR)
                        .dividedBy(Math.pow(10, 16))
                        .toFixed(4)
                    }}%
                  </div>
                </template>
                <template v-if="column.keys === 'liquidityBalance'">
                  <Space :size="10">
                    <Button
                      type="primary"
                      size="large"
                      @click="() => openDepositModal(record)"
                    >
                      deposit
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      @click="() => openWithdrawModal(record)"
                    >
                      withdraw
                    </Button>
                  </Space>
                </template>
                <template v-if="column.keys === 'borrowOperation'">
                  <Space :size="10">
                    <Button
                      type="primary"
                      size="large"
                      @click="() => openBorrowModal(record)"
                    >
                      borrow
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      @click="() => openRepayModal(record)"
                    >
                      repay
                    </Button>
                  </Space>
                </template>
              </template>
              <template #expandedRowRender="{ record }">
                <p style="margin: 0">contractAddress: {{ record?.contract }}</p>
                <p style="margin: 0">
                  alToken: {{ record?.getPoolBalance?.alToken }}
                </p>
                <p style="margin: 0">
                  alphaMultiplier:
                  {{ record?.getPoolBalance?.alphaMultiplier }}
                </p>
                <p style="margin: 0">
                  lastUpdateTimestamp:
                  {{ record?.getPoolBalance?.lastUpdateTimestamp }}
                </p>
                <p style="margin: 0">
                  poolConfig: {{ record?.getPoolBalance?.poolConfig }}
                </p>
                <p style="margin: 0">
                  poolReserves:
                  {{ record?.getPoolBalance?.poolReserves }}
                </p>
                <p style="margin: 0">
                  status:
                  {{ record?.getPoolBalance?.status }}
                </p>
                <p style="margin: 0">
                  totalAlphaTokenReward:
                  {{
                    new BigNumber(record?.getPoolBalance?.totalAlphaTokenReward)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  totalBorrowShares:
                  {{
                    new BigNumber(record?.getPoolBalance?.totalBorrowShares)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  totalBorrows:
                  {{
                    new BigNumber(record?.getPoolBalance?.totalBorrows)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <div class="spaceSty" />
                <p style="margin: 0">
                  optimalUtilizationRate:
                  {{
                    new BigNumber(record?.optimalUtilizationRate)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  baseBorrowRate:
                  {{
                    new BigNumber(record?.baseBorrowRate)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  rateSlope1:
                  {{
                    new BigNumber(record?.rateSlope1)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  rateSlope2:
                  {{
                    new BigNumber(record?.rateSlope2)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  collateralPercent:
                  {{
                    new BigNumber(record?.collateralPercent)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
                <p style="margin: 0">
                  liquidationBonusPercent:
                  {{
                    new BigNumber(record?.liquidationBonusPercent)
                      .dividedBy(Math.pow(10, 18))
                      .toFixed(4)
                  }}
                </p>
              </template>
            </Table>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
  <Modal
    :visible="depositVisible"
    :title="modalTitle"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="depositModalHandleOk"
    @cancel="depositModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="approve deposit amount"
      :value="LendApproveAmount"
      @change="(e) => (LendApproveAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendApprove"> approve </Button>
    <div class="spaceSty" />
    <Input
      class="amountInput"
      placeholder="approve deposit amount"
      :value="LendDepositAmount"
      @change="(e) => (LendDepositAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendDeposit"> deposit </Button>
  </Modal>
  <Modal
    :visible="borrowVisible"
    :title="borrowModalTitle"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="borrowerModalHandleOk"
    @cancel="borrowModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="borrow amount"
      :value="LendBorrowAmount"
      @change="(e) => (LendBorrowAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendBorrow"> borrow </Button>
  </Modal>
  <Modal
    :visible="withdrawVisible"
    :title="withdrawModalTitle"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="withdrawHandleOk"
    @cancel="withdrawModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="withdraw amount"
      :value="LendWithdrawAmount"
      @change="(e) => (LendWithdrawAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendWithdraw">
      withdraw
    </Button>
  </Modal>
  <Modal
    :visible="RepayVisible"
    :title="RepayModalTitle"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="RepayHandleOk"
    @cancel="RepayModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="withdraw amount"
      :value="LendRepayAmount"
      @change="(e) => (LendRepayAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendApproveRepay">
      approveRepay
    </Button>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendRepay"> Repay </Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Button,
  message,
  Space,
  Tabs,
  TabPane,
  Input,
  Table,
  Modal,
  Switch,
} from "ant-design-vue";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import Erc20Abi from "@/utils/erc20.abi.json";
import ManageAbi from "@/utils/manageAbi.abi.json";
import Psc from "@/utils/psc.abi.json";
import InfoAbi from "@/utils/info.abi.json";

//Lend使用的abi
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import BNBTokenAbi from "@/utils/BNBToken_metadata.abi.json";
import DAITokenAbi from "@/utils/DaiToken_metadata.abi.json";
import BUSDTokenAbi from "@/utils/BUSDToken_metadata.abi.json";
import PoolConfigurationAbi from "@/utils/PoolConfiguration_metadata.abi.json";

import {
  lpContract,
  manageContract,
  shareContract,
  pscContract,
  usdaContract,
  infoContract,
  leadingpoolContract,
  bnbContract,
  daiContract,
  busdContract,
} from "@/utils/config";
const columns = [
  {
    title: "Assets",
    dataIndex: "assets",
  },
  {
    title: "APR",
    keys: "APR",
    dataIndex: "APR",
  },
  {
    title: "WalletBalance",
    dataIndex: "walletBalance",
  },
  {
    title: "LiquidityBalance",
    keys: "liquidityBalance",
    dataIndex: "liquidityBalance",
  },
  {
    title: "LiquidityOperation",
    keys: "LiquidityOperation",
    dataIndex: "LiquidityOperation",
  },
  {
    title: "BorrowBalance",
    keys: "borrowBalance",
    dataIndex: "borrowBalance",
  },
  {
    title: "UserUsePoolAsCollateral",
    keys: "userUsePoolAsCollateral",
    dataIndex: "userUsePoolAsCollateral",
  },
  {
    title: "borrowOperation",
    keys: "borrowOperation",
    dataIndex: "borrowOperation",
  },
];
const Data = [
  {
    key: "BNB",
    assets: "BNB",
    liquidityBalance: 0,
    APR: 0,
    borrowBalance: "0",
    walletBalance: "0",
    optimalUtilizationRate: "0",
    userUsePoolAsCollateral: false,
    contract: bnbContract, //BNB合约地址
    abi: BNBTokenAbi,
  },
  {
    key: "DAI",
    assets: "DAI",
    liquidityBalance: 0,
    APR: 0,
    borrowBalance: "0",
    walletBalance: "0",
    optimalUtilizationRate: "0",
    userUsePoolAsCollateral: false,
    contract: daiContract, //DAI合约地址
    abi: DAITokenAbi,
  },
  {
    key: "BUSD",
    assets: "BUSD",
    liquidityBalance: 0,
    APR: 0,
    borrowBalance: "0",
    walletBalance: "0",
    optimalUtilizationRate: "0",
    userUsePoolAsCollateral: false,
    contract: busdContract, //BUSD合约地址
    abi: BUSDTokenAbi,
  },
];
const address = ref<string>("");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

//Lend params
const data = ref<any>(Data);
const LendApproveAmount = ref<string | number>("");
const LendDepositAmount = ref<string | number>("");
const LendBorrowAmount = ref<string | number>("");
const depositVisible = ref<boolean>(false);
const modalTitle = ref<string | number>("deposit");
const borrowVisible = ref<boolean>(false);
const borrowModalTitle = ref<string | number>("borrow");
const chooseItem = ref<any>({});
const withdrawVisible = ref<boolean>(false);
const withdrawModalTitle = ref<string | number>("withdraw");
const LendWithdrawAmount = ref<string | number>("");
const RepayVisible = ref<boolean>(false);
const RepayModalTitle = ref<string | number>("withdraw");
const LendRepayAmount = ref<string | number>("");

//后期需要调整
const testNeedToRepay = ref<string | number>("");

const connectClick = () => {
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

//Lend fun
const farmOrLendOnChange = async (children: any) => {
  if (children === "2") {
    let Contract = new relWeb3.value.eth.Contract(
      LendingPoolAbi as any,
      leadingpoolContract
    );
    for (let item of data.value) {
      let res = await Contract.methods
        .getUserPoolData(address.value, item.contract)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.liquidityBalance = new BigNumber(res.compoundedLiquidityBalance)
        .dividedBy(Math.pow(10, 18))
        .toFixed(4);
      item.borrowBalance = new BigNumber(res.compoundedBorrowBalance)
        .dividedBy(Math.pow(10, 18))
        .toFixed(4);
      item.userUsePoolAsCollateral = res.userUsePoolAsCollateral;
      let resGetPoolBalance = await Contract.methods
        .pools(item.contract)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.getPoolBalance = resGetPoolBalance;
      //获取钱包代币余额
      let balanceContract = new relWeb3.value.eth.Contract(
        item.abi as any,
        item.contract
      );
      let resBalance = await balanceContract.methods
        .balanceOf(address.value)
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
      item.walletBalance = Balance;
      //获取APR和utilizationRate
      let totalLiquidity = await Contract.methods
        .getTotalLiquidity(item.contract)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      let poolConfigContract = new relWeb3.value.eth.Contract(
        PoolConfigurationAbi as any,
        resGetPoolBalance.poolConfig
      );
      let rate = await poolConfigContract.methods
        .calculateInterestRate(resGetPoolBalance.totalBorrows, totalLiquidity)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      let utilizationRate = await poolConfigContract.methods
        .getUtilizationRate(resGetPoolBalance.totalBorrows, totalLiquidity)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.APR = rate;
      item.utilizationRate = utilizationRate;
      //获取optimalUtilizationRate
      let optimalUtilizationRate = await poolConfigContract.methods
        .getOptimalUtilizationRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.optimalUtilizationRate = optimalUtilizationRate;
      //获取baseBorrowRate
      let baseBorrowRate = await poolConfigContract.methods
        .baseBorrowRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.baseBorrowRate = baseBorrowRate;
      //获取rateSlope1
      let rateSlope1 = await poolConfigContract.methods
        .baseBorrowRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.rateSlope1 = rateSlope1;
      //获取rateSlope2
      let rateSlope2 = await poolConfigContract.methods
        .baseBorrowRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.rateSlope2 = rateSlope2;
      //获取collateralPercent
      let collateralPercent = await poolConfigContract.methods
        .baseBorrowRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.collateralPercent = collateralPercent;
      //获取liquidationBonusPercent
      let liquidationBonusPercent = await poolConfigContract.methods
        .baseBorrowRate()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.liquidationBonusPercent = liquidationBonusPercent;
    }
  }
};

const clickSwitch = async (item: any) => {
  console.log("item", item.contract, item.userUsePoolAsCollateral);
  let lendingPoolContract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  let res = await lendingPoolContract.methods
    .setUserUseAsCollateral(item.contract, !item.userUsePoolAsCollateral)
    .send(
      {
        from: address.value,
        gasPrice: gasPrice,
        gas: relWeb3.value.utils.toHex(900000),
      },
      (err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          message.error(JSON.stringify(err.message));
          return "--";
        }
      }
    );
  //重新请求该列UserUsePoolAsCollateral状态,demo直接请求table所有数据(不推荐)
  farmOrLendOnChange(2);
};

const openDepositModal = (item: any) => {
  chooseItem.value = item;
  depositVisible.value = true;
};

const depositModalHandleOk = () => {
  depositVisible.value = false;
};

const depositModalHandleCancel = () => {
  depositVisible.value = false;
};

//打开borrrow弹框
const openBorrowModal = (item: any) => {
  chooseItem.value = item;
  borrowVisible.value = true;
};

const borrowerModalHandleOk = () => {
  borrowVisible.value = false;
};

const borrowModalHandleCancel = () => {
  borrowVisible.value = false;
};

//打开withdraw弹框
const openWithdrawModal = (item: any) => {
  chooseItem.value = item;
  withdrawVisible.value = true;
};

const withdrawHandleOk = () => {
  withdrawVisible.value = false;
};

const withdrawModalHandleCancel = () => {
  withdrawVisible.value = false;
};

//打开Repay弹框
const openRepayModal = (item: any) => {
  chooseItem.value = item;
  RepayVisible.value = true;
};

const RepayHandleOk = () => {
  RepayVisible.value = false;
};

const RepayModalHandleCancel = () => {
  RepayVisible.value = false;
};

const lendApprove = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    chooseItem.value.abi as any,
    chooseItem.value.contract,
    {
      from: address.value,
    }
  );
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      leadingpoolContract,
      new BigNumber(LendApproveAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed()
    )
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const lendDeposit = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //deposit参数: 1.第0个币种,2.金额
  Contract.methods
    .deposit(
      chooseItem.value.contract,
      new BigNumber(LendDepositAmount.value)
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
        depositVisible.value = false;
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(JSON.stringify(result));
        }
      }
    );
};

const lendBorrow = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //borrow参数: 1.dai合约地址,2.金额
  Contract.methods
    .borrow(
      chooseItem.value.contract,
      new BigNumber(LendBorrowAmount.value)
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
        borrowVisible.value = false;
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(result);
        }
      }
    );
};

const lendWithdraw = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //withdraw参数: 1.dai合约地址,2.金额
  Contract.methods
    .withdraw(
      chooseItem.value.contract,
      new BigNumber(LendWithdrawAmount.value)
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
        withdrawVisible.value = false;
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(result);
        }
      }
    );
};

const lendApproveRepay = () => {
  let Contract = new relWeb3.value.eth.Contract(
    chooseItem.value.abi as any,
    chooseItem.value.contract,
    {
      from: address.value,
    }
  );
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      leadingpoolContract,
      new BigNumber(LendRepayAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed()
    )
    .send({ from: address.value }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const lendRepay = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //repay参数: 1.dai合约地址,2.金额
  Contract.methods
    .repayByAmount(
      chooseItem.value.contract,
      new BigNumber(LendRepayAmount.value)
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
        RepayVisible.value = false;
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(result);
        }
      }
    );
};

//Farm fun
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
  let MagContract = new relWeb3.eth.Contract(InfoAbi as any, infoContract);
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

    let InfoContract = new relWeb3.value.eth.Contract(
      InfoAbi as any,
      infoContract,
      {
        from: address.value,
      }
    );
    let borrowedArr = await InfoContract.methods
      .getUser(0, address.value)
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
    let interestRateArr = await InfoContract.methods
      .getPool(0)
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
    let InfoContract = new relWeb3.value.eth.Contract(
      InfoAbi as any,
      infoContract,
      {
        from: address.value,
      }
    );
    let borrowedArr = await InfoContract.methods
      .getUser(0, address.value)
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
    let interestRateArr = await InfoContract.methods
      .getPool(0)
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
.approveContainer {
  display: flex;
  flex-direction: row;
  margin-top: 30px;
  h2 {
    margin-right: 20px;
  }
  input {
    width: 200px;
    margin-right: 20px;
  }
  button {
    height: 44px;
  }
}
.spaceSty {
  height: 20px;
  width: 100%;
}
</style>
