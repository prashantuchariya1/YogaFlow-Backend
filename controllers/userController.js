import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'
import transporter from '../config/emailConfig.js'

class UserController {
    static userRegistration = async (req, res) => {
        const { name, email, password, password_confirmation, tc, address, dob, gender, facebook, twitter, instagram } = req.body
        console.log(req.body);
        const user = await UserModel.findOne({ email: email })
        if (user) {
            res.send({ "status": "failed", "message": "Email already exist" })
            
        } else {
            
            if (name && password && password_confirmation && tc) {
                
                if (password === password_confirmation) {
                    try {
                        
                        const salt = await bcrypt.genSalt(10)
                        const hashPassword = await bcrypt.hash(password, salt)
                        const doc = new UserModel({
                            name: name,
                            email: email,
                            password: hashPassword,
                            tc: tc,
                            address: address,
                            dob: dob,
                            gender: gender,
                            facebook: facebook,
                            twitter: twitter,
                            instagram: instagram
                        })
                        await doc.save()
                        const saved_user = await UserModel.findOne({ email: email })


                        //Generate JWT Token
                        const token = jwt.sign({ userID: saved_user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.status(201).send({ "status": "success", "message": "User registered", "token": token })
                    } catch (error) {
                        console.log(error)
                        res.send({ "status": "failed", "message": "User can't register" })
                    }

                } else {
                    res.send({ "status": "failed", "message": "Password and confirm password dont match" })
                }
            } else {
                
                res.send({ "status": "failed", "message": "All fields are require" })

            }
        }
    }

    static userLogin = async (req, res) => {
        try {
            const { email, password } = req.body
            console.log(req.body)
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                if (user != null) {
                    const isMatch = await bcrypt.compare(password, user.password)
                    if ((email === user.email) && isMatch) {

                        //Generate JWT Token
                        const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
                        res.send({ "status": "success", "message": "Login Successful", "token": token })

                    } else {

                        res.send({ "status": "failed", "message": "Email or Passwword is Incorrect" })
                    }
                } else {
                    res.send({ "status": "failed", "message": "Email or Passwword is Incorrect" })
                }

            } else {
                res.send({ "status": "failed", "message": "All fields are require" })
            }

        } catch (error) {
            console.log(error)
            res.send({ "status": "failed", "message": "Unable to login" })

        }

    }



    static changeUserPassword = async (req, res) => {
        console.log("entering controller")
        const { password, password_confirmation } = req.body
        if (password && password_confirmation) {
            if (password !== password_confirmation) {

                res.send({ "status": "failed", "message": "Password and confirmend password does not match" })
            } else {
                const salt = await bcrypt.genSalt(10)
                const hashPassword = await bcrypt.hash(password, salt)
                console.log("req.user => ", req.user)
                await UserModel.findByIdAndUpdate(req.user._id, { $set: { password: hashPassword } })
                res.send({ "status": "success", "message": "Password changes successfuly" })


            }
        } else {
            res.send({ "status": "failed", "message": "All fields are require" })

        }
        console.log("leaving controller")
    }


    static loggedUser = async (req, res) => {
        res.send({ "user": req.user })
    }


    static sendUserPasswordResetEmail = async (req, res) => {
        const { email } = req.body
        if (email) {

            const user = await UserModel.findOne({ email: email })
            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link)

                //Send Email
                let info = await transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: user.email,
                    subject: "Password reset Email",
                    html: `<a href=${link}>Click here To reset your password</a>`
                })
                res.send({ "status": "success", "message": " please Check your Email to get reset Link", "info": info })


            } else {
                res.send({ "status": "failed", "message": "Email Does not exist" })

            }
        } else {
            res.send({ "status": "failed", "message": "Email field is Require" })

        }
    }


    static userPasswordReset = async (req, res) => {
        const { password, password_confirmation } = req.body
        const { id, token } = req.params
        const user = await UserModel.findById(id)
        const new_secret = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token, new_secret)
            if (password && password_confirmation) {
                if (password === password_confirmation) {
                    const salt = await bcrypt.genSalt(10)
                    const newhashPassword = await bcrypt.hash(password, salt)
                    await UserModel.findByIdAndUpdate(user._id, { $set: { password: newhashPassword } })
                    res.send({ "status": "success", "message": "Password Reset successfuly" })


                } else {
                    res.send({ "status": "failed", "message": "Password and confirmend password does not match" })
                }

            } else {
                res.send({ "status": "failed", "message": "All fields are require" })
            }
        }
        catch (error) {
            console.log(error)

        }
    }

}






export default UserController