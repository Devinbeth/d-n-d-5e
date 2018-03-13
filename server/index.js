require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const { SERVER_PORT, SESSION_SECRET, DOMAIN, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, CONNECTION_STRING } = process.env
const character_controller = require('./controllers/character_controller.js');
const weapons_controller = require('./controllers/weapons_controller.js');

const app = express();

massive(CONNECTION_STRING).then(db => app.set('db', db));

app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, function(accessToken, refreshToken, extraParams, profile, done) {
    const db = app.get('db');
    db.find_user([profile.id]).then(users => {
        if (!users[0]) {
            db.create_user([profile.displayName, profile.id]).then(user => {
                done(null, user[0].id);
            });
        }
        else {
            done(null, users[0].id);
        }
    });
}));

passport.serializeUser((id, done) => done(null, id));
passport.deserializeUser((id, done) => {
    app.get('db').find_session_user([id]).then(user => {
        done(null, user[0]);
    })
});


// AUTH ENDPOINTS
app.get('/auth', passport.authenticate('auth0'));
app.get('/auth/callback', passport.authenticate('auth0', {
    successRedirect: 'http://localhost:3000/#/home',
    failueRedirect: 'http://localhost:3000/'
}));
app.get('/auth/me', (req, res) => {
    if (req.user) {
        res.status(200).send(req.user);
    }
    else {
        res.status(401).send('Nice try suckaaaaaa!!!!!!');
    }
});
app.get('/auth/logout', (req, res) => {
    req.logOut();
    res.redirect('http://localhost:3000/')
});


// CHARACTER ENDPOINTS
app.get('/api/characters', character_controller.readCharacters);
app.get('/api/character/:id', character_controller.readCharacter);
app.put('/api/character/:id', character_controller.updateCharacter);


// WEAPONS ENDPOINTS
app.get('api/weapons/:id', weapons_controller.readWeapon);


app.listen(SERVER_PORT, () => console.log(`Server is listening on port: ${SERVER_PORT}`));
