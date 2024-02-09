// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ankitakanoji',
  api_key: '827974558632939',
  api_secret: 'dEkZzufY7y0Pqtk2iyLJV0XIXnI',
});
// Check Cloudinary Connection
cloudinary.api.ping(function(error, result) {
    if (result) {
      console.log('Connected to Cloudinary successfully.');
    } else {
      console.error('Error connecting to Cloudinary:', error);
    }
  });

module.exports = cloudinary;
