const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/list', [permission.mustLogin],
    service.getlist
)

router.post(
    '/list', [permission.mustLogin],
    service.postAddList
)

router.post(
    '/detail/:jobId/update', [permission.mustLogin],
    service.postJobUpdate
)

router.post(
    '/detail/:jobId/delete', [permission.mustLogin],
    service.postJobDelete
)

//search
router.post(
    '/search', [permission.mustLogin],
    service.postJobSearch
)

router.post(
    '/search/Next/:page', [permission.mustLogin],
    service.possNextJob
)

router.post(
    '/search/Next/:page/:key', [permission.mustLogin],
    service.possNextJob
)

router.post(
    '/search/Previous/:page', [permission.mustLogin],
    service.postPreviousJob
)

router.post(
    '/search/Previous/:page/:key', [permission.mustLogin],
    service.postPreviousJob
)

module.exports = router;