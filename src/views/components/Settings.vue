<template>
  <div class="about">
    <Tabs defaultActiveKey="1" @change="tabsChange">
      <TabPane tab="ConfigParams" key="1">
        <Table :columns="contractColumns" :data-source="contractData"></Table>
      </TabPane>
      <TabPane tab="Config" key="2">
        <Table :columns="columns" :data-source="data">
          <template #bodyCell="{ column, record }">
            <template v-if="column.keys === 'option'">
              <Button
                type="primary"
                size="large"
                @click="() => setAssetPrice(record)"
                >setAssetPrice
              </Button>
            </template>
          </template>
        </Table>
      </TabPane>
    </Tabs>
  </div>
  <Modal
    :visible="Visible"
    title="SetAssetPrice"
    :footer="null"
    :bodyStyle="{ margin: 'center', textAlign: 'center' }"
    @ok="HandleOk"
    @cancel="HandleCancel"
  >
    <Input
      class="amountInput"
      placeholder="price"
      :value="assetPrice"
      @change="(e:any) => (assetPrice = e.target.value)"
    />
    <div class="spaceSty" />
    <Button type="primary" size="large" @click="Confirm"> Confirm </Button>
  </Modal>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import BigNumber from "bignumber.js";
import { Button, Table, message, Modal, Tabs, TabPane } from "ant-design-vue";
import {
  lpContract,
  manageContract,
  shareContract,
  pscContract,
  usdaContract,
  infoContract,
  leadingpoolFarmContract,
  leadingpoolContract,
  bnbContract,
  daiContract,
  busdContract,
  alphaReleaseRuleSelectorContract,
  oracleContract,
} from "@/utils/config";
import BNBTokenAbi from "@/utils/BNBToken_metadata.abi.json";
import DAITokenAbi from "@/utils/DaiToken_metadata.abi.json";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();

const columns = [
  {
    title: "Asset",
    dataIndex: "coin",
    keys: "coin",
  },
  {
    title: "Contract",
    dataIndex: "contract",
    keys: "contract",
  },
  {
    title: "AssetPrice",
    dataIndex: "assetPrice",
    keys: "assetPrice",
  },
  {
    title: "Operation",
    dataIndex: "option",
    keys: "option",
  },
];

const Data = [
  {
    coin: "BNB",
    contract: bnbContract,
    abi: BNBTokenAbi,
  },
  {
    coin: "DAI",
    contract: daiContract,
    abi: DAITokenAbi,
  },
];

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
];

const contractData = [
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
    title: "leadingpoolFarmContract",
    contract: leadingpoolFarmContract,
  },
  {
    title: "leadingpoolContract",
    contract: leadingpoolContract,
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
];

const data = ref<any>(Data);
const Visible = ref<boolean>(false);
const assetPrice = ref<string | number>("");
const chooseItem = ref<any>({});

onMounted(() => {
  refresh();
});

const tabsChange = (item: string) => {
  if (item === "2") {
    refresh();
  }
};

const refresh = async () => {
  data.value = Data;
  let MockPriceOracleContract = new props.relWeb3.eth.Contract(
    MockPriceOracleAbi as any,
    oracleContract
  );
  for (let item of data.value) {
    let AssetPrice = await MockPriceOracleContract.methods
      .getAssetPrice(item.contract)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assetPrice = new BigNumber(AssetPrice)
      .dividedBy(Math.pow(10, 18))
      .toFixed();
  }
};

const HandleOk = () => {
  Visible.value = false;
};

const HandleCancel = () => {
  Visible.value = false;
};

const setAssetPrice = (item: any) => {
  Visible.value = true;
  chooseItem.value = item;
};

const Confirm = async () => {
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  let MockPriceOracleContract = new props.relWeb3.eth.Contract(
    MockPriceOracleAbi as any,
    oracleContract
  );
  await MockPriceOracleContract.methods
    .setAssetPrice(
      chooseItem.value.contract,
      new BigNumber(assetPrice.value).multipliedBy(Math.pow(10, 18)).toFixed()
    )
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(900000),
      },
      (err: any, result: any) => {
        Visible.value = false;
        if (!err) {
          return result;
        } else {
          message.error(JSON.stringify(err.message));
          return "--";
        }
      }
    );
};
</script>

<style lang="less" scoped>
.refresh {
  margin-bottom: 20px;
}
.amountInput {
  width: 100%;
}
.spaceSty {
  margin-bottom: 20px;
}
</style>
