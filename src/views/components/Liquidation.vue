<template>
  <div class="about">
    <Button type="primary" size="large" @click="refresh" class="refresh"
      >Refresh</Button
    >
    <Table :columns="columns" :data-source="data">
      <template #bodyCell="{ column, record }">
        <template v-if="column.keys === 'rate'">
          {{ new BigNumber(record.rate * 100).toFixed(4) }} %
        </template>
        <template
          v-if="
            column.keys === 'option' &&
            record.cannotLiquidation === false &&
            record.borrowBalance > 0
          "
        >
          <Button type="primary" size="large" @click="() => liquidate(record)"
            >Liquidate</Button
          >
        </template>
      </template>
    </Table>
  </div>
  <Modal
    :visible="liquidityVisible"
    title="Liquidity"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="liquidityHandleOk"
    @cancel="liquidityModalHandleCancel"
  >
    <p>address: {{ chooseItem?.address }}</p>
    <div class="spaceSty" />
    <p>{{ chooseItem?.coin }} contract: {{ chooseItem?.contract }}</p>
    <div class="spaceSty" />
    <p>
      liquidate:
      <RadioGroup v-model:value="liquidateSharesValue">
        <Radio value="0.1">10%</Radio>
        <Radio value="0.2">20%</Radio>
        <Radio value="0.3">30%</Radio>
        <Radio value="0.4">40%</Radio>
        <Radio value="0.5">50%</Radio>
        <Radio value="0.6">60%</Radio>
      </RadioGroup>
    </p>
    <p>liquidateShares: {{ liquidateSharesAmount }}</p>
    <p>
      liquidateAmount:{{
        new BigNumber(liquidateSharesValue)
          .multipliedBy(new BigNumber(chooseItem.borrowBalance))
          .toFixed(4)
      }}
    </p>
    <p>
      totalBorrowShares:
      {{
        new BigNumber(totalBorrowShares).dividedBy(Math.pow(10, 18)).toFixed(4)
      }}
    </p>
    <p>
      totalBorrows:
      {{ new BigNumber(totalBorrows).dividedBy(Math.pow(10, 18)).toFixed(4) }}
    </p>
    <div class="spaceSty" />
    <p>{{ canShareCoin }} contract: {{ canShareContract }}</p>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="Approve"> Approve </Button>
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="LiquidateConfirm">
      Liquidate
    </Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BigNumber from "bignumber.js";
import {
  Button,
  Table,
  message,
  Modal,
  RadioGroup,
  Radio,
} from "ant-design-vue";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import BNBTokenAbi from "@/utils/BNBToken_metadata.abi.json";
import DAITokenAbi from "@/utils/DaiToken_metadata.abi.json";
import {
  leadingpoolContract,
  bnbContract,
  daiContract,
  oracleContract,
  collateralPercent,
} from "@/utils/config";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();

const columns = [
  {
    title: "Address",
    dataIndex: "address",
  },
  {
    title: "Coin",
    dataIndex: "coin",
  },
  {
    title: "WalletBalance",
    dataIndex: "walletBalance",
  },
  {
    title: "LiquidityBalance",
    dataIndex: "liquidityBalance",
  },
  {
    title: "BorrowBalance",
    dataIndex: "borrowBalance",
  },
  {
    title: "Debt ratio",
    keys: "rate",
    dataIndex: "rate",
  },
  {
    title: "Operation",
    dataIndex: "option",
    keys: "option",
  },
];

