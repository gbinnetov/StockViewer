import api from "../api";

class LicenseServices{
    async checkLicense(license){
        return await api.get(`/License/checkLicense/${license}`)
    }
}


export default new LicenseServices();