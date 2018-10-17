const express = require('express');
const { validateID } = require('../middlewares/utilities');
const router = express.Router();
const { Product } = require('../models/product');
//const { Category }= require('../models/category');

//show all
router.get('/', (req, res) => {
    Product.find().then((products) => {
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});

//create
router.post('/', (req, res) => {
    let body = req.body;
    let product = new Product(body);
    product.save().then((product) => {
        res.send({
            product,
            notice: 'successfully created the product'
        })
    }).catch((err) => {
        res.send(err);
    });
});

//show one
router.get('/:id', validateID, (req, res) => {
    let id = req.params.id;
    Product.findById(id).populate('category', 'name').then((product) => { // populate method will return the document category in the category field of the product. 'name' will return the category name to which the product beongs to.
        if(product){
            res.send(product);
        }else{
            res.send({
                notice : 'product not found'
            });
        }    
    }).catch((err) => {
        res.send(err);
    });
});

//update

router.put('/:id', validateID, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Product.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, runValidators: true }).then((product) => {
        if (product) {
            res.send({
                product,
                notice: 'successfully updated'
            });
        } else {
            res.send({
                notice: 'product not found.'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
})

//delete one
router.delete('/:id', validateID, (req, res) => {
    let id = req.params.id;
    Product.findByIdAndRemove(id).then((product) => {
        if(product){
            res.send(product);
        }else{
            res.send({
                notice: 'product not found'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
})



module.exports = {
    productsController: router
}