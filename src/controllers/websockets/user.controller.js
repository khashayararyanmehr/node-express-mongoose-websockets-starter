const wsModulesConnectionsManager = require('./ws-module.connections.manager');

class User {
  constructor(ws, req, connectionsManager) {
    this.ws = ws;
    this.connectionsManager = connectionsManager;
    ws.on('message', msg => {
      this.onMessage(msg);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  onMessage(msg) {
    wsModulesConnectionsManager.sendTo(() => {
      return true;
    }, `${msg} echo.......`);
  }

  send(msg) {
    this.ws.send(msg);
  }
}

module.exports = User;
