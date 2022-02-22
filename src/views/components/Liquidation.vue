<template>
  <div class="about">
    <Button type="primary" size="large" @click="refresh" class="refresh"
      >Refresh</Button
    >
    <Table :columns="columns" :data-source="data" :scroll="{ x: 1440 }">
      <template #bodyCell="{ column, record }">
        <template v-if="column.keys === 'deposit'">
          <div v-for="item in record?.cloneUserTokenList" :key="item.symbol">
            <div v-if="item.status === '1' || item.status === '3'">
              {{ item.symbol }}
              {{ item.depositBal }}
            </div>
          </div>
        </template>
        <template v-if="column.keys === 'asset'">
          <div v-for="item in record?.cloneUserTokenList" :key="item.symbol">
            <div v-if="item.status === '2' || item.status === '3'">
              {{ item.symbol }}
              {{ item.borrowBal }}
            </div>
          </div>
        </template>
        <template v-if="column.keys === 'walletBalance'">
          <div v-for="item in record?.cloneUserTokenList" :key="item.symbol">
            {{ item.symbol }}
            {{ item.myBalance }}
          </div>
        </template>
        <template v-if="column.keys === 'debtRatio'">
          {{
            new BigNumber(record.debtRatio).dividedBy(Math.pow(10, 2)).toFixed()
          }}
          %
        </template>
        <template v-if="column.keys === 'option'">
          <Button type="primary" size="large" @click="() => liquidate(record)"
            >Liquidate</Button
          >
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <div v-for="item in record?.cloneUserTokenList" :key="item.symbol">
          <div v-if="item.status === '1' || item.status === '2'">
            <span style="margin: 0 10px">symbol: {{ item?.symbol }}</span>
            <span style="margin: 0 10px">status: {{ item?.status }} </span>
            <span style="margin: 0 10px"
              >borrowBal: {{ item?.borrowBal }}
            </span>
            <span style="margin: 0 10px"
              >borrowShares: {{ item?.borrowShares }}
            </span>
            <span style="margin: 0 10px"
              >depositBal: {{ item?.depositBal }}
            </span>
            <span style="margin: 0 10px"
              >maxPurchase: {{ item?.maxPurchase }}
            </span>
            <span style="margin: 0 10px"
              >maxPurchaseShares: {{ item?.maxPurchaseShares }}
            </span>
            <span style="margin: 0 10px"
              >myBalance: {{ item?.myBalance }}
            </span>
            <span style="margin: 0 10px"
              >totalBorrowShares: {{ item?.totalBorrowShares }}
            </span>
            <span style="margin: 0 10px"
              >totalBorrows: {{ item?.totalBorrows }}
            </span>
          </div>
        </div>
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
    <div class="spaceSty" />
    <p>
      liquidate pools:
      <RadioGroup v-model:value="borrowContract" @change="liquidatePoolsChange">
        <Radio
          :value="item.token"
          :key="item.token"
          v-for="item in chooseItem.borrowCloneUserTokenList"
          >{{ item.symbol }}: {{ item.token }}</Radio
        >
      </RadioGroup>
    </p>
    <div class="borrowAmountContainer">
      <Input
        class="amountInput"
        placeholder="borrowAmount"
        :value="borrowAmount"
        @change="(e:any) => (borrowAmount = e.target.value)"
      />
      <p>
        maxPurchase:
        {{ maxPurchase }}
      </p>
    </div>
    <p>borrowShares: {{ borrowShares }}</p>
    <p>
      totalBorrowShares:
      {{ totalBorrowShares }}
    </p>
    <p>
      totalBorrows:
      {{ totalBorrows }}
    </p>
    <p>
      <RadioGroup v-model:value="depositContract">
        <Radio
          :value="item.token"
          :key="item.token"
          v-for="item in chooseItem.depositCloneUserTokenList"
          >{{ item.symbol }}: {{ item.token }}</Radio
        >
      </RadioGroup>
    </p>
    <div class="spaceSty" />
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
import { useStore } from "vuex";
import BigNumber from "bignumber.js";
import {
  Button,
  Table,
  message,
  Modal,
  RadioGroup,
  Radio,
  Input,
} from "ant-design-vue";
import _ from "lodash";
import LendingInfoGetterAbi from "@/utils/LendingInfoGetter_metadata.abi.json";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import DAITokenAbi from "@/utils/DaiToken_metadata.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const { LendingInfoGetterContract, lendpoolContract } =
  store.getters.getGlobalContract;

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
    title: "Deposit",
    keys: "deposit",
    dataIndex: "deposit",
  },
  {
    title: "Borrow",
    keys: "asset",
    dataIndex: "asset",
  },
  {
    title: "WalletBalance",
    keys: "walletBalance",
    dataIndex: "walletBalance",
  },
  {
    title: "TotalBorrowBalanceBase",
    keys: "totalBorrowBalanceBase",
    dataIndex: "totalBorrowBalanceBase",
  },
  {
    title: "TotalCollateralBalanceBase",
    keys: "totalCollateralBalanceBase",
    dataIndex: "totalCollateralBalanceBase",
  },
  {
    title: "Debt ratio",
    keys: "debtRatio",
    dataIndex: "debtRatio",
  },
  {
    title: "Operation",
    dataIndex: "option",
    keys: "option",
  },
];

const data = ref<any>([]);
const liquidityVisible = ref<boolean>(false);
const chooseItem = ref<any>({});
const canShareasset = ref<string | number>("");
const canShareContract = ref<string | number>("");
const borrowContract = ref<string | number>("");
const depositContract = ref<string | number>("");
const totalBorrowShares = ref<string | number>("");
const totalBorrows = ref<string | number>("");
const borrowShares = ref<string | number>("");
const borrowAmount = ref<string | any | number>("");
const maxPurchase = ref<string | number>("");

