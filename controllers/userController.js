const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const userExists = await Users.findOne({ email });

    if (userExists) {
        return res.status(400).json({ msg: 'El usuario ya se encuentra registrado.' });
    }

    try {
        const user = new Users(req.body);
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(201).json({ msg: 'Usuario creado correctamente.' });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error.' });
    }
}