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

const getLendingPools = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/lending/pools",
  });
};

const getLendingUsers = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/lending/users",
  });
};

const getLendingPoolsEvents = (params: any) => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/lending/events",
    params,
  });
};

const getLiquidation = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/liquidation",
  });
};

export {
  getDepositList,
  getWithdrawList,
  getLiquidationList,
  getLendingPools,
  getLendingUsers,
  getLendingPoolsEvents,
  getLiquidation,
};
