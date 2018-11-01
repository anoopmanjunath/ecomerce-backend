const  mongoose = require('mongoose');
const Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');       //npm install --save bcryptjs
let validator = require('validator');   //npm install --save validator

const jwt = require('jsonwebtoken');       //npm install --save jsonwebtoken
const { cartItemSchema } = require('./cart_item');


const userSchema = new Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 64,
        unique: true,   //unique is not a validation check
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
        validator: function (value){
                return validator.isEmail(value);
        },
        message: function() {
            return 'invalid emial format'    //can be a string also 
        }
    }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 128
    },
    tokens: [{
        token: {
            type: String
        }
    }],
    role:{
        type:String,
        required: true,
        enum: ['admin','customer'],
        default: 'customer'
    },
    CartItems: [cartItemSchema],
    wishlist : [{
        product : { type : Schema.Types.ObjectId, ref: 'product', required: true },
        created_at : { type: Date, default: Date.now },
        isPublic : { type: Boolean, default: true }

    }]
    
});

    // wishList: [{
    //     product:{ 
    //         type: Schema.Types.ObjectId,
    //         ref: 'Product',
    //         required: true
    //     },
    //     createdAt: { type: Date, default: Date.now },
        
    //     isPublic: {
    //         type: Boolean,
    //         required: true
    //     }
        
    // }]



userSchema.pre('save', function(next){
    let user = this;
    bcrypt.genSalt(10).then((salt) => {
        bcrypt.hash(user.password, salt).then((hashed) => {
            user.password = hashed;
            next();
        });
    });
});

userSchema.methods.shortInfo = function () { //instance method named shortInfo which returns the object that is being created. This function is written to return only the id and username and the email of the user.
    return {
        _id: this._id,
        username: this.username,
        email: this.email
    };
};

userSchema.methods.generateToken = function (next) { //instance method to generate a token.
    let user = this;
    let tokenData = {
        _id: user.id
    };

    let token = jwt.sign(tokenData, 'supersecret');
    user.tokens.push({
        token
    });

    return user.save().then(() => {

        return token;
    });
}

userSchema.statics.findByToken = function (token) { // static method created to define the function findByToken
    let User = this;
    let tokenData;
    try {
        tokenData = jwt.verify(token, 'supersecret');
    } catch (e) {
        return Promise.reject(e);
    }

    return User.findOne({
        '_id': tokenData._id,
        'tokens.token': token
    }).then((user) => {
        if (user) {
            return Promise.resolve(user);
        } else {
            return Promise.reject(user);
        }
    })
};

const User = mongoose.model('User', userSchema);


module.exports = {
    User
}