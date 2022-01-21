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
            <div>LP balance: {{ balance }}</div>
            <Table :columns="columns" :data-source="data">
              <template #bodyCell="{ column, record }">
                <template v-if="column.keys === 'depositOperation'">
                  <Button
                    type="primary"
                    size="large"
                    @click="() => showDepositModal(record)"
                  >
                    Deposit
                  </Button>
                </template>
                <template v-if="column.keys === 'withdrawOperation'">
                  <Button
                    type="primary"
                    size="large"
                    @click="() => showWithdrawModal(record)"
                  >
                    Withdraw
                  </Button>
                </template>
                <template v-if="column.keys === 'borrowOperation'">
                  <Button
                    type="primary"
                    size="large"
                    @click="() => showBorrowDepositModal(record)"
                  >
                    BorrowDeposit
                  </Button>
                </template>
              </template>
              <template #expandedRowRender="{ record }">
                <p style="margin: 0">
                  aLPToken: {{ record?.poolInfos.aLPToken }}
                </p>
                <p style="margin: 0">
                  allocPoint: {{ record?.poolInfos.allocPoint }}
                </p>
                <p style="margin: 0">
                  farmAddress: {{ record?.poolInfos.farmAddress }}
                </p>
                <p style="margin: 0">
                  lastRewardBlock: {{ record?.poolInfos.lastRewardBlock }}
                </p>
                <p style="margin: 0">
                  lendingPoolAddress: {{ record?.poolInfos.lendingPoolAddress }}
                </p>
                <p style="margin: 0">
                  lpToken: {{ record?.poolInfos.lpToken }}
                </p>
                <p style="margin: 0">
                  rewardTokenPerAlp: {{ record?.poolInfos.rewardTokenPerAlp }}
                </p>
              </template>
            </Table>
            <div class="transactionTabs">
              <Tabs defaultActiveKey="1" @change="showTabPane">
                <!-- <TabPane tab="Borrow" key="3">
                    <Space :size="8" direction="vertical">
                      <div>share token: {{ shareToken }}</div>
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
                  </TabPane> -->
              </Tabs>
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
          </TabPane>
          <TabPane tab="Lend" key="2">
            <Lend :relWeb3="relWeb3" :address="address" />
          </TabPane>
          <TabPane tab="Liquidation" key="3">
            <Liquidation :relWeb3="relWeb3" :address="address" />
          </TabPane>
          <TabPane tab="Settings" key="4">
            <Settings :relWeb3="relWeb3" :address="address" />
          </TabPane>
          <TabPane tab="Records" key="5">
            <Records />
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
  <Modal
    :visible="depositVisible"
    title="Depoist"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="depositModalHandleOk"
    @cancel="depositModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="deposit amount"
      :value="amount"
      @change="(e) => (amount = e.target.value)"
    />
    <div class="spaceSty" />
    <Space :size="16">
      <Button type="primary" size="large" @click="approve"> approve </Button>
      <div class="spaceSty" />
      <Button type="primary" size="large" @click="deposit"> deposit </Button>
    </Space>
  </Modal>
  <Modal
    :visible="withdrawVisible"
    title="Withdraw"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="withdrawModalHandleOk"
    @cancel="withdrawModalHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="withdraw amount"
      :value="withdrawAmount"
      @change="(e) => (withdrawAmount = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="withdraw"> Withdraw </Button>
  </Modal>
  <Modal
    :visible="borrowDepositVisible"
    title="BorrowDeposit"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="BorrowDepositModalHandleOk"
    @cancel="BorrowDepositModalHandleCancel"
  >
    <div>
      collateral(aLP):
      {{ new BigNumber(alpBalance).dividedBy(Math.pow(10, 18)).toFixed(4) }}
    </div>
    <div>Borrow Token:</div>
    <RadioGroup v-model:value="borrowToken">
      <Radio :value="usdaContract">USDT</Radio>
    </RadioGroup>
    <div class="spaceSty" />
    <div>max borrow: {{ maxBorrow }}(USDT)</div>
    <div class="spaceSty" />
    <Input
      class="amountInput"
      placeholder="borrowDeposit amount"
      :value="BorrowDepositAmount"
      @change="BorrowDepositAmountChange"
    />
    <div class="spaceSty" />
    <div class="spaceSty">can borrow: {{ canBorrow }}(USDT)</div>
    <div class="spaceSty" />
    <Space :size="16">
      <Button type="primary" size="large" @click="approveBorrowDeposit">
        Approve
      </Button>
      <Button type="primary" size="large" @click="BorrowDeposit">
        BorrowDeposit
      </Button>
    </Space>
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
  Table,
  Input,
  RadioGroup,
  Radio,
  Modal,
} from "ant-design-vue";
import Web3 from "web3";
import { useStore } from "vuex";
import Liquidation from "@/views/components/Liquidation.vue";
import Lend from "@/views/components/Lend.vue";
import Settings from "@/views/components/Settings.vue";
import Records from "@/views/components/Records.vue";
import BigNumber from "bignumber.js";
import Erc20Abi from "@/utils/erc20.abi.json";
import ManageAbi from "@/utils/manageAbi.abi.json";
import Psc from "@/utils/psc.abi.json";
import InfoAbi from "@/utils/info.abi.json";
import LendingPoolFarmAbi from "@/utils/lendingPool_mara_farm.abi.json";
import AlphaReleaseRuleSelectorAbi from "@/utils/AlphaReleaseRuleSelector_metadata.json";
const store = useStore();

