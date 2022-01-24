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

const getContracts = () => {
  return axios({
    method: "get",
    url: "http://data.papayalend.com/api/v1/contracts",
    params: {
      page_size: 99,
    },
  });
};

const addContracts = (params: any) => {
  return axios({
    method: "post",
    url: "http://data.papayalend.com/api/v1/contracts",
    data: params,
  });
};

const editContracts = (params: any) => {
  return axios({
    method: "put",
    url: `http://data.papayalend.com/api/v1/contracts/${params.id}`,
    data: params,
  });
};

const deleteContracts = (id: string) => {
  return axios({
    method: "delete",
    url: `http://data.papayalend.com/api/v1/contracts/${id}`,
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
  getContracts,
  addContracts,
  editContracts,
  deleteContracts,
};
