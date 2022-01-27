import { createStore } from "vuex";
export default createStore({
  state: {
    contract: {
      Config: "0x23FCC55a51a0Bf4D0CA21FA1FF2C29CD710D17E7",
      BUSDDAILpContract: "0x127cc9F695A3bF4a4FFa9A39d72a5b8F504ECaef",
      USDTDAILpContract: "0xcF10DCa65c0Fe989b5Fc859e7E148d4CF4569262",
      manageContract: "0x826B3f3e80b1Fd512712614e8f6B69C4d3Dd7089",
      shareContract: "0x261F6Df6688f2dE62Fee50D90d4975FcBC304200",
      pscContract: "0xc2Ee0bCacFBDF0cD3e6Dd173FEE6140f67aD9388",
      usdaContract: "0xE6af65173411C5D507D9c851B7348741fe82F302",
      infoContract: "0xdCbE91C2D5aA423a390D589893d227Da77Ab289e",
      farmPoolContract: "0x30E603b4Dd44Cffeb4E7069398b6A388a60a4B7C",
      bnbContract: "0x5917544742c7CB43EDac6d78aE0a633BF044e23c",
      daiContract: "0x451ddD00e28A9631f24505033F1CC07dE89A0C3A",
      busdContract: "0x31153B9A97DFaB4975053563A6EfD0D4c4cdAD99",
      alphaReleaseRuleSelectorContract:
        "0x261917AA9Fccd664b3fAaC37082f2CDd2cbF6a1B",
      oracleContract: "0x6bB220ddEA596884651abff2c1c0b7215a65c430",
      maraContract: "0x457D50587B5C4ac6Aea2cD31f42F7A54FFB4b25F",
      lendpoolconfigContract: "0xC0409716cF1bFbaffedf8Ab531Ef0AA5EcEba31a",
      lendpoolinfoContract: "0xFcAC356826c5573858CE57A056F7B28D5cA27cf6",
      matokendeployerContract: "0x0Cf998cd41C07c62D269cB1c673Eb947159c5Fa7",
      lendpoolContract: "0x00d57505AAB580C4c4ee55B1d47D719618aC390A",
    },
  },
  getters: {
    getGlobalContract: (state) => state.contract,
  },
  mutations: {
    setGlobalContract(state, value) {
      state.contract = value;
    },
  },
  actions: {
    async setGlobalContractActions({ commit }, params) {
      commit("setGlobalContract", params);
    },
  },
  modules: {},
});
