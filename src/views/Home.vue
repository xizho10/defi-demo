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
            <p>totalDepositInUsd: {{ totalDepositInUsd }}</p>
            <Button type="primary" size="large" @click="refresh" class="refresh"
              >Refresh</Button
            >
            <Table :columns="columns" :data-source="data" :scroll="{ x: 1440 }">
              <template #bodyCell="{ column, record }">
                <template v-if="column.keys === 'lpAmountTotal'">
                  {{
                    new BigNumber(record?.lpAmountTotal).dividedBy(
                      Math.pow(10, 18).toFixed(4)
                    )
                  }}
                </template>
                <template v-if="column.keys === 'rewardTokenPerBlock'">
                  {{
                    new BigNumber(record?.rewardTokenPerBlock).dividedBy(
                      Math.pow(10, 18).toFixed(4)
                    )
                  }}
                </template>
                <template v-if="column.keys === 'claim'">
                  <Button
                    type="primary"
                    size="large"
                    @click="() => claim(record)"
                  >
                    claim
                  </Button>
                </template>
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
                <template
                  v-if="
                    column.keys === 'earn' &&
                    record?.rewardToken ===
                      '0x0000000000000000000000000000000000000000'
                  "
                >
                  <Button
                    type="primary"
                    size="large"
                    @click="() => earn(record)"
                    >Earn</Button
                  >
                </template>
              </template>
              <template #expandedRowRender="{ record }">
                <h3>poolInfo:</h3>
                <p style="margin: 0">status: {{ record?.poolInfos.status }}</p>
                <p style="margin: 0">
                  lpToken: {{ record?.poolInfos.lpToken }}
                </p>
                <p style="margin: 0">
                  aLPToken: {{ record?.poolInfos.aLPToken }}
                </p>
                <p style="margin: 0">
                  farmAddress: {{ record?.poolInfos.farmAddress }}
                </p>
                <p style="margin: 0">
                  lastMaraRewardBlock:
                  {{ record?.poolInfos.lastMaraRewardBlock }}
                </p>
                <p style="margin: 0">
                  lendingPoolAddress: {{ record?.poolInfos.lendingPoolAddress }}
                </p>
                <div class="spaceSty" />
                <h3>FarmBase:</h3>
                <p style="margin: 0">
                  entranceFeeFactor: {{ record?.entranceFeeFactor }}
                </p>
                <p style="margin: 0">
                  withdrawFeeFactor: {{ record?.withdrawFeeFactor }}
                </p>
                <p style="margin: 0">
                  withdrawTaxRate: {{ record?.withdrawTaxRate }}
                </p>
                <p style="margin: 0">
                  rewardAddress: {{ record?.rewardAddress }}
                </p>
                <p style="margin: 0">
                  slippageFactor: {{ record?.slippageFactor }}
                </p>
                <p style="margin: 0">
                  lastEarnBlock: {{ record?.lastEarnBlock }}
                </p>
                <p style="margin: 0">
                  lpAmountTotal:
                  {{
                    new BigNumber(record?.lpAmountTotal).dividedBy(
                      Math.pow(10, 18).toFixed(4)
                    )
                  }}
                </p>
                <div class="spaceSty" />
                <h3>Balance:</h3>
                <p style="margin: 0">MaraAddress: {{ record?.MaraAddress }}</p>
                <p style="margin: 0">
                  FarmManagerInfoMaraBalance:
                  {{ record?.FarmManagerInfoMaraBalance }}
                </p>
                <p style="margin: 0">
                  FarmManagerMaraBalance: {{ record?.FarmManagerMaraBalance }}
                </p>
                <p style="margin: 0">
                  aLpMaraBalance: {{ record?.aLpMaraBalance }}
                </p>
                <p style="margin: 0">
                  userMaraBalance: {{ record?.userMaraBalance }}
                </p>
                <div class="spaceSty" />
                <h3>AlpToken:</h3>
                <p style="margin: 0">rewardToken: {{ record?.rewardToken }}</p>
                <p style="margin: 0">
                  userRewardDebts: {{ record?.userRewardDebts }}
                </p>
                <p style="margin: 0">maraPerAlp: {{ record?.maraPerAlp }}</p>
                <p style="margin: 0">
                  rewardTokenStartBlock: {{ record?.rewardTokenStartBlock }}
                </p>
                <p style="margin: 0">
                  lastRewardTokenBlock: {{ record?.lastRewardTokenBlock }}
                </p>
                <p style="margin: 0">
                  rewardTokenPerBlock: {{ record?.rewardTokenPerBlock }}
                </p>
                <p style="margin: 0">
                  userRewardTokenBalance: {{ record?.userRewardTokenBalance }}
                </p>
                <p style="margin: 0">
                  aLpContractRewardTokenBalance:
                  {{ record?.aLpContractRewardTokenBalance }}
                </p>
              </template>
            </Table>
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
    <div>MAX: {{ chooseItem.userLiquidity }}</div>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="withdraw"> Withdraw </Button>
  </Modal>
  <Modal
    :visible="borrowDepositVisible"
    title="Borrow"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="BorrowDepositModalHandleOk"
    @cancel="BorrowDepositModalHandleCancel"
  >
    <div>Borrow Token:</div>
    <RadioGroup v-model:value="borrowToken" @change="borrowTokenChange">
      <Radio
        v-for="item in borrowTokenData"
        :key="item.contract"
        :value="item.contract"
        >{{ item.assets }}</Radio
      >
    </RadioGroup>
    <div class="spaceSty" />
    <Input
      class="amountInput"
      placeholder="borrowDeposit amount"
      :value="BorrowDepositAmount"
      @change="BorrowDepositAmountChange"
    />
    <div>can borrow: {{ canBorrow }}</div>
    <div class="spaceSty" />
    <Space :size="16">
      <Button type="primary" size="large" @click="lendApprove">
        Approve
      </Button>
      <Button type="primary" size="large" @click="lendDeposit">
        Deposit
      </Button>
      <Button type="primary" size="large" @click="lendBorrow"> Borrow </Button>
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
import _ from "lodash";
import Liquidation from "@/views/components/Liquidation.vue";
import Lend from "@/views/components/Lend.vue";
import Settings from "@/views/components/Settings.vue";
import Records from "@/views/components/Records.vue";
import BigNumber from "bignumber.js";
import Erc20Abi from "@/utils/erc20.abi.json";
import ManageAbi from "@/utils/manageAbi.abi.json";
import FarmManagerInfoGetterAbi from "@/utils/FarmManagerInfoGetter_metadata.abi.json";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import AlphaReleaseRuleSelectorAbi from "@/utils/AlphaReleaseRuleSelector_metadata.json";
import FarmBase from "@/utils/farmBase.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const getGlobalContract = store.getters.getGlobalContract;
const manageContract = ref(getGlobalContract.manageContract);
const infoContract = ref(getGlobalContract.infoContract);
const oracleContract = ref(getGlobalContract.oracleContract);
const lendpoolContract = ref(getGlobalContract.lendpoolContract);
const LendingInfoGetterContract = ref(
  getGlobalContract.LendingInfoGetterContract
);
const farmPoolContract = ref(getGlobalContract.farmPoolContract);
const alphaReleaseRuleSelectorContract = ref(
  getGlobalContract.alphaReleaseRuleSelectorContract
);
const FarmManagerInfoGetterContract = ref(
  getGlobalContract.FarmManagerInfoGetterContract
);

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
    title: "Reward PerBlock",
    dataIndex: "APR",
  },
  {
    title: "Farm Token",
    keys: "farmToken",
    dataIndex: "farmToken",
  },
  {
    title: "Liquidity",
    keys: "liquidity",
    dataIndex: "liquidity",
  },
  {
    title: "My Liquidity",
    dataIndex: "userLiquidity",
  },
  {
    title: "WalletBalance",
    dataIndex: "WalletBalance",
  },
  {
    title: "My ALP balance",
    dataIndex: "userAlpBalance",
  },
  {
    title: "ALP TotalSupply",
    dataIndex: "alpTotalSupply",
  },
  {
    title: "Pending reward",
    dataIndex: "pendingReward",
  },
  {
    title: "Claim",
    keys: "claim",
    dataIndex: "claim",
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
    title: "Earn",
    keys: "earn",
    dataIndex: "earn",
  },
  {
    title: "ALPToken",
    keys: "aLPToken",
    dataIndex: "aLPToken",
  },
];

