import api from "../api";
import Toast from "react-native-root-toast";

class ProductServices{
    async getProductInformation(barcode,token,setLoadingbtn){
        return await api.get(`/client/product/barcode?barcode=`+barcode,{
            headers:{
                Authorization:"Bearer "+token
            }
        }).catch((err)=>{
           Toast.show(err.response.data.message)
            setLoadingbtn(false)
        })
    }
    async getProductInformationBycode(code,token,setLoadingbtn){
        return await api.get(`/client/product/serial?serial=`+code,{
            headers:{
                "Authorization":"Bearer "+token
            }
        }).catch((err)=>{
           Toast.show(err.response.data.message)
            setLoadingbtn(false)
        })
    }
}


export default new ProductServices();