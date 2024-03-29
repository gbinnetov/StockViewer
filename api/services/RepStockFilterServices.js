import api from "../api";

class RepStockFilterServices{
    async GetAll(token){
        return await api.get(`/client/report/filters`,{
            headers:{
                "Authorization":"Bearer "+token
            }
        })
    }
}


export default new RepStockFilterServices();