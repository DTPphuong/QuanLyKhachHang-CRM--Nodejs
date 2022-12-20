const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

router.get(
    '/list', [permission.mustLogin],
    service.getCompany
);
router.post(
    '/addCompany',
    [permission.mustLogin],
    service.postAddCompany,
);
router.post(
    '/detail/:companyId/update',
    [permission.mustLogin],
    service.postUpdateCompany,
);
router.post(
    '/detail/:companyId/delete',
    [permission.mustLogin],
    service.postDeleteCompany,
);
router.post(
    '/search',
    [permission.mustLogin],
    service.postSearchCompany,
);

router.post(
    '/search/Previous/:page/:key',
    [permission.mustLogin],
    service.postPreviousCompany,
);
router.post(
    '/search/Previous/:page',
    [permission.mustLogin],
    service.postPreviousCompany,
);
router.post(
    '/search/Next/:page/:key',
    [permission.mustLogin],
    service.postNextCompany,
);
router.post(
    '/search/Next/:page',
    [permission.mustLogin],
    service.postNextCompany,
);
//=============company_job===========
router.post(
    '/detail/:companyId/add_companyJob',
    [permission.mustLogin],
    service.postAddCompanyJob,
);
router.post(
    '/detail/:companyId/:companyJobId/edit_companyJob',
    [permission.mustLogin],
    service.postEditCompanyJob,
);
router.post(
    '/detail/:companyJobId/delete_companyJob',
    [permission.mustLogin],
    service.postDeleteCompanyJob,
);
//==============contact=============
router.post(
    '/detail/:companyId/add_contact',
    [permission.mustLogin],
    service.postAddContactCompany,
);
router.post(
    '/detail/:companyId/:contactCompanyId/edit_contact',
    [permission.mustLogin],
    service.postEditContactCompany,
);
router.post(
    '/detail/:contactCompanyId/delete_contact',
    [permission.mustLogin],
    service.postDeleteContactCompany,
);

module.exports = router;