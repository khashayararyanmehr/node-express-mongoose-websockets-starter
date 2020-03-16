const WebsocketConnectionsManager = require('../../utils/ws-connections-manager.util');
const User = require('./user.controller');

const wsUserConnectionsController = new WebsocketConnectionsManager(User);
module.exports = wsUserConnectionsController;
