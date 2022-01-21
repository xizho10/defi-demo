<template>
  <Table
    :columns="columns"
    :data-source="lendingUsersData"
    :scroll="{ x: 1280 }"
    :loading="lendingUsersLoading"
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
      <template v-if="column.keys === 'is_use_pool_as_collateral'">
        {{ JSON.stringify(record.is_use_pool_as_collateral) }}
      </template>
    </template>
  </Table>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Table, Tooltip } from "ant-design-vue";
import { getLendingUsers } from "@/utils/api";

const columns = [
  {
    title: "id",
    dataIndex: "id",
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
    title: "is_use_pool_as_collateral",
    keys: "is_use_pool_as_collateral",
    dataIndex: "is_use_pool_as_collateral",
  },
  {
    title: "compounded_liquidity_balance",
    dataIndex: "compounded_liquidity_balance",
  },
  {
    title: "compounded_borrow_balance",
    dataIndex: "compounded_borrow_balance",
  },
  {
    title: "create_time",
    keys: "create_time",
    dataIndex: "create_time",
  },
];
const lendingUsersData = ref<any>([]);
const lendingUsersLoading = ref<boolean>(false);

onMounted(() => {
  refresh();
});

const refresh = () => {
  lendingUsersLoading.value = true;
  getLendingUsers().then((res) => {
    lendingUsersLoading.value = false;
    if (res?.data?.result) {
      lendingUsersData.value = res?.data?.result?.records || [];
    }
  });
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
