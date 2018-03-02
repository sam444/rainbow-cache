import config from 'config';
const _config = sessionStorage.getItem('project_config');
const API_GATEWAY_PROXY_PATH = _config != null ? JSON.parse(_config).API_GATEWAY_PROXY : "";
module.exports = {
    getGroupListURL: API_GATEWAY_PROXY_PATH + 'rule/groups/v1/list',
    getValidateModelURL: API_GATEWAY_PROXY_PATH + 'pa/pa/policy/v1/validate',
};