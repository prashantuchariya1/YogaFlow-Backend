import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'


var checkUserAuth = async (req,res,next)=>{
    console.log("entering auth-middleware")
    let token
    const {authorization} = req.headers
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            //get token from header
            token = authorization.split(' ')[1]
            console.log("authorization =>", authorization)
            //Verify Token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            
            //Get user from Token
            console.log("Get user from Token")
            req.user = await UserModel.findById(userID).select('-password')
            console.log("Get user from Token2")

            next()
            console.log("Get user from Token3")

        } catch (error) {
            console.log(error)
            res.status(401).send({"status":"failed", "message":"Unauthorized user"})
        }
        
    }
    if(!token){
        res.status(401).send({"status":"failed", "message":"Unauthorized user, No token found"})

    }

    console.log("leaving auth-middleware")
}

export default checkUserAuth