const address = ref<string>("");
const data = ref<any>([]);
const chooseItem = ref<any>({});
const depositVisible = ref<boolean>(false);
const withdrawVisible = ref<boolean>(false);
const borrowDepositVisible = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const relWeb3 = ref<any>("");
const showCoinBtn = ref<boolean>(false);
const amount = ref<string | number>("");
const withdrawAmount = ref<string | number>("");
const borrowToken = ref<string | number>("");
const borrowTokenAmount = ref<string | number>("");
const BorrowDepositAmount = ref<string | number>("");
const canBorrow = ref<string | number>("--");
const lpAmountTotal = ref<any>();
const lpTokenPrice = ref<any>();
const lendingPoolCollateralPercent = ref<any>();
const totalSupply = ref<any>();
const borrowTokenData = ref<any>([]);
const totalDepositInUsd = ref<any>("0");

const connectClick = () => {
  if (!Web3.givenProvider) {
    message.error("no_available_provider");
    return;
  }
  let RelWeb3 = new Web3(Web3.givenProvider);
  relWeb3.value = RelWeb3;
  relWeb3.value.eth
    .requestAccounts()
    .then(async (ress: any) => {
      address.value = ress[0];
      let response = await getContracts();
      let res = response.data.result;
      let contract: any = {};
      if (res.records) {
        res.records.map((item: any) => {
          contract[item.name] = item.address;
          switch (item.name) {
            case "manageContract":
              manageContract.value = item.address;
              break;
            case "lendpoolContract":
              lendpoolContract.value = item.address;
              break;
            case "LendingInfoGetterContract":
              LendingInfoGetterContract.value = item.address;
              break;
            case "oracleContract":
              oracleContract.value = item.address;
              break;
            case "infoContract":
              infoContract.value = item.address;
              break;
            case "farmPoolContract":
              farmPoolContract.value = item.address;
              break;
            case "alphaReleaseRuleSelectorContract":
              alphaReleaseRuleSelectorContract.value = item.address;
              break;
            case "FarmManagerInfoGetterContract":
              FarmManagerInfoGetterContract.value = item.address;
          }
        });
        await store.dispatch("setGlobalContractActions", contract);
        getBalanceOf(RelWeb3, address.value);
        showCoinBtn.value = true;
        //遍历生成所有lend币种数组
        getBorrowToken(response);
      }
      getBalanceOf(RelWeb3, address.value);
      showCoinBtn.value = true;
    })
    .catch((err: any) => {
      message.error(err.message);
    });
};

