<template>
  <div class="currencyContainer">
    <div class="currencyBottom">
      <div>
        <h3>getTotalInfo:</h3>
        <div>
          maraPerBlock:{{
            new BigNumber(maraPerBlock).dividedBy(Math.pow(10, 18)).toFixed(4)
          }}
        </div>
        <div>
          totalBorrowInUSD:{{
            new BigNumber(totalBorrowInUSD)
              .dividedBy(Math.pow(10, 18))
              .toFixed(4)
          }}
        </div>
        <div>
          totalSupplyInUSD:{{
            new BigNumber(totalSupplyInUSD)
              .dividedBy(Math.pow(10, 18))
              .toFixed(4)
          }}
        </div>
      </div>
    </div>
  </div>
  <Space :size="10">
    <Button type="primary" size="large" @click="refresh" class="refresh"
      >Refresh</Button
    >
    <Button type="primary" size="large" @click="distributeMara" class="refresh"
      >DistributeMara</Button
    >
  </Space>
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
      <template v-if="column.keys === 'claim'">
        <Button type="primary" size="large" @click="() => claim(record)">
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
            v-if="
              record.ableBorrow === 'true' &&
              Number(record?.liquidityBalance) === 0
            "
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
    <template #expandedRowRender="{ record }" v-if="expandedRowRenderVisible">
      <p style="margin: 0">contractAddress: {{ record?.contract }}</p>
      <div class="spaceSty" />
      <h3>Ma Token:</h3>
      <p style="margin: 0">
        rewardToken: {{ record?.rewardToken }} {{ record?.rewardTokenName }}
      </p>
      <p style="margin: 0">lastRewardBlock: {{ record?.lastRewardBlock }}</p>
      <p style="margin: 0">startBlock: {{ record?.startBlock }}</p>
      <p style="margin: 0">
        tokensPerBlock:
        {{
          new BigNumber(record?.tokensPerBlock)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <p style="margin: 0">multiplier: {{ record?.multiplier }}</p>
      <p style="margin: 0">multiplierToken: {{ record?.multiplierToken }}</p>
      <div class="spaceSty" />
      <h3>Balance:</h3>
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
        maraBalance:
        {{
          new BigNumber(record?.maraBalance)
            .dividedBy(Math.pow(10, 18))
            .toFixed()
        }}
      </p>
      <div class="spaceSty" />
      <h3>Pool:</h3>
      <p style="margin: 0">
        status:
        {{ record?.getPoolBalance?.status }}
      </p>
      <p style="margin: 0">
        ableBorrow:
        {{ record?.getPoolBalance?.ableBorrow }}
      </p>
      <p style="margin: 0">
        maToken:
        {{ record?.getPoolBalance?.maToken }}
      </p>
      <p style="margin: 0">
        poolConfig:
        {{ record?.getPoolBalance?.poolConfig }}
      </p>
      <p style="margin: 0">
        totalBorrows:
        {{
          new BigNumber(record?.getPoolBalance?.totalBorrows)
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
        poolReserves:
        {{ record?.getPoolBalance?.poolReserves }}
      </p>
      <p style="margin: 0">
        lastUpdateTimestamp:
        {{ record?.getPoolBalance?.lastUpdateTimestamp }}
      </p>
      <p style="margin: 0">
        totalMaraReward:
        {{
          new BigNumber(record?.getPoolBalance?.totalMaraReward)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
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
        multiplier:
        {{ record?.getPoolBalance?.multiplier }}
      </p>
      <p style="margin: 0">
        multiplierToken:
        {{ record?.getPoolBalance?.multiplierToken }}
      </p>
      <div class="spaceSty" />
      <h3>getPools:</h3>
      <p style="margin: 0">
        status:
        {{ record?.getPoolValues?.status }}
      </p>
      <p style="margin: 0">
        ableBorrow:
        {{ record?.getPoolValues?.ableBorrow }}
      </p>
      <p style="margin: 0">
        maTokenAddress:
        {{ record?.getPoolValues?.maTokenAddress }}
      </p>
      <p style="margin: 0">
        poolConfigAddress:
        {{ record?.getPoolValues?.poolConfigAddress }}
      </p>
      <p style="margin: 0">
        totalBorrows:
        {{
          new BigNumber(record?.getPoolValues?.totalBorrows)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        totalBorrowShares:
        {{
          new BigNumber(record?.getPoolValues?.totalBorrowShares)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        totalLiquidity:
        {{
          new BigNumber(record?.getPoolValues?.totalLiquidity)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        totalAvailableLiquidity:
        {{
          new BigNumber(record?.getPoolValues?.totalAvailableLiquidity)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        lastUpdateTimestamp:
        {{ record?.getPoolValues.lastUpdateTimestamp }}
      </p>
      <div class="spaceSty" />
      <h3>getUserPoolData:</h3>
      <p style="margin: 0">
        compoundedLiquidityBalance:
        {{ record?.liquidityBalance }}
      </p>
      <p style="margin: 0">
        compoundedBorrowBalance:
        {{ record?.borrowBalance }}
      </p>
      <p style="margin: 0">
        userUsePoolAsCollateral:
        {{ record?.userUsePoolAsCollateral }}
      </p>
      <div class="spaceSty" />
      <h3>userPoolData:</h3>
      <p style="margin: 0">
        disableUseAsCollateral:
        {{ record?.disableUseAsCollateral }}
      </p>
      <p style="margin: 0">
        borrowShares:
        {{ record?.borrowShares }}
      </p>
      <p style="margin: 0">
        latestMultiplier:
        {{ record?.latestMultiplier }}
      </p>
      <p style="margin: 0">
        latestTokenMultiplier:
        {{ record?.latestTokenMultiplier }}
      </p>
      <div class="spaceSty" />
      <h3>Pool Config:</h3>
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
      <p style="margin: 0">
        optimalUtilizationRate:
        {{
          new BigNumber(record?.optimalUtilizationRate)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        excessUtilizationRate:
        {{
          new BigNumber(record?.excessUtilizationRate)
            .dividedBy(Math.pow(10, 18))
            .toFixed(4)
        }}
      </p>
      <p style="margin: 0">
        maxBorrowInUSD:
        {{
          new BigNumber(record?.maxBorrowInUSD)
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
      collateralPercent:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.collateralPercent)
          .dividedBy(Math.pow(10, 16))
          .toFixed()
      }}%
    </p>
    <p>
      compoundedBorrowBalance:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.compoundedBorrowBalance)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      liquidationPercent:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.liquidationPercent)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      MAXBorrow:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.maxCanBorrow)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      totalAvailableLiquidity:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.totalAvailableLiquidity)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      totalBorrowBalanceBase:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.totalBorrowBalanceBase)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      totalCollateralBalanceBase:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.totalCollateralBalanceBase)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
    <p>
      totalLiquidityBalanceBase:
      {{
        new BigNumber(chooseItem.getUserBorrowInfo?.totalLiquidityBalanceBase)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4)
      }}
    </p>
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
import LendingPoolInfoAbi from "@/utils/LendingPoolInfo_metadata.abi.json";
import LendingPoolInfoGetterAbi from "@/utils/LendingInfoGetter_metadata.abi.json";
import PoolConfigurationAbi from "@/utils/PoolConfiguration_metadata.abi.json";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";
import MaTokenMetadataAbi from "@/utils/MaToken_metadata.abi.json";
import Erc20Abi from "@/utils/erc20.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const {
  lendpoolContract,
  oracleContract,
  maraContract,
  lendpoolinfoContract,
  LendingInfoGetterContract,
} = store.getters.getGlobalContract;

const columns = [
  {
    title: "Assets",
    dataIndex: "assets",
  },
  {
    title: "WalletBalance",
    dataIndex: "walletBalance",
  },
  {
    title: "Active",
    keys: "active",
    dataIndex: "active",
  },
  {
    title: "AbleBorrow",
    dataIndex: "ableBorrow",
  },
  {
    title: "MaxBorrowInUSD",
    dataIndex: "maxBorrowInUSD",
  },
  {
    title: "BorrowInterestRate",
    dataIndex: "borrowInterestRate",
  },
  {
    title: "Reward PerBlock",
    dataIndex: "rewardPerBlock",
  },
  {
    title: "LendersGainPerBlock",
    keys: "lendersGainPerBlock",
    dataIndex: "lendersGainPerBlock",
  },
  {
    title: "BorrowersGainPerBlock",
    keys: "borrowersGainPerBlock",
    dataIndex: "borrowersGainPerBlock",
  },
  {
    title: "TotalLiquidity",
    keys: "totalLiquidity",
    dataIndex: "totalLiquidity",
  },
  {
    title: "totalAvailableLiquidity",
    keys: "totalAvailableLiquidity",
    dataIndex: "totalAvailableLiquidity",
  },
  {
    title: "TotalBorrows",
    dataIndex: "totalBorrows",
  },
  {
    title: "MyLiquidityBalance",
    keys: "compoundedLiquidityBalance",
    dataIndex: "compoundedLiquidityBalance",
  },
  {
    title: "PendingLendReward",
    keys: "pendingLendReward",
    dataIndex: "pendingLendReward",
  },
  {
    title: "PendingBorrowReward",
    keys: "pendingBorrowReward",
    dataIndex: "pendingBorrowReward",
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
    title: "MyBorrowBalance",
    keys: "compoundedBorrowBalance",
    dataIndex: "compoundedBorrowBalance",
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
  {
    title: "MaToken",
    dataIndex: "maToken",
  },
  {
    title: "PoolConfig",
    dataIndex: "poolConfig",
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
const totalLiquidityBalanceBase = ref<string | number>("0");
const totalCollateralBalanceBase = ref<string | number>("0");
const totalBorrowBalanceBase = ref<string | number>("0");
const mara = ref<string | number>("0");
const lastRewardBlock = ref<string | number>("0");
const startBlock = ref<string | number>("0");
const tokensPerBlock = ref<string | number>("0");
const chooseItem = ref<any>({});
const withdrawVisible = ref<boolean>(false);
const withdrawModalTitle = ref<string | number>("withdraw");
const LendWithdrawAmount = ref<string | number>("");
const RepayVisible = ref<boolean>(false);
const RepayModalTitle = ref<string | number>("repay");
const LendRepayAmount = ref<string | number>("");
const BorrowBalance = ref<string | number>("0");
const expandedRowRenderVisible = ref<boolean>(false);

const maraPerBlock = ref<string | number>("");
const totalBorrowInUSD = ref<string | number>("");
const totalSupplyInUSD = ref<string | number>("");

onMounted(() => {
  refresh();
});
const refresh = async () => {
  let LendInfoGetterContract = new props.relWeb3.eth.Contract(
    LendingPoolInfoGetterAbi as any,
    LendingInfoGetterContract,
    {
      from: props.address,
    }
  );
  let getTotalInfo = await LendInfoGetterContract.methods
    .getTotalInfo()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  console.log("getTotalInfo", getTotalInfo);
  maraPerBlock.value = getTotalInfo.maraPerBlock;
  totalBorrowInUSD.value = getTotalInfo.totalBorrowInUSD;
  totalSupplyInUSD.value = getTotalInfo.totalSupplyInUSD;
  let getPools = await LendInfoGetterContract.methods
    .getPools()
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  console.log("getPools", getPools);
  //获取表格数据
  let lengthRes = await getContracts();
  let lengthResponse = lengthRes.data.result;
  lengthResponse?.records &&
    lengthResponse.records.map((item: any) => {
      if (item.name === "contractDetail") {
        expandedRowRenderVisible.value = Boolean(Number(item.address));
      }
    });
  let dataArr = [];
  for (let i = 0; i < getPools.length; i++) {
    dataArr.push(i);
  }
  let deepData: any = [];
  dataArr.map((item, index) => {
    deepData.push({
      index: index,
      key: item,
      active: "",
      ableBorrow: "",
      assets: getPools[index].symbol,
      liquidityBalance: 0,
      borrowBalance: "0",
      optimalUtilizationRate: "0",
      excessUtilizationRate: "",
      maxBorrowInUSD: new BigNumber(getPools[index].maxBorrowInUSD)
        .dividedBy(Math.pow(10, 18))
        .toFixed(4),
      totalLiquidity: "0",
      totalAvailableLiquidity: "0",
      totalBorrowInUSD: "",
      userUsePoolAsCollateral: false,
      contract: getPools[index].token, //token合约地址
      walletBalance: new BigNumber(getPools[index].balance)
        .dividedBy(Math.pow(10, 18))
        .toFixed(4),
      getUserBorrowInfo: {},
      assetPrice: "", //token价格
      abi: Erc20Abi,
      borrowShares: "",
      disableUseAsCollateral: "",
      latestMultiplier: "",
      rewardToken: "",
      rewardTokenName: "",
      lastRewardBlock: "",
      startBlock: "",
      tokensPerBlock: "",
      multiplier: "",
      multiplierToken: "",
      rewardTokenBalance: "",
      getPoolValues: {},
      compoundedBorrowBalance: "0",
      compoundedLiquidityBalance: "0",
      pendingBorrowReward: "0",
      pendingLendReward: "0",
      maToken: getPools[index].maToken,
      poolConfig: getPools[index].poolConfig,
    });
  });
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  data.value = _.cloneDeep(deepData);
  for (let item of data.value) {
    //获取表格内容数据
    let getPoolInfo = await LendInfoGetterContract.methods
      .getPoolInfo(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("getPoolInfo", getPoolInfo);
    item.active = getPoolInfo.active.toString();
    item.ableBorrow = getPoolInfo.ableBorrow.toString();
    item.borrowInterestRate = `${new BigNumber(getPoolInfo.borrowInterestRate)
      .dividedBy(Math.pow(10, 16))
      .toFixed(4)}%`;
    item.rewardPerBlock = `${new BigNumber(getPoolInfo.maraPerBlock)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.maraSymbol} + ${new BigNumber(
      getPoolInfo.tokenPerBlock
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.rewardTokenSymbol}`;

    item.maraSymbol = getPoolInfo.maraSymbol;
    item.rewardTokenSymbol = getPoolInfo.rewardTokenSymbol;
    item.totalAvailableLiquidity = new BigNumber(
      getPoolInfo.totalAvailableLiquidity
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.totalBorrowShares = new BigNumber(getPoolInfo.totalBorrowShares)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.totalBorrows = new BigNumber(getPoolInfo.totalBorrows)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.totalLiquidity = new BigNumber(getPoolInfo.totalLiquidity)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    let getUserInfo = await LendInfoGetterContract.methods
      .getUserInfo(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("getUserInfo", getUserInfo);
    item.compoundedBorrowBalance = new BigNumber(
      getUserInfo.compoundedBorrowBalance
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.compoundedLiquidityBalance = new BigNumber(
      getUserInfo.compoundedLiquidityBalance
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.pendingBorrowReward = `${new BigNumber(getUserInfo.pendingMaraBorrow)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.maraSymbol}+${new BigNumber(
      getUserInfo.pendingRewardBorrow
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.rewardTokenSymbol}`;
    item.pendingLendReward = `${new BigNumber(getUserInfo.pendingMaraLend)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.maraSymbol}+${new BigNumber(
      getUserInfo.pendingRewardLend
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.rewardTokenSymbol}`;
    item.userUsePoolAsCollateral = getUserInfo.userUsePoolAsCollateral;
    let getPoolGain = await LendInfoGetterContract.methods
      .getPoolGain(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    console.log("getPoolGain", getPoolGain);
    item.lendersGainPerBlock = `${new BigNumber(
      getPoolGain.lendersGainMaraPerBlock
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.maraSymbol} + ${new BigNumber(
      getPoolGain.lendersGainTokenPerBlock
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.rewardTokenSymbol}`;
    item.borrowersGainPerBlock = `${new BigNumber(
      getPoolGain.borrowersGainMaraPerBlock
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.maraSymbol} + ${new BigNumber(
      getPoolGain.borrowersGainTokenPerBlock
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4)} ${getPoolInfo.rewardTokenSymbol}`;
    let totalBorrowInUSD = await Contract.methods
      .totalBorrowInUSD(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.totalBorrowInUSD = totalBorrowInUSD;
    //获取getUserBorrowInfo
    let lendingPoolInfoContract = new props.relWeb3.eth.Contract(
      LendingPoolInfoGetterAbi as any,
      LendingInfoGetterContract,
      {
        from: props.address,
      }
    );
    let getUserBorrowInfo = await lendingPoolInfoContract.methods
      .getUserBorrowInfo(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.getUserBorrowInfo = getUserBorrowInfo;
    let MockPriceOracleContract = new props.relWeb3.eth.Contract(
      MockPriceOracleAbi as any,
      oracleContract
    );
    let assetPrice = await MockPriceOracleContract.methods
      .getAssetPrice(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assetPrice = assetPrice;
    let getUserPoolDataValue = await Contract.methods
      .getUserPoolData(props.address, item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.liquidityBalance = new BigNumber(
      getUserPoolDataValue.compoundedLiquidityBalance
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.borrowBalance = new BigNumber(
      getUserPoolDataValue.compoundedBorrowBalance
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
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
    item.latestTokenMultiplier = userpooldata.latestTokenMultiplier;
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
    let getPoolValues = await Contract.methods
      .getPool(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.getPoolValues = getPoolValues;
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
    let poolConfigContract = new props.relWeb3.eth.Contract(
      PoolConfigurationAbi as any,
      resGetPoolBalance.poolConfig
    );
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
    //获取excessUtilizationRate
    let excessUtilizationRate = await poolConfigContract.methods
      .excessUtilizationRate()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.excessUtilizationRate = excessUtilizationRate;
    //获取MaxBorrowInUSD
    // let maxBorrowInUSD = await poolConfigContract.methods
    //   .maxBorrowInUSD()
    //   .call((err: any, result: any) => {
    //     if (!err) {
    //       return result;
    //     } else {
    //       return "--";
    //     }
    //   });
    // item.maxBorrowInUSD = maxBorrowInUSD;
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
    //获取depositReward
    let matokenContract = new props.relWeb3.eth.Contract(
      MaTokenMetadataAbi as any,
      resGetPoolBalance.maToken
    );
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
      let maContract = new props.relWeb3.eth.Contract(
        Erc20Abi as any,
        rewardToken
      );
      let name = await maContract.methods
        .name()
        .call((err: any, result: any) => {
          if (!err) {
            return result;
          } else {
            return "--";
          }
        });
      item.rewardTokenName = name;
    }
    let lastRewardBlock = await matokenContract.methods
      .lastRewardBlock()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.lastRewardBlock = lastRewardBlock;
    let startBlock = await matokenContract.methods
      .startBlock()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.startBlock = startBlock;
    let tokensPerBlock = await matokenContract.methods
      .tokensPerBlock()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.tokensPerBlock = tokensPerBlock;
    let multiplier = await matokenContract.methods
      .multiplier()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.multiplier = multiplier;
    let multiplierToken = await matokenContract.methods
      .multiplierToken()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.multiplierToken = multiplierToken;
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
};

const distributeMara = async () => {
  let LendingPoolInfoContract = new props.relWeb3.eth.Contract(
    LendingPoolInfoAbi as any,
    lendpoolinfoContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await LendingPoolInfoContract.methods.distributeMara().send(
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
  let lendingPoolInfoContract = new props.relWeb3.eth.Contract(
    LendingPoolInfoGetterAbi as any,
    LendingInfoGetterContract,
    {
      from: props.address,
    }
  );
  let getUserBorrowInfo = await lendingPoolInfoContract.methods
    .getUserBorrowInfo(chooseItem.value.contract)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
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
const claim = async (item: any) => {
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendingPoolContract.methods.claim(item.contract).send(
    {
      from: props.address,
      gasPrice: gasPrice,
      gas: props.relWeb3.utils.toHex(9000000),
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
      h3 {
        color: #fff;
      }
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
