import api from "../api";

class RepStockDetailServices{
    async getProductInfo(barcode,token){
        return await api.get(`/client/report/stock/barcode?barcode=`+barcode,{
            headers:{
                "Authorization":"Bearer "+ token
            }
        })
    }
}


export default new RepStockDetailServices();