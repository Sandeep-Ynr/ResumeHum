const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'stadmjow',
  api_key: '429178597634627',
  api_secret: 'jSZx3eR-PVM7IPby46iH0pY_a1M'
});

cloudinary.uploader.upload('package.json', { resource_type: "auto" })
  .then(result => console.log('Upload success:', result.secure_url))
  .catch(error => console.error('Upload error:', error));
