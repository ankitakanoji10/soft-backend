// auth.js

const passport = require("passport");
const User = require("./models/User.js");
const OutlookStrategy = require("passport-outlook").Strategy;

passport.use(
  new OutlookStrategy(
    {
      clientID: "b0e4adce-e6e3-46f5-aec9-82a571af47ae", // Replace with your Outlook client ID
      clientSecret: "BOq8Q~_vWnVyILd_mJ75gbvDZcaDfAkov-eHmcMZ", // Replace with your Outlook client secret
      callbackURL: "http://localhost:8000/auth/outlook",
      scope: "https://outlook.office.com/User.Read",
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the profile information to create or update a user in your database
      // and return the user object.
      var user = {
        name: profile.DisplayName,
        email: profile.EmailAddress,
      };
      console.log("access token " + accessToken);
      console.log("refresh token " + refreshToken);
        console.log("profile " + profile);
          
        getUserInfo(accessToken)
          .then((userInfo) => {
            console.log("User information:", userInfo);
          })
          .catch((error) => {
            console.error("Error:", error);
          });

      // if (refreshToken)
      // user.refreshToken = refreshToken;

      // if (profile.Alias)
      //     user.alias = profile.Alias;
      // User.findOrCreate(user, function (err, user) {
      //     return done(err, user);
      //     });
      // console.log(user);
      // return (null, user)
      return done(null, { accessToken: accessToken });
    }
  )
);
async function getUserInfo(accessToken) {
  try {
    const response = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error.response.data);
    throw error;
  }
}

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
