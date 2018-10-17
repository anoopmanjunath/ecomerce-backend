const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser }= require('../middlewares/authentication');
const { validateID }= require('../middlewares/utilities');
const { CartItem }= require('../models/cart_item');
const { wish_list }= require('../models/user');
const _ = require('lodash');

//index
router.get('/', (req, res) => {
    User.find().then((users) => {
        res.send(users.shortInfo());
    }).catch((err) => {
        res.send(err);
    });
});

//post AKA registration link
router.post('/', (req, res) => {
   //mass assignment

   //Strong parameters
//    let body= {
//             username: req.body.username,
//             password: req.body.password,
//             email: req.body.email
//    }

   
    let body = _.pick(req.body ['username','password','email'])
    let user = new User(body);
    //console.log(user);
    user.save().then((user) => {
        return user.generateToken();
    }).then((token) => {
        res.header('x-auth', token).send(user.shortInfo());
    }).catch((err) => {
        res.send(err);
    });
});




router.get('/orders',(req,res)=>{
    console.log(req.header('x-auth'));
    //console.log(req.query.token);
    res.send('listing all the orders of the user');
})

//testing url
router.get('/orders', authenticateUser,(req,res)=>{
    let user=req.locals.user;
    //Order.find({user: user._id})
    res.send('Listing all the orders of the user');
})


//LOGOUT USER

router.delete('/logout',authenticateUser,(req,res)=>{
    let user =  req.locals.user;
    let token = req.locals.token;
    let activeToken = user.tokens.find(function(inDbToken){
        return inDbToken.token == token;
    });
    user.tokens.id(activeToken._id).remove();
    user.save().then((user)=>{
        res.send();
    }).catch((err)=>{
        res.send(err);
    })
})


//nested routes
//list all items
//GET users/cart_items

router.get('/cart_items', authenticateUser, (req,res)=>{
    res.send(req.locals.user.cartItems);
})


//add to cart
//POST users/cart_item


router.post('/cart_items',authenticateUser,(req,res) =>{
    let user = req.locals.users;
     
    let body = _.pick(req.body, ['products','quantity']);
    let cartItem=new cartItems(body);
    user.cartItems.push(cartItem);
    let inCart =  user.cartItems.find(function (item){
        //if you want to compare 2 object ids you need to use the equals method
        return item.product.equals(cartItem.product)
    });
    if(inCart){
        inCart.quantity = inCart.quantity + cartItem.quantity;
    }else{
        user.cartItems.push(cartItem);
    }
    user.cartItems.push(cartItem);
     user.save().then((user)=>{
         res.send({
             cartItem,
             "notice": 'successfully added item to cart'
         })
     }).catch((err)=>{
         res.send(err);
     })
})

//update the quantity
//PUT users/cart_items/:cart_item_id

router.put('/cart_items/:id', validateID, authenticateUser,(req,res)=>{
    let cartItemId = req.params.id;
    let user = req.locals.user;
    let body = _.pick(req,body, ['quantity']);
    let inCart = user.cartItems.id(cartItemId);
    inCart.quantity=body.quantity;

    user.save().then((user)=>{
        res.send({
            cartItem: inCart,
            notice: 'Sucessufully updated quantity'
        })
    }).catch((err)=>{
        res.send(err);
    })
})


//delete
//DELETE users/cart_items/:id
router.delete('/cart_items/:id', validateID, authenticateUser,(req,res)=>{
    let cartItemId = req.locals.user;
    user.cartItems.id(cartItemId).remove();
    user.save().then((user)=>{
        res.send('sucessufully removed the product from the cart');
    }).catch((err)=>{
        res.send(err);
    })
})


//adding product to wish_list
router.post('/wishlist_item',authenticateUser,(req,res) =>{
    let user = req.locals.users;
     
    let body = _.pick(req.body, ['products','createdAt']);
    //let car=new cartItems(body);
    user.wishLists.push(wishList);
    let inWish =  user.wishList.find(function (item){
        //if you want to compare 2 object ids you need to use the equals method
        return item.product.equals(wishList.product)
    });
    if(inWish){
        inWish.quantity = inWish.quantity + wishList.quantity;
    }else{
        user.wishLists.push(wishList);
    }
    user.wishLists.push(wishList);
     user.save().then((user)=>{
         res.send({
             wishList : users.wishList
         })
     }).catch((err)=>{
         res.send(err);
     })
})



//delete
//DELETE users/wish_list/:id
router.delete('/wishlist_item/:id', validateID, authenticateUser,(req,res)=>{
    let wishListId = req.locals.user;
    user.wishListId.id(cartItemId).remove();
    user.save().then((user)=>{
        res.send('sucessufully removed the product from the cart');
    }).catch((err)=>{
        res.send(err);
    })
})
router.put('wishlist_item/:id', validateID, authenticateUser,(req,res)=>{
    let wishListId = req.params.id;
    let user = req.locals.user;
    let body = _.pick(req,body, ['quantity']);
    let inwishList = user.wishList.id(wishListId);
    inwishList.quantity=body.quantity;

    user.save().then((user)=>{
        res.send({
            wishList: inwishList,
            notice: 'Sucessufully updated quantity'
        })
    }).catch((err)=>{
        res.send(err);
    })
})

module.exports = {
    usersController: router
}
	
	
	
