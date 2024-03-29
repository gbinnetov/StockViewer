import api from "../api";

class RepStocServices {
  async getAll(license) {
    return await api.get(`/RepStock/GetAll/${license}`);
  }

  async getProductInformationBycode(filter,pageSize,pageNumber,token) {
      const response = await api.post(`/client/report/stock?`+'pageSize='+pageSize+'&pageIndex='+pageNumber, filter, {
        headers: {
            'Content-Type': 'application/json',
            "Authorization" : 'Bearer '+token
        }
    });
    return response;
  }
}

export default new RepStocServices();