const getBorrowToken = async (lengthRes: any) => {
  let length = 0;
  let lengthResponse = lengthRes.data.result;
  lengthResponse?.records &&
    lengthResponse.records.map((item: any) => {
      if (item.name === "tokenListLength") {
        length = item.address;
      }
    });
  let dataArr = [];
  for (let i = 0; i < length; i++) {
    dataArr.push(i);
  }
  let deepData: any = [];
  dataArr.map((item, index) => {
    deepData.push({
      key: item,
      index: index,
      assets: "",
      assetPrice: "",
      contract: "",
    });
  });
  borrowTokenData.value = _.cloneDeep(deepData);
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract.value
  );
  let MockPriceOracleContract = new relWeb3.value.eth.Contract(
    MockPriceOracleAbi as any,
    oracleContract.value
  );
  for (let item of borrowTokenData.value) {
    let itemContract = await Contract.methods
      .tokenList(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.contract = itemContract;
    let Erc20Contract = new relWeb3.value.eth.Contract(
      Erc20Abi as any,
      itemContract
    );
    let name = await Erc20Contract.methods
      .name()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assets = name;
    let AssetPrice = await MockPriceOracleContract.methods
      .getAssetPrice(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assetPrice = AssetPrice;
  }
};

const farmOrLendOnChange = async (children: any) => {
  if (children === "4") {
    let Contract = new relWeb3.value.eth.Contract(
      AlphaReleaseRuleSelectorAbi as any,
      alphaReleaseRuleSelectorContract.value
    );
    await Contract.methods
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

const refresh = () => {
  getBalanceOf(relWeb3.value, address.value);
};

const getBalanceOf = async (relWeb3: Web3, address: string) => {
  let dataArr = [];
  let FarmManagerInfoGetContract = new relWeb3.eth.Contract(
    FarmManagerInfoGetterAbi as any,
    FarmManagerInfoGetterContract.value,
    {
      from: address,
    }
  );
  let getTotalInfo = await FarmManagerInfoGetContract.methods
    .getTotalInfo()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  totalDepositInUsd.value = getTotalInfo.totalDepositInUsd;
  let getPools = await FarmManagerInfoGetContract.methods
    .getPools()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  console.log("getPools", getPools);
  for (let i = 0; i < getPools.length; i++) {
    dataArr.push(i);
  }
  let deepData: any = [];
  dataArr.map((item: any, index) => {
    deepData.push({
      index: index,
      key: index,
      lpTokenName: getPools[index].symbol,
      share: "0%",
      depositBalance: "0",
      poolInfos: {},
      poolInfosValue: {},
      borrowToken: "",
      entranceFeeFactor: "",
      withdrawFeeFactor: "",
      withdrawTaxRate: "",
      rewardAddress: "",
      slippageFactor: "",
      lastEarnBlock: "",
      MaraAddress: "",
      FarmManagerInfoMaraBalance: "",
      FarmManagerMaraBalance: "",
      aLpBalance: "",
      aLpMaraBalance: "",
      rewardTokenStartBlock: "",
      lastRewardTokenBlock: "",
      rewardTokenPerBlock: "",
      userMaraBalance: "",
      rewardToken: getPools[index].rewardToken,
      userRewardTokenBalance: "",
      aLpContractRewardTokenBalance: "",
      maraPerAlp: "",
      userRewardDebts: "",
      farmToken:
        getPools[index].rewardToken ===
        "0x0000000000000000000000000000000000000000"
          ? getPools[index].symbol
          : getPools[index].rewardTokenSymbol,
      totalInUSD: "",
      APR: "",
      WalletBalance: "",
      userLiquidity: "",
      liquidity: "",
      rewardTokenSymbol: getPools[index].rewardTokenSymbol,
      token: getPools[index].token,
      farmAddress: getPools[index].farmAddress,
      aLPToken: getPools[index].aLPToken,
    });
  });
  data.value = _.cloneDeep(deepData);
  for (let item of data.value) {
    let getPoolInfo = await FarmManagerInfoGetContract.methods
      .getPoolInfo(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("getPoolInfo", getPoolInfo);
    item.APR = `${new BigNumber(getPoolInfo.maraPerBlock)
      .dividedBy(Math.pow(10, 18))
      .multipliedBy(new BigNumber(getPoolInfo.depositInUSD))
      .dividedBy(totalDepositInUsd.value)
      .toFixed(4)} MARA + ${new BigNumber(getPoolInfo.tokenPerBlock)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${item.rewardTokenSymbol}`;
    item.alpTotalSupply = new BigNumber(getPoolInfo.alpTotalSupply)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.liquidity = new BigNumber(getPoolInfo.liquidity)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    let getUserInfo = await FarmManagerInfoGetContract.methods
      .getUserInfo(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("getUserInfo", getUserInfo);
    item.WalletBalance = new BigNumber(getUserInfo.userWalletBalance)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.userAlpBalance = new BigNumber(getUserInfo.userAlpBalance)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.pendingReward = `${new BigNumber(getUserInfo.userPendingMara)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} MARA + ${new BigNumber(getUserInfo.userPendingReward)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${item.rewardTokenSymbol}`;
    item.userLiquidity = new BigNumber(getUserInfo.userLiquidity)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
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

const borrowTokenChange = (e: Event) => {
  let assetPrice = 0;
  borrowTokenData.value.map((item: any) => {
    if (item.contract === (e.target as HTMLInputElement).value) {
      assetPrice = item.assetPrice;
      borrowToken.value = item.contract;
    }
  });
  borrowTokenAmount.value = assetPrice;
  canBorrow.value = new BigNumber(BorrowDepositAmount.value)
    .multipliedBy(new BigNumber(lpAmountTotal.value))
    .dividedBy(new BigNumber(totalSupply.value))
    .multipliedBy(new BigNumber(lpTokenPrice.value))
    .multipliedBy(new BigNumber(lendingPoolCollateralPercent.value))
    .dividedBy(assetPrice)
    .toFixed(4);
};

const BorrowDepositAmountChange = (e: Event) => {
  BorrowDepositAmount.value = (e.target as HTMLInputElement).value;
  canBorrow.value = new BigNumber((e.target as HTMLInputElement).value)
    .multipliedBy(new BigNumber(lpAmountTotal.value))
    .dividedBy(new BigNumber(totalSupply.value))
    .multipliedBy(new BigNumber(lpTokenPrice.value))
    .multipliedBy(new BigNumber(lendingPoolCollateralPercent.value))
    .dividedBy(borrowTokenAmount.value)
    .toFixed(18);
};

const BorrowDepositModalHandleOk = () => {
  borrowDepositVisible.value = true;
};

const BorrowDepositModalHandleCancel = () => {
  borrowDepositVisible.value = false;
};

const claim = async (item: any) => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract.value
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  await Contract.methods.claim(item.index).send(
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
};

const approve = () => {
  let Contract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    chooseItem.value.token,
    {
      from: address.value,
    }
  );
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      manageContract.value,
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
    manageContract.value,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //deposit参数: 1.第0个币种,2.金额
  Contract.methods
    .deposit(
      chooseItem.value.index,
      new BigNumber(amount.value).multipliedBy(Math.pow(10, 18)).toFixed()
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

const earn = async (item: any) => {
  let Contract = new relWeb3.value.eth.Contract(
    FarmBase as any,
    item.farmAddress,
    {
      from: address.value,
    }
  );
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

const withdraw = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract.value,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //withdraw参数: 1.第0个币种,2.金额
  Contract.methods
    .withdraw(
      chooseItem.value.index,
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
        withdrawVisible.value = false;
        if (err) {
          message.error(JSON.stringify(err.message));
        } else {
          message.success(JSON.stringify(result));
        }
      }
    );
};

const lendApprove = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    chooseItem.value.token,
    {
      from: address.value,
    }
  );
  Contract.methods
    .approve(
      lendpoolContract.value,
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

const lendDeposit = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract.value,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //deposit参数: 1.第0个币种,2.金额
  Contract.methods
    .deposit(
      chooseItem.value.token,
      new BigNumber(BorrowDepositAmount.value)
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

const lendBorrow = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract.value,
    {
      from: address.value,
    }
  );
  let gasPrice = await relWeb3.value.eth.getGasPrice(); //获取当前gas价格
  //borrow参数: 1.第0个币种,2.金额
  Contract.methods
    .borrow(
      borrowToken.value,
      new BigNumber(canBorrow.value).multipliedBy(Math.pow(10, 18)).toFixed()
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
