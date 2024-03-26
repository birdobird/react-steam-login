import express from 'express';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import session from 'express-session';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(session({
    secret: 'ljkdnflsdnfo2323aads',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new SteamStrategy({
    returnURL: 'http://localhost:3001/auth/steam/callback',
    realm: 'http://localhost:3001/',
    apiKey: ''
}, function(identifier, profile, done) {
    return done(null, profile);
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

app.get('/auth/steam', passport.authenticate('steam', { failureRedirect: '/' }), function(req, res) {
    res.redirect('/');
});

app.get('/auth/steam/callback', passport.authenticate('steam', { failureRedirect: '/' }), function(req, res) {
    req.session.user = req.user;
    res.redirect(`http://localhost:5173/?session_id=${req.session.id}`);
});

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('http://localhost:5173/');
});

app.get('/user', function(req, res) {
	let user = false
    const sessionId = req.query.session_id;
    req.sessionStore.get(sessionId, (err, session) => {
		if (err) {
			throw err
		}
		if (session !== undefined) {
			user = session.passport.user
			res.send(user);
		}
	})
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});