const express = require('express');       
const router = express.Router();          
//const_ =require('lodash');              
                                          
const { Category } = require('../models/category');
const { validateID } = require('../middlewares/utilities');
const { Product } = require('../models/product');
                                          
const { authenticateUser, authorizeUser }= require('../middlewares/authentication');
                                          
//localhost:3000/categories/              
//show all                                
router.get('/', (req, res) => {           
    Category.find().then((categories) => { 
        res.send(categories);              
    }).catch((err) => {                   
        res.send(err);                    
    });                                   
});                                       
                                          
//localhost:3000/categories/:id           
//router.get('/:id')                      
                                          
//show one                                     
router.get('/:id', (req, res) => {
    let id = req.params.id;
    Category.findById(id).then((category) => {
        if(category){
            res.send(category);
        }else{
            res.send({
                notice: 'category not found'
            });
        }     
    }).catch((err) => {
        res.send(err);
    });
});

//create
router.post('/',authenticateUser, authorizeUser, (req, res) => {
    let body = req.body;
   // let body =_.pick(req.body, ['username','password','email']);
    let category = new Category(body);
    category.save().then((category) => {
        res.send({
            category,
            notice: 'successfully created the product'
        });
    }).catch((err) => {
        res.send(err);
    });
});

//delete by id
router.delete('/:id', validateID,authenticateUser,authorizeUser,(req,res)=>{
    let id =  req.params.id;

    Category.findByIdAndRemove(id).then((category)=>{
        if(category){
            res.send(category);
        }else{
            res.send({
                notice : 'category not found'
            })
        }
    }).catch((err)=>{
        res.send
    })
})

//update by id
router.put('/:id', validateID,authenticateUser, authorizeUser, (req,res) => {
    let id = req.params.id;
    let body = req.body;

    Category.findOneAndUpdate({ _id: id }, { $set: body }, { new: true, runValidators: true }).then((category) => {
        if (category) {
            res.send({
                category,
                notice: 'Successfully updated'
            });
        } else {
            res.send({
                notice: 'Category not found.'
            });
        }
    }).catch((err) => {
        res.send(err);
    });
});

//delete by id

// router.delete('/:id', validateID, (req,res) => {
//     let id = req.params.id;
//     Category.findOneAndRemove(id).then((category) => {
//         if(category){
//             res.send({
//                 category,
//                 notice: 'successfully removed'
//             })
//         }else{
//             res.send({
//                 notice: 'category not found'
//             });
//         }
//     }).catch((err) => {
//         res.send(err);
//     });
// });

//show all the products belonging to that particular category defining our own static method.
router.get('/:id/products',validateID,(req,res) => {
    let id = req.params.id;
    // Product.find({ category : id}).then((products) => {
    //     res.send(products);
    // }).catch((err) => {
    //     res.send(err);
    // });
    Product.findByCategory(id).then((products) => { // find by category is the method that has been defined using the static method.
        res.send(products);
    }).catch((err) => {
        res.send(err);
    });
});


module.exports = {
    categoriesController: router
}



