<template>
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
  <Button type="primary" size="large" @click="refresh" class="refresh"
    >Refresh</Button
  >
  <Table :columns="columns" :data-source="data" :scroll="{ x: 1440 }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.keys === 'userUsePoolAsCollateral'">
        <div>
          <Switch
            :checked="record.userUsePoolAsCollateral"
            @click="() => clickSwitch(record)"
          />
        </div>
      </template>
      <template v-if="column.keys === 'depositReward'">
        <div>
          {{
            new BigNumber(record?.depositReward)
              .dividedBy(Math.pow(10, 18))
              .toFixed()
          }}
        </div>
      </template>
      <template v-if="column.keys === 'borrowReward'">
        <div>
          {{
            new BigNumber(record?.borrowReward)
              .dividedBy(Math.pow(10, 18))
              .toFixed()
          }}
        </div>
      </template>
      <template v-if="column.keys === 'APR'">
        <div>
          {{
            new BigNumber(record?.APR).dividedBy(Math.pow(10, 16)).toFixed(2)
          }}%
        </div>
      </template>
      <template v-if="column.keys === 'depositAPR'">
        <div>
          {{ new BigNumber(record?.depositAPR).multipliedBy(100).toFixed(2) }}%
        </div>
      </template>
      <template v-if="column.keys === 'borrowAPR'">
        <div>
          {{ new BigNumber(record?.borrowAPR).multipliedBy(100).toFixed(2) }}%
        </div>
      </template>
      <template v-if="column.keys === 'claim'">
        <Button type="primary" size="large" @click="() => claim()">
          claim
        </Button>
      </template>
      <template v-if="column.keys === 'liquidityOperation'">
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
      <template
        v-if="
          column.keys === 'borrowOperation' && record.userUsePoolAsCollateral
        "
      >
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
      <p style="margin: 0">maToken: {{ record?.getPoolBalance?.maToken }}</p>
      <p style="margin: 0">rewardToken: {{ record?.rewardToken }}</p>
      <p style="margin: 0">
        userRewardTokenBalance:
        {{
          new BigNumber(record?.userRewardTokenBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <p style="margin: 0">
        maContractRewardTokenBalance:
        {{
          new BigNumber(record?.maContractRewardTokenBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <div class="spaceSty" />
      <p style="margin: 0">
        lendpoolInfoMaraBalance:
        {{
          new BigNumber(record?.lendpoolMaraBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <p style="margin: 0">
        lendpoolMaraBalance:
        {{
          new BigNumber(record?.lendpoolsMaraBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <p style="margin: 0">
        maTokenMaraBalance:
        {{
          new BigNumber(record?.maTokenMaraBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <p style="margin: 0">
        userMaraBalance:
        {{
          new BigNumber(record?.maraBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <div class="spaceSty" />
      <p style="margin: 0">
        multiplier:
        {{ record?.getPoolBalance?.multiplier }}
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
        totalTokenReward:
        {{
          new BigNumber(record?.getPoolBalance?.totalTokenReward)
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
        liquidityBalance:
        {{ record?.liquidityBalance }}
      </p>
      <p style="margin: 0">
        borrowBalance:
        {{ record?.borrowBalance }}
      </p>
      <p style="margin: 0">
        userUsePoolAsCollateral:
        {{ record?.userUsePoolAsCollateral }}
      </p>
      <p style="margin: 0">
        borrowShares:
        {{ record?.borrowShares }}
      </p>
      <p style="margin: 0">
        disableUseAsCollateral:
        {{ record?.disableUseAsCollateral }}
      </p>
      <p style="margin: 0">
        latestMultiplier:
        {{ record?.latestMultiplier }}
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
    <p>
      MAXBorrow:
      {{
        new BigNumber(totalCollateralBalanceBase)
          .dividedBy(chooseItem.assetPrice)
          .toFixed(4)
      }}
    </p>
    <p>Liquidity: {{ chooseItem.liquidityBalance }}</p>
    <p>
      Borrow Balance:
      {{
        new BigNumber(chooseItem.borrowBalance).multipliedBy(
          new BigNumber(LendBorrowAmount).toFixed()
        )
      }}
    </p>
    <p>
      Total Borrow Balance: 0 ~
      {{ new BigNumber(BorrowBalance).multipliedBy(0.75).toFixed() }} $
    </p>
    <p>Borrow Limit Reached: 75%</p>
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
    <div>MAX: {{ chooseItem.liquidityBalance }}</div>
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
    <div>
      MAX:
      {{
        new BigNumber(chooseItem.borrowShares)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </div>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendApproveRepay">
      approveRepay
    </Button>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="lendRepay"> Repay </Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import BigNumber from "bignumber.js";
import {
  Button,
  message,
  Space,
  Input,
  Table,
  Modal,
  Switch,
} from "ant-design-vue";
import _ from "lodash";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import BNBTokenAbi from "@/utils/BNBToken_metadata.abi.json";
import PoolConfigurationAbi from "@/utils/PoolConfiguration_metadata.abi.json";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";
import MaTokenMetadataAbi from "@/utils/MaToken_metadata.abi.json";
import Erc20Abi from "@/utils/erc20.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const { lendpoolContract, oracleContract, maraContract, lendpoolinfoContract } =
  store.getters.getGlobalContract;

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
    title: "DepositAPR",
    keys: "depositAPR",
    dataIndex: "depositAPR",
  },
  {
    title: "BorrowAPR",
    keys: "borrowAPR",
    dataIndex: "borrowAPR",
  },
  {
    title: "TotalLiquidity",
    keys: "totalLiquidity",
    dataIndex: "totalLiquidity",
  },
  {
    title: "Liquidity	",
    keys: "totalAvailableLiquidity",
    dataIndex: "totalAvailableLiquidity",
  },
  {
    title: "WalletBalance",
    dataIndex: "walletBalance",
  },
  {
    title: "MyLiquidity",
    keys: "liquidityBalance",
    dataIndex: "liquidityBalance",
  },
  {
    title: "DepositReward",
    keys: "depositReward",
    dataIndex: "depositReward",
  },
  {
    title: "BorrowReward",
    keys: "borrowReward",
    dataIndex: "borrowReward",
  },
  {
    title: "Claim",
    keys: "claim",
    dataIndex: "claim",
  },
  {
    title: "LiquidityOperation",
    keys: "liquidityOperation",
    dataIndex: "LiquidityOperation",
  },
  {
    title: "MyBorrow",
    keys: "borrowBalance",
    dataIndex: "borrowBalance",
  },
  {
    title: "Collateral",
    keys: "userUsePoolAsCollateral",
    dataIndex: "userUsePoolAsCollateral",
  },
  {
    title: "BorrowOperation",
    keys: "borrowOperation",
    dataIndex: "borrowOperation",
  },
];

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();
const data = ref<any>([]);
const LendApproveAmount = ref<string | number>("");
const LendDepositAmount = ref<string | number>("");
const LendBorrowAmount = ref<string | number>("0");
const depositVisible = ref<boolean>(false);
const modalTitle = ref<string | number>("deposit");
const borrowVisible = ref<boolean>(false);
const borrowModalTitle = ref<string | number>("borrow");
const totalCollateralBalanceBase = ref<string | number>("0");
const chooseItem = ref<any>({});
const withdrawVisible = ref<boolean>(false);
const withdrawModalTitle = ref<string | number>("withdraw");
const LendWithdrawAmount = ref<string | number>("");
const RepayVisible = ref<boolean>(false);
const RepayModalTitle = ref<string | number>("repay");
const LendRepayAmount = ref<string | number>("");
const BorrowBalance = ref<string | number>("0");

onMounted(() => {
  refresh();
});
const refresh = async () => {
  //获取用户借贷基本信息
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let userAccount = await lendingPoolContract.methods
    .getUserAccount(props.address)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  totalCollateralBalanceBase.value = userAccount.totalCollateralBalanceBase;
  //获取表格数据
  let length = 0;
  let lengthRes = await getContracts();
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
      index: index,
      key: item,
      assets: "",
      liquidityBalance: 0,
      APR: 0,
      depositAPR: 0,
      borrowAPR: 0,
      borrowBalance: "0",
      walletBalance: "0",
      optimalUtilizationRate: "0",
      totalLiquidity: "0",
      totalAvailableLiquidity: "0",
      totalBorrowInUSD: "",
      depoistReward: "0",
      borrowReward: "0",
      userUsePoolAsCollateral: false,
      contract: "", //token合约地址
      assetPrice: "", //token价格
      abi: Erc20Abi,
      borrowShares: "",
      disableUseAsCollateral: "",
      latestMultiplier: "",
      rewardToken: "",
      rewardTokenBalance: "",
    });
  });
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let allTotalBorrowInUSD = "0";
  for (let item of dataArr) {
    let itemContract = await Contract.methods
      .tokenList(item)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    let totalBorrowInUSD = await Contract.methods
      .totalBorrowInUSD(itemContract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    allTotalBorrowInUSD = new BigNumber(allTotalBorrowInUSD)
      .plus(totalBorrowInUSD)
      .toFixed();
  }
  console.log("allTotalBorrowInUSD", allTotalBorrowInUSD);
  data.value = _.cloneDeep(deepData);
  for (let item of data.value) {
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
    let totalBorrowInUSD = await Contract.methods
      .totalBorrowInUSD(itemContract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("totalBorrowInUSD", totalBorrowInUSD);
    item.totalBorrowInUSD = totalBorrowInUSD;
    let MockPriceOracleContract = new props.relWeb3.eth.Contract(
      MockPriceOracleAbi as any,
      oracleContract
    );
    let assetPrice = await MockPriceOracleContract.methods
      .getAssetPrice(itemContract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assetPrice = assetPrice;
    let Erc20Contract = new props.relWeb3.eth.Contract(
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
    item.key = name;
    let res = await Contract.methods
      .getUserPoolData(props.address, item.contract)
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

    let userpooldata = await Contract.methods
      .userPoolData(props.address, item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.borrowShares = userpooldata.borrowShares;
    item.disableUseAsCollateral = userpooldata.disableUseAsCollateral;
    item.latestMultiplier = userpooldata.latestMultiplier;
    let totalLiquidity = await Contract.methods
      .getTotalLiquidity(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.totalLiquidity = new BigNumber(totalLiquidity)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    let totalAvailableLiquidity = await Contract.methods
      .getTotalAvailableLiquidity(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.totalAvailableLiquidity = new BigNumber(totalAvailableLiquidity)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
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
    let MaraContract = new props.relWeb3.eth.Contract(
      Erc20Abi as any,
      maraContract
    );

    //获取lendingInfoPool mara余额
    let lendpoolInfoMaraBalance = await MaraContract.methods
      .balanceOf(lendpoolinfoContract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lendpoolMaraBalance = lendpoolInfoMaraBalance;

    //获取maToken mara余额
    let maTokenMaraBalance = await MaraContract.methods
      .balanceOf(resGetPoolBalance?.maToken)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.maTokenMaraBalance = maTokenMaraBalance;

    //获取lendingPool mara余额
    let lendpoolMaraBalance = await MaraContract.methods
      .balanceOf(lendpoolContract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lendpoolsMaraBalance = lendpoolMaraBalance;
    //获取mara余额
    let maraBalance = await MaraContract.methods
      .balanceOf(props.address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.maraBalance = maraBalance;
    //获取钱包代币余额
    let balanceContract = new props.relWeb3.eth.Contract(
      item.abi as any,
      item.contract
    );
    let resBalance = await balanceContract.methods
      .balanceOf(props.address)
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
    let aprTotalLiquidity = await Contract.methods
      .getTotalLiquidity(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    let poolConfigContract = new props.relWeb3.eth.Contract(
      PoolConfigurationAbi as any,
      resGetPoolBalance.poolConfig
    );
    let rate = await poolConfigContract.methods
      .calculateInterestRate(resGetPoolBalance.totalBorrows, aprTotalLiquidity)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    // let utilizationRate = await poolConfigContract.methods
    //   .getUtilizationRate(resGetPoolBalance.totalBorrows, aprTotalLiquidity)
    //   .call((err: any, result: any) => {
    //     if (!err) {
    //       return result;
    //     } else {
    //       return "--";
    //     }
    //   });
    item.APR = rate;
    // item.utilizationRate = utilizationRate;

    //获取deposit APR和 borrow APR
    let utilizationRate = await poolConfigContract.methods
      .getUtilizationRate(resGetPoolBalance.totalBorrows, aprTotalLiquidity)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    let optimal = await poolConfigContract.methods
      .getOptimalUtilizationRate()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    if (utilizationRate <= optimal) {
      let depositAPR =
        Number(optimal) === 0
          ? 0
          : new BigNumber(utilizationRate)
              .dividedBy(new BigNumber(optimal))
              .multipliedBy(0.5)
              .toFixed(4);
      let borrowAPR = new BigNumber(1).minus(depositAPR).toFixed(4);
      item.depositAPR = new BigNumber(depositAPR)
        .multipliedBy(item.totalBorrowInUSD)
        .dividedBy(allTotalBorrowInUSD)
        .toFixed(4);
      item.borrowAPR = new BigNumber(borrowAPR)
        .multipliedBy(item.totalBorrowInUSD)
        .dividedBy(allTotalBorrowInUSD)
        .toFixed(4);
    } else {
      let depositAPR =
        utilizationRate > Math.pow(10, 18)
          ? 0.5
          : new BigNumber(0.5).multipliedBy(
              new BigNumber(0.5)
                .multipliedBy(new BigNumber(Math.pow(10, 18)))
                .multipliedBy(
                  new BigNumber(utilizationRate)
                    .minus(new BigNumber(optimal))
                    .dividedBy(
                      new BigNumber(Math.pow(10, 18)).minus(
                        new BigNumber(optimal)
                      )
                    )
                )
            );
      let borrowAPR = new BigNumber(1).minus(depositAPR).toFixed(4);
      item.depositAPR = depositAPR;
      item.borrowAPR = borrowAPR;
    }
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
      .rateSlope1()
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
      .rateSlope2()
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
      .collateralPercent()
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
      .liquidationBonusPercent()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.liquidationBonusPercent = liquidationBonusPercent;
    //获取borrowReward
    let borrowReward = await Contract.methods
      .calculateReward(item.contract, props.address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.borrowReward = borrowReward;
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
    //获取matoken
    let matokenContract = new props.relWeb3.eth.Contract(
      MaTokenMetadataAbi as any,
      resGetPoolBalance.maToken
    );
    let matoken = await matokenContract.methods
      .calculateMaraReward(props.address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.depositReward = matoken;
    let rewardToken = await matokenContract.methods
      .rewardToken()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.rewardToken = rewardToken;
    if (rewardToken !== "0x0000000000000000000000000000000000000000") {
      let balanceContract = new props.relWeb3.eth.Contract(
        Erc20Abi as any,
        rewardToken
      );

      let resBalance = await balanceContract.methods
        .balanceOf(props.address)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.userRewardTokenBalance = resBalance;
      let maContractRewardTokenBalance = await balanceContract.methods
        .balanceOf(resGetPoolBalance?.maToken)
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.maContractRewardTokenBalance = maContractRewardTokenBalance;
    }
  }
  console.log("allTotalBorrowInUSD", allTotalBorrowInUSD);
};

const clickSwitch = async (item: any) => {
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendingPoolContract.methods
    .setUserUseAsCollateral(item.contract, !item.userUsePoolAsCollateral)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
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
  refresh();
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
const openBorrowModal = async (item: any) => {
  chooseItem.value = item;
  borrowVisible.value = true;
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let balance = await lendingPoolContract.methods
    .getUserAccount(props.address)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  let borrowBalance = new BigNumber(balance.totalLiquidityBalanceBase)
    .minus(new BigNumber(balance.totalBorrowBalanceBase).dividedBy(0.75))
    .dividedBy(new BigNumber(item.assetPrice))
    .toFixed(4);
  BorrowBalance.value = borrowBalance;
};

const borrowerModalHandleOk = () => {
  borrowVisible.value = false;
};

const borrowModalHandleCancel = () => {
  borrowVisible.value = false;
};

//claim
const claim = async () => {
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendingPoolContract.methods.claim(lendpoolContract).send(
    {
      from: props.address,
      gasPrice: gasPrice,
      gas: props.relWeb3.utils.toHex(900000),
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

//打开withdraw弹框
const openWithdrawModal = async (item: any) => {
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
  let Contract = new props.relWeb3.eth.Contract(
    chooseItem.value.abi as any,
    chooseItem.value.contract,
    {
      from: props.address,
    }
  );
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      lendpoolContract,
      new BigNumber(LendApproveAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed()
    )
    .send({ from: props.address }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const lendDeposit = async () => {
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract,
    {
      from: props.address,
    }
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
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
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
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
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract,
    {
      from: props.address,
    }
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
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
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
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
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract,
    {
      from: props.address,
    }
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
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
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
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
  let Contract = new props.relWeb3.eth.Contract(
    chooseItem.value.abi as any,
    chooseItem.value.contract,
    {
      from: props.address,
    }
  );
  //approve参数: 1.币种地址,2.金额
  Contract.methods
    .approve(
      lendpoolContract,
      new BigNumber(LendRepayAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed()
    )
    .send({ from: props.address }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};

const lendRepay = async () => {
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract,
    {
      from: props.address,
    }
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
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
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
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
</script>

<style lang="less" scoped>
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
.spaceSty {
  height: 20px;
  width: 100%;
}
.refresh {
  margin-bottom: 20px;
}
</style>
