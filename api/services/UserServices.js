import axios from "axios";

class UserServices{
    async getAll(license){
        return await api.get(`/Users/getAll/${license}`)
    }
    async login(loginDto) {
        try {
          const response =  await axios.post(`http://188.213.212.194/api/Auth/login`, loginDto, {
              headers: {
                  'Content-Type': 'application/json'
              }
          })
          return response
        } catch (error) {
          throw error;
        }
    }
}


export default new UserServices();