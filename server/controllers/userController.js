const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const {User, History} = require('../model/model')
const jwt = require('jsonwebtoken')
const {validate} = require('deep-email-validator');

const generateJwt = (_id, email) => {
    return jwt.sign(
        {_id, email},
        process.env.SECRET_KEY,
        {expiresIn: '24h'})
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

class userController {
    async registration(req, res, next) {

        try {
            const {name, email, password} = req.body
            if (!email || !password || !name) {
                return next(ApiError.badRequest("Invalid email, password or name."))
            }

            const validationResult = await validate(email);


            if (!validateEmail(email)) {
                return res.status(400).json({
                    message: 'Email is not valid. Please try again!'
                })
            }

            // if (!validationResult.valid) {
            //     return res.status(400).send({
            //         status: 'error',
            //         message: 'Email is not valid. Please try again!',
            //         reason: validationResult.reason
            //     });
            // }


            const candidate = await User.exists({email})
            if (candidate) {
                return next(ApiError.badRequest('User already registered'))
            }

            const hashPassword = await bcrypt.hash(password, 5)

            const user = await User.create({email: email, name: name, password: hashPassword})

            const token = generateJwt(user._id, user.email)

            return res.json({token})
        } catch (e) {
            console.log(e)
        }

    }

    async login(req, res, next) {
        const {email, password} = req.body

        const user = await User.findOne({email: email})

        if (!user) {
            return next(ApiError.internal('User is not found.'))
        }

        let comparePassword = bcrypt.compareSync(password, user.password)

        if (!comparePassword) {
            return next(ApiError.internal('Wrong password'))
        }

        const token = generateJwt(user._id, user.email)

        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user._id, req.user.email)
        return res.json({token})
    }

    async getAllUsers(req, res, next) {
        try {
            const {page = 1, limit = 10, search} = req.query;

            const query = {
                email: new RegExp(search, 'i')
            }


            let users = await User.find(query, '-password')
                .limit(limit)
                .skip((page - 1) * limit)
                .sort({registrationTime: -1});

            const count = await User.find(query).countDocuments();


            return res.json({
                users,
                totalPages: Math.ceil(count / limit),
                currentPage: Number(page),
                totalCount: count
            })


        } catch (e) {
            next(e)
        }

    }

    async changeUsersStatus(req, res, next) {
        let {email} = req.user
        let {users, status} = req.body
        if (!users) {
            return next(ApiError.badRequest('Incorrect data'))
        }

        const history = []
        for (const user of users) {
            let result = await User.findOneAndUpdate({email: user}, {$set: {status: status}})
            if (result && result.status !== status) {
                history.push({executor: email, victim: user, changedTo: status})
            }
        }

        await History.insertMany(history)

        return res.status(202).json({message: "Statuses updated"})
    }

    async changePassword(req, res, next) {
        const {email, password} = req.body
        if (!password) {
            return next(ApiError.badRequest("Invalid password."))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        let user = await User.findOneAndUpdate({email: email}, {password: hashPassword})
        return res.json(user)
    }

    async deleteUsers(req, res, next) {
        let {email} = req.user
        let {users} = req.body
        if (!users) {
            return next(ApiError.badRequest('Incorrect data'))
        }

        const history = []


        for (const user of users) {
            let result = await User.exists({email: user})
            if (result) {
                await User.deleteOne({email: user})
                history.push({executor: email, victim: user, changedTo: 'Deleted'})
            }
        }

        await History.insertMany(history)


        return res.status(200).json({message: "Users deleted"})
    }
}

module.exports = new userController()
