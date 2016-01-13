import { restapi as rest } from '../../commons/utils/restapi';

let url = 'https://updates.jenkins-ci.org/current/update-center.json';
let restAPI = {

  getPlugins(callback) {
    rest.getJSON(url, 'plugins', callback);
  }
};

module.exports = restAPI;
