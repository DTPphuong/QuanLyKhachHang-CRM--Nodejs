const express = require('express');
const router = express.Router();
const service = require('./service');
const permission = require('./../_core/middlewares/permission');

// api route
router.post(
    '/api/create',
    [],
    service.postApiContactCreate,
);
router.get(
    '/api/list',
    [],
    service.getApiContactList,
);
// end api route

router.get(
    '/list',
    [permission.mustLogin],
    service.getContact,
);
router.post(
    '/detail/:contactId/update',
    [permission.mustLogin],
    service.postUpdateContact,
);
router.post(
    '/detail/:contactId/delete',
    [permission.mustLogin],
    service.postDeleteContact,
);
router.post(
    '/addContact',
    [permission.mustLogin],
    service.postAddContacts,
);
router.post(
    '/search',
    [permission.mustLogin],
    service.postSearchContact,
);

router.post(
    '/search/Previous/:page/:key/:sortby',
    [permission.mustLogin],
    service.postPreviousContact,
);
router.post(
    '/search/Previous/:page',
    [permission.mustLogin],
    service.postPreviousContact,
);
router.post(
    '/search/Next/:page/:key/:sortby',
    [permission.mustLogin],
    service.postNextContact,
);
router.post(
    '/search/Next/:page',
    [permission.mustLogin],
    service.postNextContact,
);
//==============list_contact==============
router.post(
    '/detail/:contactId/add_list',
    [permission.mustLogin],
    service.postAddContactList,
);
router.post(
    '/detail/:contactsListsId/delete_list',
    [permission.mustLogin],
    service.postDeleteContactList,
);
router.post(
    '/detail/:contactsListsId/edit_list',
    [permission.mustLogin],
    service.postEditContactList,
);
// ==============contact_company==============
router.post(
    '/detail/:contactId/add_company',
    [permission.mustLogin],
    service.postAddContactCompany,
);
router.post(
    '/detail/:contactCompanyId/delete_company',
    [permission.mustLogin],
    service.postDeleteContactCompany,
);
router.post(
    '/detail/:contactId/:contactCompanyId/edit_company',
    [permission.mustLogin],
    service.postEditContactCompany,
);

module.exports = router;