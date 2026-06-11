require("dotenv").config();
const { cloudinary } = require("./config/cloudinary");
const url = cloudinary.url("job-portal-resumes/jy2bfn0mhtzq3rngbxow", {
  resource_type: "image",
  sign_url: true,
  secure: true
});
console.log("Signed URL:", url);

const https = require("https");
https.get(url, (res) => {
  console.log("Status Code:", res.statusCode);
  res.on('data', () => {});
});
