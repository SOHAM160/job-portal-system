require("dotenv").config();
const { cloudinary } = require("./config/cloudinary");
const publicId = "jy2bfn0mhtzq3rngbxow";
const signedUrl = cloudinary.utils.private_download_url(publicId, "pdf", {
  resource_type: "image"
});
console.log("Signed URL:", signedUrl);

const https = require("https");
https.get(signedUrl, (res) => {
  console.log("Status Code:", res.statusCode);
  res.on("data", () => {});
  res.on("end", () => {
    console.log("Done");
  });
});
