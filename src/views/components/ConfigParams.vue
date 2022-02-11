<template>
  <div>
    <Space :size="16">
      <Button type="primary" size="large" @click="refresh">Refresh</Button>
      <Button type="primary" size="large" @click="addContract"
        >Add Contract</Button
      >
    </Space>
  </div>
  <div class="spaceSty"></div>
  <Table
    :columns="contractColumns"
    :data-source="httpContractData"
    :pagination="pagination"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.keys === 'option'">
        <Space :size="16">
          <Button
            v-if="record.type === 'erc20'"
            type="primary"
            size="large"
            @click="() => mara(record)"
            >Mint</Button
          >
          <Button
            type="primary"
            size="large"
            @click="() => editContractOption(record)"
            >Edit</Button
          >
          <Popconfirm
            title="Are you sure delete this contract ?"
            ok-text="Ok"
            cancel-text="No"
            @confirm="
              () => {
                deleteContractOption(record);
              }
            "
          >
            <Button type="primary" size="large">Delete</Button>
          </Popconfirm>
        </Space>
      </template>
    </template>
  </Table>
  <Modal
    :visible="addOrEditVisible"
    :title="addOrEditTitle"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="addOrEditHandleOk"
    @cancel="addOrEditHandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="contract name"
      :disabled="Boolean(editContractId)"
      :value="contractName"
      :default-value="chooseItem.value?.name"
      @change="(e) => (contractName = e.target.value)"
    />
    <div class="spaceSty"></div>
    <Input
      class="amountInput"
      placeholder="contract type"
      :value="contractType"
      :default-value="chooseItem.value?.type"
      @change="(e) => (contractType = e.target.value)"
    />
    <div class="spaceSty"></div>
    <Input
      class="amountInput"
      placeholder="contract address"
      :value="contractAddress"
      :default-value="chooseItem.value?.address"
      @change="(e) => (contractAddress = e.target.value)"
    />
    <div class="spaceSty"></div>
    <Button type="primary" size="large" @click="AddOrEdit"> Confirm </Button>
  </Modal>
  <Modal
    :visible="MaraVisible"
    title="Mint"
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
import {
  Button,
  Table,
  message,
  Modal,
  Input,
  Space,
  Popconfirm,
} from "ant-design-vue";
import Erc20Abi from "@/utils/erc20.abi.json";
import {
  getContracts,
  addContracts,
  editContracts,
  deleteContracts,
} from "@/utils/api";
const MaraVisible = ref<boolean>(false);
const chooseItem = ref<any>({});
const maraAddress = ref<string | number>("");
const maraAmount = ref<string | number>("");
const httpContractData = ref([]);
const total = ref(0);
const addOrEditVisible = ref(false);
const addOrEditTitle = ref("Add");
const contractName = ref<string | number>("");
const contractType = ref<string | number>("");
const contractAddress = ref<string | number>("");
const editContractId = ref<string | number>("");

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();

// const {
//   Config,
//   manageContract,
//   infoContract,
//   farmPoolContract,
//   bnbContract,
//   daiContract,
//   busdContract,
//   alphaReleaseRuleSelectorContract,
//   oracleContract,
//   maraContract,
//   lendpoolconfigContract,
//   lendpoolinfoContract,
//   matokendeployerContract,
//   lendpoolContract,
// } = store.getters.getGlobalContract;

const pagination = {
  pageSize: 20,
};

const contractColumns = [
  {
    title: "Contract Name",
    dataIndex: "name",
    keys: "name",
  },
  {
    title: "Address",
    dataIndex: "address",
    keys: "address",
  },
  {
    title: "Option",
    dataIndex: "option",
    keys: "option",
  },
];

// const contractData = [
//   {
//     title: "config",
//     contract: Config,
//   },
//   {
//     title: "manageContract",
//     contract: manageContract,
//   },
//   {
//     title: "infoContract",
//     contract: infoContract,
//   },
//   {
//     title: "farmPoolContract",
//     contract: farmPoolContract,
//   },
//   {
//     title: "bnbContract",
//     contract: bnbContract,
//   },
//   {
//     title: "daiContract",
//     contract: daiContract,
//   },
//   {
//     title: "busdContract",
//     contract: busdContract,
//   },
//   {
//     title: "alphaReleaseRuleSelectorContract",
//     contract: alphaReleaseRuleSelectorContract,
//   },
//   {
//     title: "oracleContract",
//     contract: oracleContract,
//   },

//   {
//     title: "maraContract",
//     contract: maraContract,
//   },
//   {
//     title: "lendpoolconfigContract",
//     contract: lendpoolconfigContract,
//   },
//   {
//     title: "lendpoolinfoContract",
//     contract: lendpoolinfoContract,
//   },
//   {
//     title: "matokendeployerContract",
//     contract: matokendeployerContract,
//   },
//   {
//     title: "lendpoolContract",
//     contract: lendpoolContract,
//   },
// ];

onMounted(() => {
  refresh();
});

const refresh = () => {
  getContracts().then((response) => {
    const res = response.data.result;
    httpContractData.value = res.records || [];
    total.value = res.total;
  });
};

const addContract = () => {
  addOrEditVisible.value = true;
};

const AddOrEdit = () => {
  if (editContractId.value) {
    let params = {
      id: editContractId.value,
      type: contractType.value,
      address: contractAddress.value,
    };
    editContracts(params).then((response) => {
      let res = response.data;
      addOrEditHandleCancel();
      if (res.code === 0) {
        message.success(res.msg);
        refresh();
      } else {
        message.error(res.msg);
      }
    });
  } else {
    let params = {
      name: contractName.value,
      type: contractType.value,
      address: contractAddress.value,
    };
    addContracts(params).then((response) => {
      let res = response.data;
      addOrEditHandleCancel();
      if (res.code === 0) {
        message.success(res.msg);
        refresh();
      } else {
        message.error(res.msg);
      }
    });
  }
};

const addOrEditHandleOk = () => {
  addOrEditVisible.value = false;
  editContractId.value = "";
  chooseItem.value = {};
  contractName.value = "";
  contractType.value = "";
  contractAddress.value = "";
};

const addOrEditHandleCancel = () => {
  addOrEditVisible.value = false;
  editContractId.value = "";
  chooseItem.value = {};
  contractName.value = "";
  contractType.value = "";
  contractAddress.value = "";
};

const editContractOption = (item: any) => {
  chooseItem.value = item;
  contractName.value = item.name;
  contractType.value = item.type;
  contractAddress.value = item.address;
  editContractId.value = item.id;
  addOrEditVisible.value = true;
};

const deleteContractOption = (item: any) => {
  deleteContracts(item.id).then((response) => {
    let res = response.data;
    if (res.code === 0) {
      message.success(res.msg);
      refresh();
    } else {
      message.error(res.msg);
    }
  });
};

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
    chooseItem.value.address
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
