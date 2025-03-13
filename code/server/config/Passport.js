const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User"); // Import user model
require("dotenv").config();

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				console.log("Google Profile: ", profile); // Debugging

				let user = await User.findOne({ email: profile.emails[0].value });

				if (!user) {
					user = new User({
						firstname: profile.name.givenName,
						lastname: profile.name.familyName,
						email: profile.emails[0].value,
						password: "google_auth", //dummy password for google
						phone: "1234567890", // Dummy phone if required
						modeoflogin: "google",
						profilephoto: profile._json.picture,
					});
					console.log("saved");
					await user.save();
				}

				done(null, user);
			} catch (error) {
				console.error("Google Auth Error: ", error);
				done(error, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

module.exports = passport;
