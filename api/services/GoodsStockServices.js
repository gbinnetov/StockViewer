import api from "../api";

class GoodsStockServices{
    async getGoodsStockByBarcode(barcode,token){
        return await api.get(`/client/product/barcode/stock?barcode=`+barcode,{
            headers:{
                "Authorization":"Bearer "+ token
            }
        })
    }
    async getGoodsStockAll(license){
        return await api.get(`/GoodsStock/getGoodsStockAll/${license}`)
    }
}


export default new GoodsStockServices();
