const https = require("https");
const urlStr = "https://res.cloudinary.com/dk3kex8qz/image/upload/v1718139359/job-portal-resumes/jy2bfn0mhtzq3rngbxow.pdf";
const options = {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/pdf"
  }
};
https.get(urlStr, options, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Headers:", res.headers);
  let body = "";
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log("Body length:", body.length, "content:", body.slice(0, 100)));
});
