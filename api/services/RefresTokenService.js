import axios from "axios";

class RefresTokenService{
    async RefresToken(refreshDto,token){
        
        const response=  await axios.post(`http://188.213.212.194/api/Auth/refresh`, refreshDto, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer "+token
            }
        }).catch((err)=>{
          console.log(err.status)
        })
        return response
    }
}


export default new RefresTokenService();