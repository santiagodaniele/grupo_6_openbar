const path = require('path');
const { check } = require('express-validator');
const db = require('../database/models');
const Users = db.User;
const Roles = db.Role;

module.exports = [
	check('firstname').notEmpty().withMessage('Tienes que escribir un nombre').isLength(2).withMessage('Minimo de 2 caracteres'),
	check('lastname').notEmpty().withMessage('Tienes que escribir un apellido').isLength(2).withMessage('Minimo de 2 caracteres'),
	check('email')
		.notEmpty().withMessage('Ingrese un email').bail()
		.isEmail().withMessage('Ingrese un correo válido')
		.custom(value => {
			return Users.findOne({
				where: {
					email: value
				}
			})
				.then(user => {
					if (user) {
						return Promise.reject("El email ya esta registrado")
					}
				})
		}),
	check('password').notEmpty().withMessage('Elige una constraseña').isLength(8).withMessage('Minimo de 8 caracteres'),
	check('image').custom((value, { req }) => {
		let file = req.file;
		let acceptedExtensions = ['.jpg', '.png', '.jpeg', '.gif'];

		if (!file) {
			throw new Error('Tienes que subir una imagen');
		} else {
			let fileExtension = path.extname(file.originalname);
			if (!acceptedExtensions.includes(fileExtension)) {
				throw new Error(`Las extensiones de archivo permitidas son ${acceptedExtensions.join(', ')}`);
			}
		}

		return true;
	})
]