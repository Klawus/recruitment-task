const { Router } = require('express');
const movie = require('./movie');

const router = Router();

router.use('/movie', movie);

module.exports = router;
