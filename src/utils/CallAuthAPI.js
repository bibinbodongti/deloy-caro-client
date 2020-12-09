import axios from 'axios';
import * as Config from '../constant/config'

const callAuthAPI = (endpoint, method = 'GET', body, token) => {
    return axios({
        method: method,
        url: Config.API_URL + '/' + endpoint,
        data: body,
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).catch(err => {
        throw err;
    });
}


export default callAuthAPI;
