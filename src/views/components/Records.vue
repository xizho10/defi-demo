<template>
  <Tabs defaultActiveKey="1" @change="tabsChange">
    <TabPane tab="Farm Deposit" key="1">
      <Table
        :columns="columns"
        :data-source="depositData"
        :scroll="{ x: 1280 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.keys === 'create_time'">
            {{ dayjs(record.create_time).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </template>
      </Table>
    </TabPane>
    <TabPane tab="Farm Withdraw" key="2">
      <Table
        :columns="columns"
        :data-source="withdrawData"
        :scroll="{ x: 1280 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.keys === 'create_time'">
            {{ dayjs(record.create_time).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </template>
      </Table>
    </TabPane>
    <TabPane tab="Lend Accounts" key="3">
      <Table
        :columns="liquidationColumns"
        :data-source="LiquidationData"
        :scroll="{ x: 1280 }"
        :loading="accountListLoading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.keys === 'create_time'">
            {{ dayjs(record.create_time).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </template>
        <template #expandedRowRender="{ record }">
          <h2>borrow:</h2>
          <div v-for="item in record?.borrow" :key="item?.asset">
            <Space :size="16">
              <span>asset: {{ item.asset }}</span>
              <span>amount: {{ item.amount }}</span>
            </Space>
          </div>
          <h2>deposit:</h2>
          <div v-for="item in record?.deposit" :key="item?.asset">
            <Space :size="16">
              <span>asset: {{ item.asset }}</span>
              <span>amount: {{ item.amount }}</span>
            </Space>
          </div>
        </template>
      </Table>
    </TabPane>
  </Tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Table, Tabs, TabPane, Space } from "ant-design-vue";
import dayjs from "dayjs";
import {
  getDepositList,
  getWithdrawList,
  getLiquidationList,
} from "@/utils/api";

const columns = [
  {
    title: "tx_hash",
    dataIndex: "tx_hash",
  },
  {
    title: "address",
    dataIndex: "address",
  },
  {
    title: "amount",
    dataIndex: "amount",
  },
  {
    title: "user_address",
    dataIndex: "user_address",
  },
  {
    title: "lp_balance_before_transaction",
    dataIndex: "lp_balance_before_transaction",
  },
  {
    title: "lp_balance",
    dataIndex: "lp_balance",
  },
  {
    title: "pool_id",
    dataIndex: "pool_id",
  },
  {
    title: "alp_balance_before_transaction",
    dataIndex: "alp_balance_before_transaction",
  },
  {
    title: "alp_balance",
    dataIndex: "alp_balance",
  },
  {
    title: "create_time",
    keys: "create_time",
    dataIndex: "create_time",
  },
];

const liquidationColumns = [
  { title: "user", dataIndex: "user" },
  { title: "debt_ratio", dataIndex: "debt_ratio" },
];

const depositData = ref<any>([]);
const withdrawData = ref<any>([]);
const LiquidationData = ref<any>([]);
const depositLoading = ref<boolean>(false);
const withdrawLoading = ref<boolean>(false);
const accountListLoading = ref<boolean>(false);

onMounted(() => {
  refresh();
});

const refresh = () => {
  depositLoading.value = true;
  getDepositList().then((res) => {
    depositLoading.value = false;
    if (res?.data?.result) {
      depositData.value = res?.data?.result;
    }
  });
};

const tabsChange = (item: string) => {
  if (item === "1") {
    refresh();
  } else if (item === "2") {
    withdrawLoading.value = true;
    getWithdrawList().then((res) => {
      withdrawLoading.value = false;
      if (res?.data?.result) {
        withdrawData.value = res?.data?.result;
      }
    });
  } else if (item === "3") {
    accountListLoading.value = true;
    getLiquidationList().then((res: any) => {
      accountListLoading.value = false;
      if (res?.data?.result?.records) {
        LiquidationData.value = res?.data?.result?.records;
      }
    });
  }
};
</script>