const {
  lpContract,
  manageContract,
  shareContract,
  pscContract,
  usdaContract,
  infoContract,
  farmPoolContract,
  alphaReleaseRuleSelectorContract,
} = store.getters.getGlobalContract;

const columns = [
  {
    title: "Index",
    dataIndex: "index",
  },
  {
    title: "LP Token",
    dataIndex: "lpTokenName",
  },
  {
    title: "DepositBalance",
    dataIndex: "depositBalance",
  },
  {
    title: "Share",
    dataIndex: "share",
  },
  {
    title: "Pending reward",
    dataIndex: "pendingReward",
  },
  {
    title: "DepositOperation",
    keys: "depositOperation",
    dataIndex: "borrowOperation",
  },
  {
    title: "WithdrawOperation",
    keys: "withdrawOperation",
    dataIndex: "borrowOperation",
  },
  {
    title: "BorrowOperation",
    keys: "borrowOperation",
    dataIndex: "borrowOperation",
  },
];
const Data = [
  {
    index: 0,
    key: 0,
    lpTokenName: "USDT-BUSD",
    share: "0%",
    depositBalance: "0",
    poolInfos: {},
    borrowToken: usdaContract,
  },
];

const address = ref<string>("");
const data = ref<any>(Data);
const chooseItem = ref<any>({});
const depositVisible = ref<boolean>(false);
const withdrawVisible = ref<boolean>(false);
const borrowDepositVisible = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const relWeb3 = ref<any>("");
const showCoinBtn = ref<boolean>(false);
const balance = ref<string | number>("");
const depositBalance = ref<string | number>("--");
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

const alpBalance = ref<string | number>("0");
const borrowToken = ref<string | number>(usdaContract);
const BorrowDepositAmount = ref<string | number>("");
const maxBorrow = ref<string | number>("--");
const canBorrow = ref<string | number>("--");

const lpAmountTotal = ref<any>();
const lpTokenPrice = ref<any>();
const lendingPoolCollateralPercent = ref<any>();
const totalSupply = ref<any>();

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
  if (children === "4") {
    let Contract = new relWeb3.value.eth.Contract(
      AlphaReleaseRuleSelectorAbi as any,
      alphaReleaseRuleSelectorContract
    );
    let res = await Contract.methods
      .getreceiverRuleListLength()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
  }
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

  let InfoContract = new relWeb3.eth.Contract(InfoAbi as any, infoContract);
  for (let item of data.value) {
    let resDepositBalance = await InfoContract.methods
      .getStakedTokens(item.index, address)
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
    item.depositBalance = DepositBalance;
    let pendingReward = await InfoContract.methods
      .getPendingRewardToken(item.index, address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.pendingReward = new BigNumber(pendingReward)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    let poolInfos = await InfoContract.methods
      .getPool(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.poolInfos = poolInfos;
    //获取share
    let ShareContract = new relWeb3.eth.Contract(
      Erc20Abi as any,
      poolInfos.aLPToken
    );
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
    let Share =
      shareTotal === "0"
        ? "0.00%"
        : new BigNumber(resShareBalance)
            .dividedBy(new BigNumber(shareTotal))
            .dividedBy(100)
            .toFixed(4) + "%";
    item.share = Share;
  }
};

const showDepositModal = (item: any) => {
  depositVisible.value = true;
  chooseItem.value = item;
};

const depositModalHandleOk = () => {
  depositVisible.value = false;
};

const depositModalHandleCancel = () => {
  depositVisible.value = false;
};

const showWithdrawModal = (item: any) => {
  withdrawVisible.value = true;
  chooseItem.value = item;
};

const withdrawModalHandleOk = () => {
  withdrawVisible.value = true;
};

const withdrawModalHandleCancel = () => {
  withdrawVisible.value = false;
};

const showBorrowDepositModal = async (item: any) => {
  borrowDepositVisible.value = true;
  chooseItem.value = item;
  //获取ALP balance
  let Contract = new relWeb3.value.eth.Contract(Erc20Abi as any, shareContract);
  let resBalance = await Contract.methods
    .balanceOf(address.value)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  let ALPBalance = new BigNumber(resBalance).toFixed(4);
  alpBalance.value = ALPBalance;

  let lendingPoolContract = new relWeb3.value.eth.Contract(
    LendingPoolFarmAbi as any,
    farmPoolContract
  );
  let PscContract = new relWeb3.value.eth.Contract(Psc as any, pscContract, {
    from: address.value,
  });
  let alpContract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    shareContract
  );
  let LpAmountTotal = await PscContract.methods
    .lpAmountTotal()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lpAmountTotal.value = LpAmountTotal;
  let LpTokenPrice = await PscContract.methods
    .getLpTokenPrice()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lpTokenPrice.value = LpTokenPrice;
  let LendingPoolCollateralPercent = await lendingPoolContract.methods
    .getCollateralPercent(shareContract)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lendingPoolCollateralPercent.value = LendingPoolCollateralPercent;
  let TotalSupply = await alpContract.methods
    .totalSupply()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  totalSupply.value = TotalSupply;
  maxBorrow.value = new BigNumber(ALPBalance)
    .multipliedBy(new BigNumber(LpAmountTotal))
    .multipliedBy(new BigNumber(LpTokenPrice))
    .multipliedBy(new BigNumber(LendingPoolCollateralPercent))
    .dividedBy(new BigNumber(TotalSupply))
    .dividedBy(new BigNumber(Math.pow(10, 36)))
    .toFixed(4);
};

