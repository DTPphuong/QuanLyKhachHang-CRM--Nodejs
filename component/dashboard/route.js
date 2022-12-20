const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/',[permission.mustLogin],
    service.getDashboard,
);

module.exports = router;