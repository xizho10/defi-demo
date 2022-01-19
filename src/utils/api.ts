import axios from "axios";

const getDepositList = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/deposit",
  });
};

const getWithdrawList = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/withdraw",
  });
};

const getLiquidationList = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/liquidation",
  });
};

export { getDepositList, getWithdrawList, getLiquidationList };
