<template>
  <Table :columns="contractColumns" :data-source="contractData">
    <template #bodyCell="{ column, record }">
      <template v-if="column.keys === 'option'">
        <Button type="primary" size="large" @click="() => mara(record)"
          >Mara</Button
        >
      </template>
    </template>
  </Table>
  <Modal
    :visible="MaraVisible"
    title="Mara"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="MaraHandleOk"
    @cancel="MaraHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="address"
      :value="maraAddress"
      @change="(e) => (maraAddress = e.target.value)"
    />
    <div class="spaceSty"></div>
    <Input
      class="amountInput"
      placeholder="amount"
      :value="maraAmount"
      @change="(e) => (maraAmount = e.target.value)"
    />
    <div class="spaceSty"></div>
    <Button type="primary" size="large" @click="MaraConfirm"> Mara </Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import BigNumber from "bignumber.js";
import { Button, Table, message, Modal, Input } from "ant-design-vue";
const store = useStore();
import Erc20Abi from "@/utils/erc20.abi.json";
const MaraVisible = ref<boolean>(false);
const chooseItem = ref<any>({});
const maraAddress = ref<string | number>("");
const maraAmount = ref<string | number>("");

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();

const {
  Config,
  lpContract,
  manageContract,
  shareContract,
  pscContract,
  usdaContract,
  infoContract,
  farmPoolContract,
  bnbContract,
  daiContract,
  busdContract,
  alphaReleaseRuleSelectorContract,
  oracleContract,
  maraContract,
  lendpoolconfigContract,
  lendpoolinfoContract,
  matokendeployerContract,
  lendpoolContract,
} = store.getters.getGlobalContract;

const contractColumns = [
  {
    title: "Contract Title",
    dataIndex: "title",
    keys: "title",
  },
  {
    title: "Address",
    dataIndex: "contract",
    keys: "contract",
  },
  {
    title: "Option",
    dataIndex: "option",
    keys: "option",
  },
];

const contractData = [
  {
    title: "config",
    contract: Config,
  },
  {
    title: "lpContract",
    contract: lpContract,
  },
  {
    title: "manageContract",
    contract: manageContract,
  },
  {
    title: "shareContract",
    contract: shareContract,
  },
  {
    title: "pscContract",
    contract: pscContract,
  },
  {
    title: "usdaContract",
    contract: usdaContract,
  },
  {
    title: "infoContract",
    contract: infoContract,
  },
  {
    title: "farmPoolContract",
    contract: farmPoolContract,
  },
  {
    title: "bnbContract",
    contract: bnbContract,
  },
  {
    title: "daiContract",
    contract: daiContract,
  },
  {
    title: "busdContract",
    contract: busdContract,
  },
  {
    title: "alphaReleaseRuleSelectorContract",
    contract: alphaReleaseRuleSelectorContract,
  },
  {
    title: "oracleContract",
    contract: oracleContract,
  },

  {
    title: "maraContract",
    contract: maraContract,
  },
  {
    title: "lendpoolconfigContract",
    contract: lendpoolconfigContract,
  },
  {
    title: "lendpoolinfoContract",
    contract: lendpoolinfoContract,
  },
  {
    title: "matokendeployerContract",
    contract: matokendeployerContract,
  },
  {
    title: "lendpoolContract",
    contract: lendpoolContract,
  },
];

const mara = (item: any) => {
  chooseItem.value = item;
  MaraVisible.value = true;
};

const MaraHandleOk = () => {
  MaraVisible.value = false;
};

const MaraHandleCancel = () => {
  MaraVisible.value = false;
};

const MaraConfirm = async () => {
  let maraContract = new props.relWeb3.eth.Contract(
    Erc20Abi as any,
    chooseItem.value.contract
  );
  await maraContract.methods
    .mint(maraAddress.value, maraAmount.value)
    .send({ from: props.address }, (err: any, result: any) => {
      MaraVisible.value = false;
      if (err) {
        message.error(JSON.stringify(err.message));
      } else {
        message.success(JSON.stringify(result));
      }
    });
};
</script>
<style lang="less" scoped>
.spaceSty {
  height: 20px;
  width: 100%;
}
</style>
