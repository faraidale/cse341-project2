const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('./db/connect');
const { ObjectId } = require('mongodb');

passport.serializeUser((user, done) => {
    done(null, user._id.toString());
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await mongodb.getDb().db().collection('users').findOne({ _id: new ObjectId(id) });
        done(null, user || false);
    } catch (err) {
        done(err);
    }
});

const githubConfigured = Boolean(
    process.env.GITHUB_CLIENT_ID &&
    process.env.GITHUB_CLIENT_SECRET &&
    process.env.CALLBACK_URL
);

if (githubConfigured) {
    passport.use(new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const users = mongodb.getDb().db().collection('users');
                const user = {
                    githubId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value || null,
                    profileUrl: profile.profileUrl,
                    updatedAt: new Date()
                };
                const result = await users.findOneAndUpdate(
                    { githubId: profile.id },
                    { $set: user, $setOnInsert: { createdAt: new Date() } },
                    { upsert: true, returnDocument: 'after' }
                );
                done(null, result.value || result);
            } catch (err) {
                done(err);
            }
        }
    ));
}

passport.githubConfigured = githubConfigured;

module.exports = passport;
