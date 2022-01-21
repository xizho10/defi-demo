<template>
  <div class="searchSty">
    <Input
      class="inputSty"
      placeholder="pool address"
      :value="poolAddress"
      @change="(e:any) => (poolAddress = e.target.value)"
    />
    <Input
      class="inputSty"
      placeholder="user address"
      :value="userAddress"
      @change="(e:any) => (userAddress = e.target.value)"
    />
    <Select @change="selectChange" class="inputSty" placeholder="select">
      <Option value="poolinitialized">poolinitialized</Option>
      <Option value="PoolConfigUpdated">PoolConfigUpdated</Option>
      <Option value="poolpriceoracleupdated">poolpriceoracleupdated</Option>
      <Option value="poolinterestupdated">poolinterestupdated</Option>
      <Option value="deposit">deposit</Option>
      <Option value="withdraw">withdraw</Option>
      <Option value="borrow">borrow</Option>
      <Option value="repay">repay</Option>
      <Option value="liquidate">liquidate</Option>
      <Option value="ReserveWithdrawn">ReserveWithdrawn</Option>
      <Option value="ReservePercentUpdated">ReservePercentUpdated</Option>
    </Select>
    <Button type="primary" size="large" @click="refresh"> Search</Button>
  </div>
  <Table
    :columns="columns"
    rowKey="id"
    :data-source="lendingPoolsEventsData"
    :scroll="{ x: 1440 }"
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
      <template v-if="column.keys === 'contract_address'">
        <Tooltip>
          <template v-slot:title>{{ record.contract_address }} </template>
          <span
            >{{ record?.contract_address.substr(0, 3) }}...{{
              record?.contract_address.substr(
                record?.contract_address.length - 3,
                3
              )
            }}</span
          >
        </Tooltip>
      </template>
      <template v-if="column.keys === 'user'">
        <Tooltip>
          <template v-slot:title>{{ record.user }} </template>
          <span
            >{{ record?.user.substr(0, 3) }}...{{
              record?.user.substr(record?.user.length - 3, 3)
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
      <template v-if="column.keys === 'is_use_pool_as_collateral'">
        {{ JSON.stringify(record.is_use_pool_as_collateral) }}
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      {{ JSON.stringify(record.event_params) }}
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Table, Input, Select, Button, Tooltip } from "ant-design-vue";
import { getLendingPoolsEvents } from "@/utils/api";

const { Option } = Select;
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "block_number",
    dataIndex: "block_number",
  },
  {
    title: "pool",
    keys: "pool",
    dataIndex: "pool",
  },
  {
    title: "user",
    keys: "user",
    dataIndex: "user",
  },
  {
    title: "contract_address",
    keys: "contract_address",
    dataIndex: "contract_address",
  },
  {
    title: "event_method",
    dataIndex: "event_method",
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
const lendingPoolsEventsData = ref<any>([]);
const lendingPoolsEventsLoading = ref<boolean>(false);

const poolAddress = ref<any>("");
const userAddress = ref<any>("");
const methodType = ref<any>("");

onMounted(() => {
  refresh();
});

const refresh = () => {
  let params = {
    pool: poolAddress.value,
    user: userAddress.value,
    method: methodType.value,
  };
  lendingPoolsEventsLoading.value = true;
  getLendingPoolsEvents(params).then((res) => {
    lendingPoolsEventsLoading.value = false;
    if (res?.data?.result) {
      lendingPoolsEventsData.value = res?.data?.result?.records || [];
    }
  });
};

const selectChange = (item: string) => {
  methodType.value = item;
};
</script>
<style lang="less" scoped>
.searchSty {
  display: flex;
  flex-direction: row;
  margin-bottom: 80px;
  .inputSty {
    width: 300px;
    margin-right: 40px;
  }
}
</style>
