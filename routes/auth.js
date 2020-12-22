/* 
    Rutas de Usuario / Auth
    host + /api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, reValidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

// EndPoints
router.post(
    '/new',
    // Middlewares
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({min: 6}),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ], 
    crearUsuario
);

router.post(
    '/',
    [
        check('password', 'La contraseña debe de ser de 6 caracteres').isLength({min: 6}),
        check('email', 'El email es obligatorio').isEmail(),
        validarCampos
    ],  
    loginUsuario
);

router.get(
    '/renew', 
    validarJWT, 
    reValidarToken
);

module.exports = router;