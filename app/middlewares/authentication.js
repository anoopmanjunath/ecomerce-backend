const { User } = require('../models/user');

const authenticateUser = function(req,res,next){
    let token = req.header('x-auth');
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

const authorizeUser = function(req,res,next){
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
