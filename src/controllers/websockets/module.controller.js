const winston = require('../../config/logger');
const { toJSON } = require('../../utils/toJSON.util');
const ModuleModel = require('../../models').Module;
const ElevatorModel = require('../../models').Elevator;

class Module {
  constructor(ws, req, connectionsManager) {
    this.ws = ws;
    this.req = req;
    this.connectionsManager = connectionsManager;
    this.code = undefined;
  }

  onMessage(msg) {
    const msgJSON = toJSON(msg);
    if (msgJSON && msgJSON.T === 'Register') {
      // register module and send its code
      return this.onRegister(msgJSON.cpuId, msgJSON.wifiMac, msgJSON.ethMac);
    }
    if (msgJSON && msgJSON.T === 'GreetBack') {
      // tell module its code
      return this.onGreet(msgJSON.D);
    }
    if (!this.code) {
      // module needs to greet
      return this.requestGreet();
    }
    if (msg === 'A' || msg === 'B') {
      return this.onA();
    }
    if (msgJSON && msgJSON.ECOUNT) {
      return this.onSetup(msgJSON.ECOUNT);
    }
    this.send(`${msg} echo...`);
  }

  async onA() {
    if (!this.send('A')) {
      this.ws.close();
    }
  }

  async onRegister(cpuId, wifiMac, ethMac) {
    const module = await ModuleModel.findOne({ serialNumber: cpuId });
    if (module) {
      this.send({
        T: 'Register',
        label: module.code,
      });
    } else {
      this.send('unable to register with provided cpuId.');
      this.close();
    }
  }

  async onGreet(code) {
    const module = await ModuleModel.findOne({ code });
    if (module) {
      this.code = module.code;
      if (!module.isSetup) {
        this.requestSetup();
      }
    } else {
      this.send('no module with code exists.');
      this.close();
    }
  }

  async onSetup(elevatorsCount) {
    const module = await ModuleModel.findOne({ code: this.code });
    if (module) {
      for (let st = 1; st <= elevatorsCount; st += 1) {
        const elevator = new ElevatorModel({
          systemType: st,
        });
        await elevator.save();
        module.elevators.push(elevator);
      }
      await module.save();
    } else {
      this.send('no module with code exists.');
      this.close();
    }
  }

  async requestGreet() {
    this.send({ T: 'Greet' });
  }

  async requestSetup() {
    // request for elevators count, etc.
    this.send({ OP: 'E' });
  }
}

module.exports = Module;
