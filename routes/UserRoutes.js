

module.exports = (app) => {
    const users = require('../controllers/UserController.js');
    const passport = require('passport');
    require('./../middleware/passport')(passport)


    // Create a new User
    app.post('/users', users.create);

    //Auth
    app.post('/users/login', users.login);

    //2Auth
    app.post('/users/login2', users.login2);

    //exchnage
    app.post('/exchange',passport.authenticate('jwt', { session: false }), users.exchange);

    // Retrieve all Users
    app.get('/users', passport.authenticate('jwt', { session: false }), users.findAll);

    // Retrieve a User
    app.get('/users/fetch', passport.authenticate('jwt', { session: false }), users.findOne);

    app.get('/balance', passport.authenticate('jwt', { session: false }), users.getBalance);

    // Update a User with username
    app.put('/users/:username',passport.authenticate('jwt', {session:false}),  users.update);

    // Delete a User with username
    app.delete('/users/:username',passport.authenticate('jwt', {session:false}),  users.delete);

    //verif Token
    app.post('/users/verif',passport.authenticate('jwt', { session: false }), users.verifToken);

    //withdraw 
    app.post('/withdraw',passport.authenticate('jwt', { session: false }), users.withdraw);

    
}