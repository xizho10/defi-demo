<template>
  <div class="about">
    <Tabs defaultActiveKey="1" @change="tabsChange">
      <TabPane tab="ConfigParams" key="1">
        <ConfigParams :relWeb3="relWeb3" :address="address" />
      </TabPane>
      <TabPane tab="Oracle" key="2">
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
      <TabPane tab="Farm" key="3">
        <div>
          <Input
            class="farmInput"
            placeholder="ERC20_lpToken"
            :value="farmAddLpToken"
            @change="(e:any) => (farmAddLpToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="bool_withUpdate"
            :value="farmAddBool"
            @change="(e:any) => (farmAddBool = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="address_farmAddress"
            :value="farmAddAddress"
            @change="(e:any) => (farmAddAddress = e.target.value)"
          />
          <Button type="primary" size="large" @click="addPool">
            Add Pool</Button
          >
        </div>
        <div class="spaceSty"></div>
        <div>
          <Input
            class="farmInput"
            placeholder="uint256 _pid"
            :value="farmIndex"
            @change="(e:any) => (farmIndex = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="PoolStatus _status"
            :value="farmStatus"
            @change="(e:any) => (farmStatus = e.target.value)"
          />
          <Button type="primary" size="large" @click="farmSetPoolStatus">
            setPoolStatus</Button
          >
        </div>
        <div class="spaceSty"></div>
        <Input
          class="farmInput"
          placeholder="uint256 _maraPerBlock"
          :value="maraPerBlock"
          @change="(e:any) => (maraPerBlock = e.target.value)"
        />
        <Button type="primary" size="large" @click="setMaraPerBlock">
          setMaraPerBlock
        </Button>
      </TabPane>
      <TabPane tab="Lend" key="4">
        <div>
          <Input
            class="farmInput"
            placeholder="ERC20_lpToken"
            :value="lendInitPoolToken"
            @change="(e:any) => (lendInitPoolToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="IPoolConfiguration_poolConfig"
            :value="lendInitPoolConfig"
            @change="(e:any) => (lendInitPoolConfig = e.target.value)"
          />
          <Button type="primary" size="large" @click="initPool">
            Add Pool
          </Button>
        </div>
        <div class="spaceSty"></div>
        <div>
          <Input
            class="farmInput"
            placeholder="address"
            :value="setPoolStatusToken"
            @change="(e:any) => (setPoolStatusToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="uint8"
            :value="setPoolStatusStatus"
            @change="(e:any) => (setPoolStatusStatus = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="boolean"
            :value="setPoolStatusBoolean"
            @change="(e:any) => (setPoolStatusBoolean = e.target.value)"
          />
          <Button type="primary" size="large" @click="setPoolStatus">
            setPoolStatus
          </Button>
        </div>
        <div class="spaceSty"></div>
        <div>
          <Input
            class="farmInput"
            placeholder="address"
            :value="setPriceOracleAddress"
            @change="(e:any) => (setPriceOracleAddress = e.target.value)"
          />
          <Button type="primary" size="large" @click="setPriceOracle">
            setPriceOracle
          </Button>
        </div>
        <div class="spaceSty"></div>
        <div>
          <Input
            class="farmInput"
            placeholder="ERC20_lpToken"
            :value="lendWithdrawReserveToken"
            @change="(e:any) => (lendWithdrawReserveToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="uint256 _amount"
            :value="lendWithdrawReserveAmount"
            @change="(e:any) => (lendWithdrawReserveAmount = e.target.value)"
          />
          <Button type="primary" size="large" @click="withdrawReserve">
            withdrawReserve
          </Button>
        </div>
        <div class="spaceSty"></div>
        <div>
          <Input
            class="farmInput"
            placeholder="maToken"
            :value="maToken"
            @change="(e:any) => (maToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="_rewardToken"
            :value="rewardToken"
            @change="(e:any) => (rewardToken = e.target.value)"
          />
          <Input
            class="farmInput"
            placeholder="_rewardMultiplier"
            :value="rewardMultiplier"
            @change="(e:any) => (rewardMultiplier = e.target.value)"
          />
          <Button type="primary" size="large" @click="setRewardToken">
            setRewardToken
          </Button>
        </div>
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
import { useStore } from "vuex";
import BigNumber from "bignumber.js";
import {
  Button,
  Table,
  message,
  Modal,
  Tabs,
  TabPane,
  Input,
} from "ant-design-vue";
import _ from "lodash";
import MockPriceOracleAbi from "@/utils/MockPriceOracle_metadata.abi.json";
import LendingPoolAbi from "@/utils/LendingPool_metadata.abi.json";
import MaTokenAbi from "@/utils/MaToken_metadata.abi.json";
import InfoAbi from "@/utils/info.abi.json";
import ConfigParams from "@/views/components/ConfigParams.vue";
import Erc20Abi from "@/utils/erc20.abi.json";
import { getContracts } from "@/utils/api";
const store = useStore();

