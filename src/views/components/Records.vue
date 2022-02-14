<template>
  <Tabs defaultActiveKey="1" @change="tabsChange">
    <TabPane tab="Farm Deposit" key="1">
      <Table
        :columns="columns"
        :data-source="depositData"
        :scroll="{ x: '100%' }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.keys === 'address'">
            <Tooltip>
              <template v-slot:title>{{ record.address }} </template>
              <span
                >{{ record?.address.substr(0, 3) }}...{{
                  record?.address.substr(record?.address.length - 3, 3)
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'user_address'">
            <Tooltip>
              <template v-slot:title>{{ record.user_address }} </template>
              <span
                >{{ record?.user_address.substr(0, 3) }}...{{
                  record?.user_address.substr(
                    record?.user_address.length - 3,
                    3
                  )
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'tx_hash'">
            <Tooltip>
              <template v-slot:title>{{ record.tx_hash }} </template>
              <span
                >{{ record?.tx_hash.substr(0, 3) }}...{{
                  record?.tx_hash.substr(record?.tx_hash.length - 3, 3)
                }}</span
              >
            </Tooltip>
          </template>
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
          <template v-if="column.keys === 'address'">
            <Tooltip>
              <template v-slot:title>{{ record.address }} </template>
              <span
                >{{ record?.address.substr(0, 3) }}...{{
                  record?.address.substr(record?.address.length - 3, 3)
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'user_address'">
            <Tooltip>
              <template v-slot:title>{{ record.user_address }} </template>
              <span
                >{{ record?.user_address.substr(0, 3) }}...{{
                  record?.user_address.substr(
                    record?.user_address.length - 3,
                    3
                  )
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'tx_hash'">
            <Tooltip>
              <template v-slot:title>{{ record.tx_hash }} </template>
              <span
                >{{ record?.tx_hash.substr(0, 3) }}...{{
                  record?.tx_hash.substr(record?.tx_hash.length - 3, 3)
                }}</span
              >
            </Tooltip>
          </template>
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
          <template v-if="column.keys === 'borrowColumn'">
            <div v-for="item in record?.borrow" :key="item?.amount">
              <Space :size="16">
                <span>asset: {{ item.asset }}</span>
                <span>amount: {{ item.amount }}</span>
              </Space>
            </div>
          </template>
          <template v-if="column.keys === 'depositColumn'">
            <div v-for="item in record?.deposit" :key="item?.amount">
              <Space :size="16">
                <span>asset: {{ item.asset }}</span>
                <span>amount: {{ item.amount }}</span>
              </Space>
            </div>
          </template>
        </template>
      </Table>
    </TabPane>

    <TabPane tab="Lend Pools" key="4">
      <Table
        :columns="lendingPoolsColumns"
        :data-source="LendingPoolsData"
        :scroll="{ x: 1280 }"
        :loading="LendingPoolsLoading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.keys === 'pool'">
            <Tooltip>
              <template v-slot:title>{{ record.pool }} </template>
              <span
                >{{ record?.pool.substr(0, 3) }}...{{
                  record?.pool.substr(record?.pool.length - 3, 3)
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'al_token_address'">
            <Tooltip>
              <template v-slot:title>{{ record.al_token_address }} </template>
              <span
                >{{ record?.al_token_address.substr(0, 3) }}...{{
                  record?.al_token_address.substr(
                    record?.al_token_address.length - 3,
                    3
                  )
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'pool_config_address'">
            <Tooltip>
              <template v-slot:title
                >{{ record.pool_config_address }}
              </template>
              <span
                >{{ record?.pool_config_address.substr(0, 3) }}...{{
                  record?.pool_config_address.substr(
                    record?.pool_config_address.length - 3,
                    3
                  )
                }}</span
              >
            </Tooltip>
          </template>
          <template v-if="column.keys === 'create_time'">
            {{ dayjs(record.create_time).format("YYYY-MM-DD HH:mm:ss") }}
          </template>
        </template>
      </Table>
    </TabPane>
    <TabPane tab="Lend Users" key="5">
      <LendingUsers />
    </TabPane>
    <TabPane tab="Lend Events" key="6">
      <LendingEvents />
    </TabPane>
  </Tabs>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Table, Tabs, TabPane, Space, Tooltip } from "ant-design-vue";
import dayjs from "dayjs";

import {
  getDepositList,
  getWithdrawList,
  getLiquidationList,
  getLendingPools,
} from "@/utils/api";
import LendingEvents from "@/views/components/LendingEvents.vue";
import LendingUsers from "@/views/components/LendingUsers.vue";

const columns = [
  {
    title: "address",
    keys: "address",
    dataIndex: "address",
  },
  {
    title: "amount",
    dataIndex: "amount",
  },
  {
    title: "user_address",
    keys: "user_address",
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
    title: "tx_hash",
    keys: "tx_hash",
    dataIndex: "tx_hash",
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
  { title: "borrow", dataIndex: "borrowColumn", keys: "borrowColumn" },
  { title: "deposit", dataIndex: "depositColumn", keys: "depositColumn" },
];

const lendingPoolsColumns = [
  { title: "id", dataIndex: "id" },
  { title: "pool", dataIndex: "pool", keys: "pool" },
  { title: "status", dataIndex: "status", keys: "status" },
  {
    title: "al_token_address",
    dataIndex: "al_token_address",
    keys: "al_token_address",
  },
  {
    title: "pool_config_address",
    dataIndex: "pool_config_address",
    keys: "pool_config_address",
  },
  { title: "total_borrows", dataIndex: "total_borrows", keys: "total_borrows" },
  {
    title: "total_borrow_shares",
    dataIndex: "total_borrow_shares",
    keys: "total_borrow_shares",
  },
  {
    title: "total_liquidity",
    dataIndex: "total_liquidity",
    keys: "total_liquidity",
  },
  {
    title: "total_available_liquidity",
    dataIndex: "total_available_liquidity",
    keys: "total_available_liquidity",
  },
  {
    title: "last_update_timestamp",
    dataIndex: "last_update_timestamp",
    keys: "last_update_timestamp",
  },
  { title: "create_time", dataIndex: "create_time", keys: "create_time" },
];

const depositData = ref<any>([]);
const withdrawData = ref<any>([]);
const LiquidationData = ref<any>([]);
const LendingPoolsData = ref<any>([]);
const depositLoading = ref<boolean>(false);
const withdrawLoading = ref<boolean>(false);
const accountListLoading = ref<boolean>(false);

const LendingPoolsLoading = ref<boolean>(false);

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

const tabsChange = (item: any) => {
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
  } else if (item === "4") {
    LendingPoolsLoading.value = true;
    getLendingPools().then((res: any) => {
      LendingPoolsLoading.value = false;
      if (res?.data?.result?.records) {
        LendingPoolsData.value = res?.data?.result?.records;
      }
    });
  }
};
</script>
