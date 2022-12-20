const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/list', [permission.mustLogin],
    service.getlist,
);
router.post(
    '/list', [permission.mustLogin],
    service.postlist
);
router.post(
    '/detail/:listId/edit', [permission.mustLogin],
    service.postlistEdit
);
router.post(
    '/detail/:listId/delete', [permission.mustLogin],
    service.postlistDelete
);
router.post(
    '/search', [permission.mustLogin],
    service.postSearch,
);router.get(
    '/list_recovery',[permission.mustLogin],
    service.getListRecovery
)
module.exports = router;