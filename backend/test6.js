require("dotenv").config();
const { cloudinary } = require("./config/cloudinary");
const url = cloudinary.url("job-portal-resumes/jy2bfn0mhtzq3rngbxow.pdf", {
  resource_type: "image",
  flags: "attachment",
  secure: true
});
console.log("Signed URL:", url);

const https = require("https");
https.get(url, (res) => {
  console.log("Status Code:", res.statusCode);
  res.on('data', () => {});
});