const Data = [
  {
    address: "0xEc7e5638e1b876eD6F3210Ab8A138B9EE993CAcd",
    coin: "BNB",
    contract: bnbContract,
    abi: BNBTokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
  {
    address: "0xEc7e5638e1b876eD6F3210Ab8A138B9EE993CAcd",
    coin: "DAI",
    contract: daiContract,
    abi: DAITokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
  {
    address: "0x416627dA2AD387EEDCe2835B9450471dcb1A1f45",
    coin: "BNB",
    contract: bnbContract,
    abi: BNBTokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
  {
    address: "0x416627dA2AD387EEDCe2835B9450471dcb1A1f45",
    coin: "DAI",
    contract: daiContract,
    abi: DAITokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
  {
    address: "0xA2e18718000077758fd90636D84A89f76DDA2BBd",
    coin: "BNB",
    contract: bnbContract,
    abi: BNBTokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
  {
    address: "0xA2e18718000077758fd90636D84A89f76DDA2BBd",
    coin: "DAI",
    contract: daiContract,
    abi: DAITokenAbi,
    cannotLiquidation: true,
    liquidityBalance: "0",
    rate: "0",
  },
];
const data = ref<any>(Data);
const liquidityVisible = ref<boolean>(false);
const chooseItem = ref<any>({});
const canShareCoin = ref<string | number>("");
const canShareContract = ref<string | number>("");
const liquidateSharesValue = ref<string | number>("0.1");
const totalBorrowShares = ref<string | number>("");
const totalBorrows = ref<string | number>("");
const liquidateSharesAmount = ref<string | number>("");

onMounted(() => {
  refresh();
});

const refresh = async () => {
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract
  );
  for (let item of data.value) {
    let res = await Contract.methods
      .isAccountHealthy(item.address)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.cannotLiquidation = res;
    let response = await Contract.methods
      .getUserPoolData(item.address, item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.liquidityBalance = new BigNumber(response.compoundedLiquidityBalance)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    item.borrowBalance = new BigNumber(response.compoundedBorrowBalance)
      .dividedBy(Math.pow(10, 18))
      .toFixed(4);
    //获取钱包代币余额
    let balanceContract = new props.relWeb3.eth.Contract(
      item.abi as any,
      item.contract
    );
    let resBalance = await balanceContract.methods
      .balanceOf(item.address)
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

    //获取代币价格
    let MockPriceOracleContract = new props.relWeb3.eth.Contract(
      MockPriceOracleAbi as any,
      oracleContract
    );
    let AssetPrice = await MockPriceOracleContract.methods
      .getAssetPrice(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    // console.log("AssetPrice", AssetPrice);
    let lendingPoolContract = new props.relWeb3.eth.Contract(
      LendingPoolAbi as any,
      leadingpoolContract
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
    // console.log("balance", balance);
    let rate = new BigNumber(AssetPrice)
      .multipliedBy(item.borrowBalance)
      .dividedBy(
        new BigNumber(balance.totalLiquidityBalanceBase).multipliedBy(
          collateralPercent
        )
      )
      .toFixed(4);
    // console.log("rate", rate, balance.totalLiquidityBalanceBase);
    item.rate = rate;
  }
};

const liquidityHandleOk = () => {
  liquidityVisible.value = false;
};

const liquidityModalHandleCancel = () => {
  liquidityVisible.value = false;
};

const liquidate = async (item: any) => {
  liquidityVisible.value = true;
  chooseItem.value = item;
  data.value.map((children: any) => {
    if (
      children.address === item.address &&
      Number(children.liquidityBalance) > 0
    ) {
      canShareCoin.value = children.coin;
      canShareContract.value = children.contract;
    }
  });
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract
  );
  let pool = await lendingPoolContract.methods
    .getPool(item.contract)
    .call((err: any, result: any) => {
      if (!err) {
        return result;
      } else {
        return "--";
      }
    });
  totalBorrowShares.value = pool.totalBorrowShares;
  totalBorrows.value = pool.totalBorrows;
  liquidateSharesAmount.value = new BigNumber(liquidateSharesValue.value)
    .multipliedBy(new BigNumber(chooseItem.value.borrowBalance))
    .multipliedBy(
      new BigNumber(pool.totalBorrowShares).dividedBy(
        new BigNumber(pool.totalBorrows)
      )
    )
    .toFixed(4);
};
const Approve = async () => {
  let approveContract = new props.relWeb3.eth.Contract(
    chooseItem.value.abi as any,
    chooseItem.value.contract
  );
  approveContract.methods
    .approve(
      chooseItem.value.contract,
      new BigNumber(
        new BigNumber(liquidateSharesValue.value)
          .multipliedBy(new BigNumber(chooseItem.value.borrowBalance))
          .plus(1)
      )
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
const LiquidateConfirm = async () => {
  let lendingPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    leadingpoolContract
  );
  lendingPoolContract.methods
    .liquidate(
      chooseItem.value.address,
      chooseItem.value.contract,
      new BigNumber(liquidateSharesAmount.value).multipliedBy(Math.pow(10, 18)),
      canShareContract.value
    )
    .send({ from: props.address }, (err: any, result: any) => {
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};
</script>

<style lang="less" scoped>
.refresh {
  margin-bottom: 20px;
}
.spaceSty {
  margin-bottom: 20px;
}
</style>