const BorrowDepositModalHandleOk = () => {
  borrowDepositVisible.value = true;
};

const BorrowDepositModalHandleCancel = () => {
  borrowDepositVisible.value = false;
};

const approve = (item: any) => {
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

const deposit = async (item: any) => {
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
      item.index,
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
      chooseItem.value.item,
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
  // if (item === "3") {
  //   //获取sharePool
  //   let ShareContract = new relWeb3.value.eth.Contract(
  //     Erc20Abi as any,
  //     shareContract
  //   );
  //   let ShareToken = await ShareContract.methods
  //     .balanceOf(address.value)
  //     .call((err: any, result: any) => {
  //       if (!err) {
  //         return result;
  //       } else {
  //         return "--";
  //       }
  //     });
  //   shareToken.value = new BigNumber(ShareToken)
  //     .dividedBy(Math.pow(10, 18))
  //     .toFixed(4);

  //   let InfoContract = new relWeb3.value.eth.Contract(
  //     InfoAbi as any,
  //     infoContract,
  //     {
  //       from: address.value,
  //     }
  //   );
  //   let borrowedArr = await InfoContract.methods
  //     .getUser(0, address.value)
  //     .call((err: any, result: any) => {
  //       if (!err) {
  //         return result;
  //       } else {
  //         return "--";
  //       }
  //     });
  //   usdaBorrowed.value = new BigNumber(borrowedArr.usdaBorrowed)
  //     .dividedBy(Math.pow(10, 18))
  //     .toFixed(4);

  //   //获取interest rate
  //   let interestRateArr = await InfoContract.methods
  //     .getPool(0)
  //     .call((err: any, result: any) => {
  //       if (!err) {
  //         return result;
  //       } else {
  //         return "--";
  //       }
  //     });
  //   interestRate.value = new BigNumber(interestRateArr.interestRate)
  //     .dividedBy(100)
  //     .toFixed(2);
  // }
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

const BorrowDepositAmountChange = (e: Event) => {
  BorrowDepositAmount.value = (e.target as HTMLInputElement).value;
  canBorrow.value = new BigNumber((e.target as HTMLInputElement).value)
    .multipliedBy(new BigNumber(lpAmountTotal.value))
    .multipliedBy(new BigNumber(lpTokenPrice.value))
    .multipliedBy(new BigNumber(lendingPoolCollateralPercent.value))
    .dividedBy(new BigNumber(totalSupply.value))
    .dividedBy(new BigNumber(Math.pow(10, 18)))
    .toFixed(4);
};

const approveBorrowDeposit = async () => {
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
      new BigNumber(BorrowDepositAmount.value)
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

const BorrowDeposit = async () => {
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
    .borrowDeposit(
      0,
      new BigNumber(BorrowDepositAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed(),
      borrowToken.value
    )
    .send(
      {
        from: address.value,
        gasPrice: gasPrice,
        gas: relWeb3.value.utils.toHex(9000000),
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
</script>

<style lang="less" scoped>
.buySellContainer {
  width: 1440px;
  display: flex;
  margin: auto;
  min-height: calc(100vh - 120px);
  flex-direction: column;
  .connectBtn {
    width: 100%;
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