const { infoContract, lendpoolContract, oracleContract } =
  store.getters.getGlobalContract;

const props = defineProps<{
  relWeb3: any;
  address: string;
}>();

const columns = [
  {
    title: "Asset",
    dataIndex: "assets",
    keys: "assets",
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

const data = ref<any>([]);
const Visible = ref<boolean>(false);
const assetPrice = ref<string | number>("");
const chooseItem = ref<any>({});

const farmAddLpToken = ref<any>("");
const farmAddBool = ref<any>("");
const farmAddAddress = ref<any>("");

const lendInitPoolToken = ref<any>("");
const lendInitPoolConfig = ref<any>("");

const lendWithdrawReserveToken = ref<any>("");
const lendWithdrawReserveAmount = ref<any>("");

const setPoolStatusToken = ref<any>("");
const setPoolStatusStatus = ref<any>("");
const setPoolStatusBoolean = ref<any>("");
const setPriceOracleAddress = ref<any>("");

const maraPerBlock = ref<any>("");

const farmIndex = ref<any>("");
const farmStatus = ref<any>("");

const maToken = ref<any>("");
const rewardToken = ref<any>("");
const rewardMultiplier = ref<any>("");

onMounted(() => {
  refresh();
});

const tabsChange = (item: any) => {
  if (item === "2") {
    refresh();
  }
};

const refresh = async () => {
  let length = 0;
  let lengthRes = await getContracts();
  let lengthResponse = lengthRes.data.result;
  lengthResponse?.records &&
    lengthResponse.records.map((item: any) => {
      if (item.name === "tokenListLength") {
        length = item.address;
      }
    });
  let dataArr = [];
  for (let i = 0; i < length; i++) {
    dataArr.push(i);
  }
  let deepData: any = [];
  dataArr.map((item, index) => {
    deepData.push({
      key: item,
      index: index,
      assets: "",
      assetPrice: "",
      contract: "",
    });
  });
  data.value = _.cloneDeep(deepData);
  let Contract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let MockPriceOracleContract = new props.relWeb3.eth.Contract(
    MockPriceOracleAbi as any,
    oracleContract
  );
  for (let item of data.value) {
    let itemContract = await Contract.methods
      .tokenList(item.index)
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.contract = itemContract;
    let Erc20Contract = new props.relWeb3.eth.Contract(
      Erc20Abi as any,
      itemContract
    );
    let name = await Erc20Contract.methods
      .name()
      .call((err: any, result: any) => {
        if (!err) {
          return result;
        } else {
          return "--";
        }
      });
    item.assets = name;
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
        gas: props.relWeb3.utils.toHex(3000000),
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

const addPool = async () => {
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  let InfoContract = new props.relWeb3.eth.Contract(
    InfoAbi as any,
    infoContract
  );
  await InfoContract.methods
    .add(farmAddLpToken.value, farmAddBool.value, farmAddAddress.value)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const setMaraPerBlock = async () => {
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  let InfoContract = new props.relWeb3.eth.Contract(
    InfoAbi as any,
    infoContract
  );
  await InfoContract.methods.setMaraPerBlock(maraPerBlock.value).send(
    {
      from: props.address,
      gasPrice: gasPrice,
      gas: props.relWeb3.utils.toHex(3000000),
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

const initPool = async () => {
  let lendPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendPoolContract.methods
    .initPool(lendInitPoolToken.value, lendInitPoolConfig.value)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const withdrawReserve = async () => {
  let lendPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendPoolContract.methods
    .withdrawReserve(
      lendWithdrawReserveToken.value,
      lendWithdrawReserveAmount.value
    )
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const setPoolStatus = async () => {
  let lendPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendPoolContract.methods
    .setPoolStatus(
      setPoolStatusToken.value,
      setPoolStatusStatus.value === "false" ? false : true,
      setPoolStatusBoolean.value
    )
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const farmSetPoolStatus = async () => {
  let InfoContract = new props.relWeb3.eth.Contract(
    InfoAbi as any,
    infoContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await InfoContract.methods
    .setPoolStatus(farmIndex.value, farmStatus.value)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const setPriceOracle = async () => {
  let lendPoolContract = new props.relWeb3.eth.Contract(
    LendingPoolAbi as any,
    lendpoolContract
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await lendPoolContract.methods
    .setPriceOracle(setPriceOracleAddress.value)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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

const setRewardToken = async () => {
  let maTokenContract = new props.relWeb3.eth.Contract(
    MaTokenAbi as any,
    maToken.value
  );
  let gasPrice = await props.relWeb3.eth.getGasPrice(); //获取当前gas价格
  await maTokenContract.methods
    .setRewardToken(rewardToken.value, rewardMultiplier.value)
    .send(
      {
        from: props.address,
        gasPrice: gasPrice,
        gas: props.relWeb3.utils.toHex(3000000),
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
.farmInput {
  width: 300px;
  margin-right: 20px;
  height: 46px;
}
.spaceSty {
  margin-bottom: 20px;
}
</style>
