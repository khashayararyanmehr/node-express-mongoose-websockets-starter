const winston = require('../config/logger');

class WebsocketConnectionsManager {
  constructor(ConnectionControllerClass) {
    this.connections = [];
    this.onNewConnection = async (ws, req) => {
      const connectionHandler = new ConnectionControllerClass(ws, req, this);
      connectionHandler.close = function() {
        ws.close();
      };
      connectionHandler.send = function(msg) {
        let msgStr = msg;
        if (typeof msg === 'object') {
          msgStr = JSON.stringify(msg);
        }
        try {
          ws.send(msgStr);
          return true;
        } catch (e) {
          winston.warn(e);
          return false;
        }
      };
      ws.on('message', msg => {
        connectionHandler.onMessage(msg);
      });
      this.connections.push(connectionHandler);
      ws.on('error', err => {
        winston.warn(`connection ${connectionHandler.toString()} error: ${err}`);
      });
      ws.on('close', code => {
        winston.warn(`connection ${connectionHandler.toString()} closed with code ${code}`);
        const itemIndex = this.connections.indexOf(connectionHandler);
        this.connections.splice(itemIndex, 1);
      });
    };
  }

  sendTo(filter, msg) {
    let count = 0;
    this.connections.forEach(c => {
      if (filter(c)) {
        c.send(msg);
        count += 1;
      }
    });
    return count;
  }

  find(filter) {
    const connections = [];
    this.connections.forEach(c => {
      if (filter(c)) {
        connections.push(c);
      }
    });
    return connections;
  }
}

module.exports = WebsocketConnectionsManager;
