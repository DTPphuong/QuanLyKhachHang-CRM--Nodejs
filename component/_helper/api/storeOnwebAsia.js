'use strict';
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const url = 'https://vn-store.onweb.asia/api/v1';

const storeQuery = async (data) => {
    return axios.post(url + '/store/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId
    });
};
const storeCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('fullName', data.fullName);
    form.append('domain', data.domain);
    form.append('onwebContactId', data.contactId);
    form.append('apiOnwebUserId', data.apiOnwebUserId);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/store/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const storeUpdate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('fullName', data.fullName);
    form.append('contactId', data.contactId);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/store/' + data.storeId.toString() + '/update', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const storeDetail = async (data) => {
    // Send form data with axios
    return axios.get(url + '/store/' + data.storeId.toString() + '/detail');
};
const categoryQuery = async (data) => {
    return axios.post(url + '/category/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId,
        "isFor": data.isFor
    });
};
const categoryCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('fullName', data.fullName);
    form.append('contactId', data.contactId);
    form.append('isFor', data.isFor);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/category/' + data.storeId + '/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const categoryUpdate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('fullName', data.fullName);
    form.append('contactId', data.contactId);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/category/' + data.storeId + '/' + data.categoryId + '/update', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const productQuery = async (data) => {
    return axios.post(url + '/product/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId
    });
};
const productCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('sku', data.sku);
    form.append('contactId', data.contactId);
    form.append('fullName', data.fullName);
    form.append('description', data.description);
    form.append('price', data.price);
    form.append('categories', data.categories);
    form.append('salePrice', data.salePrice);
    form.append('is_newest', data.isNewest);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/product/' + data.storeId + '/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const productUpdate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('sku', data.sku);
    form.append('contactId', data.contactId);
    form.append('fullName', data.fullName);
    form.append('description', data.description);
    form.append('price', data.price);
    form.append('categories', data.categories);
    form.append('sale_price', data.salePrice);
    form.append('is_newest', data.isNewest);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/product/' + data.storeId + '/' + data.productId + '/update', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const productDelete = async (data) => {
    // Send form data with axios
    return axios.post(url + '/product/' + data.storeId + '/' + data.productId + '/delete');
};
const productDetail = async (data) => {
    return axios.get(url + '/product/' + data.storeId.toString() + '/' + data.productId.toString());
};
const categoryProductDelete = async (data) => {
    return axios.post(url + '/product/' + data.storeId.toString() + '/' + data.productId.toString() + '/category/delete', {
        "contactId": data.contactId,
        "category": data.category
    });
};
const categoryProductAdd = async (data) => {
    return axios.post(url + '/product/' + data.storeId.toString() + '/' + data.productId.toString() + '/category/add', {
        "contactId": data.contactId,
        "category": data.category
    });
};
const serviceQuery = async (data) => {
    return axios.post(url + '/service/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId,
        "status": data.status
    });
};
const serviceDetail = async (data) => {
    return axios.get(url + '/service/' + data.storeId.toString() + '/' + data.serviceId);
};
const serviceCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('contactId', data.contactId);
    form.append('fullName', data.fullName);
    form.append('description', data.description);
    form.append('price', data.price);
    form.append('categories', data.categories);
    form.append('salePrice', data.salePrice);
    form.append('is_newest', data.isNewest);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/service/' + data.storeId + '/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const serviceUpdate = async (req, data) => {
    // Create a form and append image with additional fields
    console.log(data.contactId);
    console.log(data.fullName);
    const form = new FormData();
    form.append('contactId', data.contactId);
    form.append('fullName', data.fullName);
    form.append('description', data.description);
    form.append('price', data.price);
    form.append('categories', data.categories);
    form.append('salePrice', data.salePrice);
    form.append('status', data.status);
    form.append('is_newest', data.isNewest);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/service/' + data.storeId + '/' + data.serviceId + '/update', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const serviceDelete = async (data) => {
    // Send form data with axios
    return axios.post(url + '/service/' + data.storeId + '/' + data.serviceId + '/delete');
};
const categoryServiceAdd = async (data) => {
    return axios.post(url + '/service/' + data.storeId.toString() + '/' + data.serviceId.toString() + '/category/add', {
        "contactId": data.contactId,
        "category": data.category
    });
};
const categoryServiceDelete = async (data) => {
    return axios.post(url + '/service/' + data.storeId.toString() + '/' + data.serviceId.toString() + '/category/delete', {
        "contactId": data.contactId,
        "category": data.category
    });
};
const articleCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('contactId', data.contactId);
    form.append('title', data.title);
    form.append('long_content', data.longContent);
    form.append('short_content', data.shortContent);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }
    // Send form data with axios
    return axios.post(url + '/article/' + data.storeId + '/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const articleQuery = async (data) => {
    return axios.post(url + '/article/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId,
    });
};
const articleDetail = async (data) => {
    return axios.get(url + '/article/' + data.storeId.toString() + '/' + data.articleId.toString());
};
const articleUpdate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('contactId', data.contactId);
    form.append('title', data.title);
    form.append('long_content', data.longContent);
    form.append('short_content', data.shortContent);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }
    // Send form data with axios
    return axios.post(url + '/article/' + data.storeId + '/' + data.articleId + '/update', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const articleDelete = async (data) => {
    // Send form data with axios
    return axios.post(url + '/article/' + data.storeId + '/' + data.articleId + '/delete');
};
const notifyQuery = async (data) => {
    return axios.post(url + '/notify/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId,
        "articleId": data.articleId,
        "status": data.status,
    });
};
const notifySend = async (data) => {
    return axios.post(url + '/notify/' + data.storeId.toString() + '/create', {
        "contactId": data.contactId,
        "articleId": data.articleId,
        "type": data.type,
    });
};
const bannerCreate = async (req, data) => {
    // Create a form and append image with additional fields
    const form = new FormData();
    form.append('contactId', data.contactId);
    form.append('type', data.type);

    if(req.image1){
        // Read image from disk as a Buffer
        const image = await fs.readFileSync(req.image1);
        const imageName = path.basename(req.image1);

        // const file = req.image1;
        form.append('file', image, imageName);
    }

    // Send form data with axios
    return axios.post(url + '/banner/' + data.storeId.toString() + '/create', form, {
        headers: {
            ...form.getHeaders()
        },
    });
};
const bannerQuery = async (data) => {
    return axios.post(url + '/banner/' + data.storeId.toString() + '/query', {
        "itemInPage": data.itemInPage,
        "page": data.page,
        "contactId": data.contactId,
        "type": data.type,
    });
};
const bannerDelete = async (data) => {
    return axios.post(url + '/banner/' + data.storeId.toString() + '/delete', {
        "id": data.id,
    });
};
const optionsCreateOrUpdate = async (data) => {
    const _d = {
        "optionKey": data.optionKey,
        "optionValue": data.optionValue,
    };
    if(data.id){
        _d.id = data.id;
    }
    return axios.post(url + '/options/' + data.storeId.toString() + '/create-or-update', _d);
};

module.exports = {
    storeQuery,
    storeCreate,
    storeUpdate,
    storeDetail,
    categoryQuery,
    categoryCreate,
    categoryUpdate,
    productQuery,
    productCreate,
    productDelete,
    productUpdate,
    productDetail,
    categoryProductDelete,
    categoryProductAdd,
    serviceQuery,
    serviceDetail,
    serviceCreate,
    serviceUpdate,
    serviceDelete,
    categoryServiceAdd,
    categoryServiceDelete,
    articleCreate,
    articleQuery,
    articleDetail,
    articleUpdate,
    articleDelete,
    notifyQuery,
    notifySend,
    bannerCreate,
    bannerQuery,
    bannerDelete,
    optionsCreateOrUpdate
};