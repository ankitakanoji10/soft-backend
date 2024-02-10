const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
// app.use(cors());

// Use body-parser middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const session = require('cookie-session');
const passport = require('./auth.js'); // Import the passport configuration
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const { loginController } = require('./controllers/AuthController.js');
const { profileRoutes } = require("./routes/profileRoutes.js");
const { projectRoutes } = require("./routes/projectRoutes.js");
const { courseRoutes } = require("./routes/courseRoutes.js");
const formidableMiddleware = require('express-formidable');
const User = require('./models/User.js');
const { default: slugify } = require('slugify');
// app.use(formidableMiddleware());
dotenv.config();
connectDB();
app.use(cors({
  origin: "http://localhost:3000",
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204 
}));
app.use(morgan('dev'));
app.use(session({
  secret: '3453ab55-1165-4586-9a37-405ae362cff8',
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure:true,
  }
}));
// // Initialize Passport and restore authentication state if available
app.use(passport.initialize()); 
app.use(passport.session());
var MicrosoftStrategy = require('passport-microsoft').Strategy;
passport.use(new MicrosoftStrategy({
    // Standard OAuth2 options
    clientID: 'b0e4adce-e6e3-46f5-aec9-82a571af47ae',
    clientSecret: 'BOq8Q~_vWnVyILd_mJ75gbvDZcaDfAkov-eHmcMZ',
    callbackURL: "https://unisync-api.onrender.com/auth/outlook",
    scope: ['user.read'],

    // Microsoft specific options

    // [Optional] The tenant for the application. Defaults to 'common'. 
    // Used to construct the authorizationURL and tokenURL
    tenant: 'common',

    // [Optional] The authorization URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize`
    authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',

    // [Optional] The token URL. Defaults to `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`
    tokenURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  },
  function(accessToken, refreshToken, profile, done) {
    // Find or create user based on the Microsoft profile
    // console.log(accessToken);
  User.findOne({ userid: profile.id })
  .exec()
  .then((user) => {
    if (!user) {
      // If user does not exist, create a new one
      const newUser = new User({
        userid: profile.id,
        name: profile.displayName, // assuming Microsoft profile has displayName
        email: profile.emails[0].value, // assuming Microsoft profile has emails array
        slug : slugify(profile.displayName, {lower:true})
        // set other properties as needed
      });

      newUser.save()
        .then((savedUser) => done(null, savedUser))
        .catch((err) => done(err));
    } else {
      // If user exists, return the user
      done(null, user);
    }
  })
  .catch((err) => done(err));
  }
));


passport.serializeUser((user, done) => {
  // Serialize the user object and store it in the session
  done(null, user.id);
});
app.get('/debug-user', (req, res) => {
  console.log('Authenticated User:', req.user);
  res.send('Check console for user details.');
});
passport.deserializeUser((id, done) => {
  // Deserialize the user object from the session using the stored user ID
  User.findOne({userid:id}, (err, user) => {
    done(err, user);
  });
});

app.get('/login',
      passport.authenticate('microsoft', {
        // Optionally define any authentication parameters here
        // For example, the ones in https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

        prompt: 'select_account',
      }), );

    app.get('/auth/outlook', 
      passport.authenticate('microsoft', { failureRedirect: '/login' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('https://www.google.com/');
});
// // Login Route
// app.get('/login', 
//       passport.authenticate('windowslive', {
//         // scope: [
//         //   'openid',
//         //   'profile',
//         //     'offline_access',
//         //     'email',
        
          
      
//         // ]
//       }),
    
// );

app.get("/homepage", (req, res) => {
    res.send("This is homepage");
})
// // Callback Route
// app.get('/auth/outlook', 
//   passport.authenticate('windowslive', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     // console.log(res);
//     // const name = res.ServerResponse.user.displayName;
//     // console.log(name);
//     res.redirect('http://localhost:8000/homepage');
//   });

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit:'50mb'}));

app.get("/", (req, res) => {
    res.send("Im working");
});

app.use("/profile", profileRoutes); 
app.use("/project", projectRoutes);
app.use("/course", courseRoutes);
app.listen(8000, () => {
    console.log("server is running on port 8000");
})
