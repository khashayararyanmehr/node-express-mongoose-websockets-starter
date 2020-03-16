const express = require('express');
const { wsModuleConnectionsManager, wsUserConnectionsManager } = require('../../controllers/websockets');
const wsAuth = require('../../middlewares/wsAuth');

const router = express.Router();

router.ws('/moduledatahandler', wsModuleConnectionsManager.onNewConnection);
router.ws('/userdatahandler', wsAuth('CreateWSConnection'), wsUserConnectionsManager.onNewConnection);

module.exports = router;
