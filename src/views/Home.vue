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
            <div>totalAllocPoint: {{ totalAllocPoint }}</div>
            <div>maraPerBlock: {{ maraPerBlock }}</div>
            <div>startBlock: {{ startBlock }}</div>
            <div>ownerRewardRate: {{ ownerRewardRate }}</div>

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
                    Borrow
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
                <div class="spaceSty" />
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
                  controllerFee: {{ record?.controllerFee }}
                </p>
                <p style="margin: 0">
                  rewardAddress: {{ record?.rewardAddress }}
                </p>
                <p style="margin: 0">buyBackRate: {{ record?.buyBackRate }}</p>
                <p style="margin: 0">
                  buyBackAddress: {{ record?.buyBackAddress }}
                </p>
                <p style="margin: 0">
                  slippageFactor: {{ record?.slippageFactor }}
                </p>
                <p style="margin: 0">
                  lastEarnBlock: {{ record?.lastEarnBlock }}
                </p>
                <p style="margin: 0">
                  lpAmountTotal: {{ record?.lpAmountTotal }}
                </p>
                <div class="spaceSty" />
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
                <p style="margin: 0">rewardToken: {{ record?.rewardToken }}</p>
                <p style="margin: 0">
                  userRewardTokenBalance: {{ record?.userRewardTokenBalance }}
                </p>
                <p style="margin: 0">
                  aLpContractRewardTokenBalance:
                  {{ record?.aLpContractRewardTokenBalance }}
                </p>
                <p style="margin: 0">
                  rewardMultiplier: {{ record?.rewardMultiplier }}
                </p>
                <p style="margin: 0">maraPerAlp: {{ record?.maraPerAlp }}</p>
                <p style="margin: 0">
                  userRewardDebts: {{ record?.userRewardDebts }}
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
import InfoAbi from "@/utils/info.abi.json";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";
import PoolConfigurationAbi from "@/utils/PoolConfiguration_metadata.abi.json";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import AlphaReleaseRuleSelectorAbi from "@/utils/AlphaReleaseRuleSelector_metadata.json";
import FarmBase from "@/utils/farmBase.abi.json";
import AlpAbi from "@/utils/alp.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const getGlobalContract = store.getters.getGlobalContract;
const manageContract = ref(getGlobalContract.manageContract);
const shareContract = ref(getGlobalContract.shareContract);
const pscContract = ref(getGlobalContract.pscContract);
const usdaContract = ref(getGlobalContract.usdaContract);
const infoContract = ref(getGlobalContract.infoContract);
const oracleContract = ref(getGlobalContract.oracleContract);
const lendpoolContract = ref(getGlobalContract.lendpoolContract);
const farmPoolContract = ref(getGlobalContract.farmPoolContract);
const alphaReleaseRuleSelectorContract = ref(
  getGlobalContract.alphaReleaseRuleSelectorContract
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

const address = ref<string>("");
const data = ref<any>([]);
const chooseItem = ref<any>({});
const depositVisible = ref<boolean>(false);
const withdrawVisible = ref<boolean>(false);
const borrowDepositVisible = ref<boolean>(false);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const relWeb3 = ref<any>("");
const showCoinBtn = ref<boolean>(false);
const totalAllocPoint = ref<string | number>("");
const maraPerBlock = ref<string | number>("");
const startBlock = ref<string | number>("");
const ownerRewardRate = ref<string | number>("");

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

const borrowToken = ref<string | number>("");
const borrowTokenAmount = ref<string | number>("");
const BorrowDepositAmount = ref<string | number>("");
const canBorrow = ref<string | number>("--");

const lpAmountTotal = ref<any>();
const lpTokenPrice = ref<any>();
const lendingPoolCollateralPercent = ref<any>();
const totalSupply = ref<any>();
const borrowTokenData = ref<any>([]);

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
            case "shareContract":
              shareContract.value = item.address;
              break;
            case "pscContract":
              pscContract.value = item.address;
              break;
            case "usdaContract":
              usdaContract.value = item.address;
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

//Lend fun
const farmOrLendOnChange = async (children: any) => {
  if (children === "1") {
    getBalanceOf(relWeb3.value, address.value);
  }
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

//Farm fun
const getBalanceOf = async (relWeb3: Web3, address: string) => {
  let dataArr = [];
  let poolContract = new relWeb3.eth.Contract(
    InfoAbi as any,
    infoContract.value
  );
  let length = await poolContract.methods
    .poolLength()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  for (let i = 0; i < length; i++) {
    dataArr.push(i);
  }
  let deepData: any = [];
  dataArr.map((item, index) => {
    deepData.push({
      index: index,
      key: index,
      lpTokenName: "",
      share: "0%",
      depositBalance: "0",
      poolInfos: {},
      borrowToken: "",
      entranceFeeFactor: "",
      withdrawFeeFactor: "",
      withdrawTaxRate: "",
      controllerFee: "",
      rewardAddress: "",
      buyBackRate: "",
      buyBackAddress: "",
      slippageFactor: "",
      lastEarnBlock: "",
      lpAmountTotal: "",
      MaraAddress: "",
      FarmManagerInfoMaraBalance: "",
      FarmManagerMaraBalance: "",
      aLpMaraBalance: "",
      userMaraBalance: "",
      rewardToken: "",
      userRewardTokenBalance: "",
      aLpContractRewardTokenBalance: "",
      rewardMultiplier: "",
      maraPerAlp: "",
      userRewardDebts: "",
    });
  });
  data.value = _.cloneDeep(deepData);

  let InfoContract = new relWeb3.eth.Contract(
    InfoAbi as any,
    infoContract.value
  );
  //获取totalAllocPoint
  let TotalAllocPoint = await InfoContract.methods
    .totalAllocPoint()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  totalAllocPoint.value = TotalAllocPoint;
  //获取maraPerBlock
  let MaraPerBlock = await InfoContract.methods
    .maraPerBlock()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  maraPerBlock.value = MaraPerBlock;
  //获取startBlock
  let StartBlock = await InfoContract.methods
    .startBlock()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  startBlock.value = StartBlock;
  //获取ownerRewardRate
  let OwnerRewardRate = await InfoContract.methods
    .ownerRewardRate()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  ownerRewardRate.value = OwnerRewardRate;
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
      .getPendingRewardToken(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.pendingReward = new BigNumber(pendingReward.maraAmount)
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
    item.borrowToken = poolInfos.lpToken;
    //获取币种name
    let itemContract = new relWeb3.eth.Contract(
      Erc20Abi as any,
      poolInfos.lpToken
    );
    let name = await itemContract.methods
      .name()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lpTokenName = name;
    //初始化farmBase合约
    let farmBaseContract = new relWeb3.eth.Contract(
      FarmBase as any,
      poolInfos.farmAddress
    );
    let EntranceFeeFactor = await farmBaseContract.methods
      .entranceFeeFactor()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.entranceFeeFactor =
      new BigNumber(10000 - EntranceFeeFactor).dividedBy(100).toFixed() + "%";
    let WithdrawFeeFactor = await farmBaseContract.methods
      .withdrawFeeFactor()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.withdrawFeeFactor =
      new BigNumber(10000 - WithdrawFeeFactor).dividedBy(100).toFixed() + "%";
    let WithdrawTaxRate = await farmBaseContract.methods
      .withdrawFeeFactor()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.withdrawTaxRate =
      new BigNumber(WithdrawTaxRate).dividedBy(100).toFixed() + "%";
    let ControllerFee = await farmBaseContract.methods
      .controllerFee()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.controllerFee =
      new BigNumber(ControllerFee).dividedBy(100).toFixed() + "%";
    let RewardAddress = await farmBaseContract.methods
      .rewardAddress()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.rewardAddress = RewardAddress;
    let BuyBackRate = await farmBaseContract.methods
      .buyBackRate()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.buyBackRate =
      new BigNumber(BuyBackRate).dividedBy(100).toFixed() + "%";
    let BuyBackAddress = await farmBaseContract.methods
      .buyBackAddress()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.buyBackAddress = BuyBackAddress;
    let SlippageFactor = await farmBaseContract.methods
      .slippageFactor()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.slippageFactor = SlippageFactor;
    let LastEarnBlock = await farmBaseContract.methods
      .lastEarnBlock()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lastEarnBlock = LastEarnBlock;
    let itemLpAmountTotal = await farmBaseContract.methods
      .lpAmountTotal()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lpAmountTotal = itemLpAmountTotal;
    //MaraAddress
    let MaraAddress = await InfoContract.methods
      .mara()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.MaraAddress = MaraAddress;
    let farmManagerContract = new relWeb3.eth.Contract(
      Erc20Abi as any,
      MaraAddress
    );
    let FarmManagerInfoMaraBalance = await farmManagerContract.methods
      .balanceOf(infoContract.value)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.FarmManagerInfoMaraBalance = FarmManagerInfoMaraBalance;
    let FarmManagerMaraBalance = await farmManagerContract.methods
      .balanceOf(manageContract.value)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.FarmManagerMaraBalance = FarmManagerMaraBalance;
    let aLpMaraBalance = await farmManagerContract.methods
      .balanceOf(poolInfos.aLPToken)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.aLpMaraBalance = aLpMaraBalance;
    let userMaraBalance = await farmManagerContract.methods
      .balanceOf(address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.userMaraBalance = userMaraBalance;
    let aLpContract = new relWeb3.eth.Contract(
      AlpAbi as any,
      poolInfos.aLPToken
    );
    let rewardToken = await aLpContract.methods
      .rewardToken()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.rewardToken = rewardToken;
    let alpErc20Contract = new relWeb3.eth.Contract(
      Erc20Abi as any,
      poolInfos.aLPToken
    );
    let userRewardTokenBalance = await alpErc20Contract.methods
      .balanceOf(address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.userRewardTokenBalance = userRewardTokenBalance;
    let aLpContractRewardTokenBalance = await alpErc20Contract.methods
      .balanceOf(poolInfos.aLPToken)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.aLpContractRewardTokenBalance = aLpContractRewardTokenBalance;
    let rewardMultiplier = await aLpContract.methods
      .rewardMultiplier()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    let multiplierMax = await aLpContract.methods
      .multiplierMax()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.rewardMultiplier = new BigNumber(rewardMultiplier)
      .dividedBy(multiplierMax)
      .toFixed();
    let maraPerAlp = await aLpContract.methods
      .maraPerAlp()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.maraPerAlp = maraPerAlp;
    let userRewardDebts = await aLpContract.methods
      .userRewardDebts(address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.userRewardDebts = userRewardDebts;
    //获取share
    let resShareBalance = await aLpContract.methods
      .balanceOf(address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    let shareTotal = await aLpContract.methods
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
  let FarmBaseContract = new relWeb3.value.eth.Contract(
    FarmBase as any,
    item.poolInfos.farmAddress,
    {
      from: address.value,
    }
  );
  let LpAmountTotal = await FarmBaseContract.methods
    .lpAmountTotal()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lpAmountTotal.value = LpAmountTotal;
  let LpTokenPrice = await FarmBaseContract.methods
    .getLpTokenPrice()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lpTokenPrice.value = LpTokenPrice;
  let lendingPoolContract = new relWeb3.value.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract.value
  );
  let resGetPoolBalance = await lendingPoolContract.methods
    .pools(item.poolInfos.lpToken)
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
  let collateralPercent = await poolConfigContract.methods
    .collateralPercent()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  lendingPoolCollateralPercent.value = collateralPercent;
  let alpContract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    shareContract.value
  );
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

const approve = () => {
  let Contract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    chooseItem.value.poolInfos.lpToken,
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

const earn = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    FarmBase as any,
    pscContract.value,
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

const liquidate = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    ManageAbi as any,
    manageContract.value,
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

const showTabPane = async (item: any) => {
  // if (item === "3") {
  //   //获取sharePool
  //   let ShareContract = new relWeb3.value.eth.Contract(
  //     Erc20Abi as any,
  //     shareContract.value
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
  //     infoContract.value,
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
      infoContract.value,
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

const lendApprove = async () => {
  let Contract = new relWeb3.value.eth.Contract(
    Erc20Abi as any,
    chooseItem.value.poolInfos.aLPToken,
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
      chooseItem.value.poolInfos.aLPToken,
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
