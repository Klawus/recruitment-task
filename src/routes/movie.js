const { Router } = require('express');
const movie = require('../controllers/movie');

const { validateCreateMovie } = require('../controllers/movie/validators');

const router = Router();

router.get('/', movie.getMovies);
router.get('/random', movie.getRandomMovie);
router.post('/', validateCreateMovie, movie.createMovie);

module.exports = router;
