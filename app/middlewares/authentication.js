const { User } = require('../models/user');

const authenticateUser = function(req,res,next){
    let token = req.header('x-auth'); //request header that contains the user id token.
    User.findByToken(token).then((user)=>{
        //TODO ------setup user object across routes
        req.locals={
            user,
            token
        }
        next();
    }).catch((err)=>{
        
        res.send(401).send(err);
    })
}



//allow only the admin to add particular product , category

const authorizeUser = function(req,res,next){ // to check if the logged in person is an admin or a user.
    if(req.locals.user.role == 'admin'){
        next();
    }else{
        res.status(403).send('You are not authorized to access this page')
    }
}

module.exports={
    authenticateUser,
    authorizeUser
}
