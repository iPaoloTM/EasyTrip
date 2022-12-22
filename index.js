'use strict';

const config = require('./config');
const app = require('./app/app');

//Check Env
const PORT = process.env.PORT || 8080;

config.initDB()
    .then(msg => {
        console.log(msg);

        const server = app.listen(PORT, () => {
            console.log("Server started. Port: ", PORT);
        });
    })
    .catch(err => {
        throw(new Error(err));
    });