onMounted(() => {
  refresh();
});

const refresh = async () => {
  let lengthRes = await getContracts();
  let lengthResponse = lengthRes.data.result;
  let addressArr: any = [];
  lengthResponse?.records &&
    lengthResponse.records.map((item: any) => {
      if (item.name === "LiquidationAddress") {
        addressArr = item.address.split(",");
      }
    });
  let Contract = new props.relWeb3.eth.Contract(
    LendingInfoGetterAbi as any,
    LendingInfoGetterContract,
    {
      from: props.address,
    }
  );
  let deepData: any = [];
  addressArr.map((item: any, index: number) => {
    deepData.push({
      key: index,
      index: index,
      address: item,
      asset: "",
      contract: "",
      abi: DAITokenAbi,
      isAccountHealthy: true,
      debtRatio: "0",
      totalBorrowBalanceBase: "",
      totalCollateralBalanceBase: "",
      totalLiquidityBalanceBase: "",
      collateralPercent: "",
      compoundedBorrowBalance: "",
      liquidationPercent: "",
      maxCanBorrow: "",
      totalAvailableLiquidity: "",
      userTokenList: [],
      cloneUserTokenList: [],
    });
  });

  data.value = _.cloneDeep(deepData);
  for (let item of data.value) {
    let getSortAccountHealthy = await Contract.methods
      .getSortAccountHealthy([item.address])
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.debtRatio = getSortAccountHealthy.accountHealthy[0].debtRatio;
    item.isAccountHealthy =
      getSortAccountHealthy.accountHealthy[0].isAccountHealthy;
    item.totalBorrowBalanceBase = new BigNumber(
      getSortAccountHealthy.accountHealthy[0].totalBorrowBalanceBase
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed();
    item.totalCollateralBalanceBase = new BigNumber(
      getSortAccountHealthy.accountHealthy[0].totalCollateralBalanceBase
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed();
    item.totalLiquidityBalanceBase = new BigNumber(
      getSortAccountHealthy.accountHealthy[0].totalLiquidityBalanceBase
    )
      .dividedBy(Math.pow(10, 18))
      .toFixed();
    console.log("getSortAccountHealthy", getSortAccountHealthy);
    let getLiquidationInfo = await Contract.methods
      .getLiquidationInfo([item.address])
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.userTokenList = getLiquidationInfo[0]?.userTokenList;
    let cloneUserTokenList: any = [];
    getLiquidationInfo[0]?.userTokenList.map((item: any, index: number) => {
      cloneUserTokenList[index] = {
        borrowBal: new BigNumber(item.borrowBal)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        borrowShares: new BigNumber(item.borrowShares)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        depositBal: new BigNumber(item.depositBal)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        maxPurchase: new BigNumber(item.maxPurchase)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        maxPurchaseShares: new BigNumber(item.maxPurchaseShares)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        myBalance: new BigNumber(item.myBalance)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        status: item.status,
        symbol: item.symbol,
        token: item.token,
        totalBorrowShares: new BigNumber(item.totalBorrowShares)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
        totalBorrows: new BigNumber(item.totalBorrows)
          .dividedBy(Math.pow(10, 18))
          .toFixed(4),
      };
    });
    item.cloneUserTokenList = cloneUserTokenList;
    let borrowCloneUserTokenList: any = [];
    let depositCloneUserTokenList: any = [];
    cloneUserTokenList.map((item: any) => {
      if (item.status === "2") {
        borrowCloneUserTokenList.push(item);
      }
      if (item.status === "1") {
        depositCloneUserTokenList.push(item);
      }
      if (item.status === "3") {
        borrowCloneUserTokenList.push(item);
        depositCloneUserTokenList.push(item);
      }
    });
    item.borrowCloneUserTokenList = borrowCloneUserTokenList;
    item.depositCloneUserTokenList = depositCloneUserTokenList;
  }
};

const liquidatePoolsChange = (e: any) => {
  chooseItem.value.cloneUserTokenList.map((item: any, index: number) => {
    if (item.token === e.target.value) {
      borrowShares.value =
        chooseItem.value.cloneUserTokenList[index].borrowShares;
      totalBorrowShares.value =
        chooseItem.value.cloneUserTokenList[index].totalBorrowShares;
      totalBorrows.value =
        chooseItem.value.cloneUserTokenList[index].totalBorrows;
      maxPurchase.value =
        chooseItem.value.cloneUserTokenList[index].maxPurchase;
    }
  });
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
};
const Approve = async () => {
  let approveContract = new props.relWeb3.eth.Contract(
    chooseItem.value.abi as any,
    borrowContract.value
  );
  approveContract.methods
    .approve(
      depositContract.value,
      new BigNumber(borrowAmount.value).multipliedBy(Math.pow(10, 18)).toFixed()
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
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice();
  lendingPoolContract.methods
    .liquidate(
      chooseItem.value.address,
      borrowContract.value,
      new BigNumber(borrowAmount.value)
        .multipliedBy(Math.pow(10, 18))
        .toFixed(),
      depositContract.value
    )
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(902487),
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
</script>

<style lang="less" scoped>
.refresh {
  margin-bottom: 20px;
}
.spaceSty {
  margin-bottom: 20px;
}
.borrowAmountContainer {
  display: flex;
  flex-direction: row;
}
</style>
