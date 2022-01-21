import { createStore } from "vuex";
export default createStore({
  state: {
    contract: {
      Config: "0x23FCC55a51a0Bf4D0CA21FA1FF2C29CD710D17E7",
      lpContract: "0x1E5Ee8FDBED23F70CB7f6Dd658318E391271d467",
      manageContract: "0x7e53F7fCD0099AE9A0010FF2a7F7a211E8eAeA91",
      shareContract: "0x433b1e6cc81531142d5DB368c4788A189A7E6727",
      pscContract: "0xc8576FB94ad58E199dE8deB5A24e5741DaE0E9a4",
      usdaContract: "0x4Ed7e2B0c37D30F7B0ed70353e023695642252eC",
      infoContract: "0x55E40Bff1fAEF65D6a6bC88F2d622C07FFd76ADA",
      farmPoolContract: "0x30E603b4Dd44Cffeb4E7069398b6A388a60a4B7C",
      leadingpoolContract: "0x5F527c2737D5EccB7E55aa3719928920D5A391bA",
      bnbContract: "0x5917544742c7CB43EDac6d78aE0a633BF044e23c",
      daiContract: "0x451ddD00e28A9631f24505033F1CC07dE89A0C3A",
      busdContract: "0x31153B9A97DFaB4975053563A6EfD0D4c4cdAD99",
      alphaReleaseRuleSelectorContract:
        "0x261917AA9Fccd664b3fAaC37082f2CDd2cbF6a1B",
      oracleContract: "0xC0409716cF1bFbaffedf8Ab531Ef0AA5EcEba31a",
      maraContract: "0x457D50587B5C4ac6Aea2cD31f42F7A54FFB4b25F",
      lendpoolconfigContract: "0xC0409716cF1bFbaffedf8Ab531Ef0AA5EcEba31a",
      lendpoolinfoContract: "0xC0409716cF1bFbaffedf8Ab531Ef0AA5EcEba31a",
      matokendeployerContract: "0x27410aaE7F0E7aADBF36076cdC796D74b8e6C3ba",
      lendpoolContract: "0x34DB65316B5A112a373dA446e58e60A6004e0821",
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
