const WebsocketConnectionsManager = require('../../utils/ws-connections-manager.util');
const Module = require('./module.controller');

const wsModuleConnectionsManager = new WebsocketConnectionsManager(Module);
module.exports = wsModuleConnectionsManager;
