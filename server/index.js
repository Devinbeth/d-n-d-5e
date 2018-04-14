require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const bodyParser = require('body-parser');
const cors = require('cors');
const massive = require('massive');
const { SERVER_PORT, SESSION_SECRET, DOMAIN, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL, CONNECTION_STRING, STRIPE_PRIVATE_KEY } = process.env;
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const auth_controller = require('./controllers/auth_controller.js');
const character_controller = require('./controllers/character_controller.js');
const weapons_controller = require('./controllers/weapons_controller.js');
const armor_controller = require('./controllers/armor_controller.js');
const spells_controller = require('./controllers/spells_controller.js');
const info_controller = require('./controllers/info_controller.js');

const app = express();

massive(CONNECTION_STRING).then(db => app.set('db', db));

app.use(express.static(`${__dirname}/../build`));

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
app.get('/auth/me', auth_controller.findUser);
app.get('/auth/logout', auth_controller.logoutUser);
app.put('/user', auth_controller.createUser);


// CHARACTER ENDPOINTS
app.get('/api/characters', character_controller.readCharacters);
app.get('/api/character/:id', character_controller.readCharacter);
app.post('/api/character', character_controller.createCharacter);
app.put('/api/character/:id', character_controller.updateCharacter);
app.delete('/api/character/:id', character_controller.deleteCharacter);


// WEAPONS ENDPOINTS
app.get('/api/weapons/:id', weapons_controller.readWeapons);
app.post('/api/weapons', weapons_controller.addWeapon);
app.delete('/api/weapons/:id', weapons_controller.deleteWeapon);
app.put('/api/weapons/:id', weapons_controller.editWeapon);


// ARMOR ENDPOINTS
app.get('/api/armor/:id', armor_controller.readArmor);
app.post('/api/armor', armor_controller.addArmor);
app.delete('/api/armor/:id', armor_controller.deleteArmor);
app.put('/api/armor/:id', armor_controller.editArmor);


// SPELL ENDPOINTS
app.get('/api/spells/:id', spells_controller.readSpells);
app.post('/api/spells', spells_controller.addSpell);
app.delete('/api/spells/:id', spells_controller.deleteSpell);
app.put('/api/spells/:id', spells_controller.editSpell);


// INFO ENDPOINTS
app.get('/api/info/weapons', info_controller.readAllWeapons);
app.get('/api/info/armor', info_controller.readAllArmor);
app.get('/api/info/spells', info_controller.readAllSpells);
app.get('/api/info/alignment', info_controller.readAlignment);


// STRIPE ENDPOINT
app.post('/api/payment', (req, res, next) => {
    const charge = stripe.charges.create(
      {
        source: req.body.token.id,
        amount: req.body.amount,
        currency: 'usd',
        description: 'Stripe test charge'
      },
      function(err, charge) {
          if (err) return res.sendStatus(500);
          else return res.sendStatus(200);
      }
    );
});


app.listen(SERVER_PORT, () => console.log(`Server is listening on port: ${SERVER_PORT}`));
