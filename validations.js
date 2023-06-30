import {body} from "express-validator"

export const registerValidation = [
    body('email', 'Incorrect email').isEmail(),
    body('password', 'At least 5 characters').isLength({min: 5}),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password mismatch');
        }
        return true;
    }),
    body('fullName', 'At least 2 characters').isLength({min: 2}),
    body('avatar', 'Incorrect URL').optional().isString(),
]


export const loginValidation = [
    body('email' ).isEmail(),
    body('password').isLength({min: 5}),

]


export const createPostValidation = [
    body('text', 'Enter text post').isLength({min: 1}).isString(),
    body('tags').optional().isString(),
    body('imageUrl', 'Incorrect URL').optional().isString()
]