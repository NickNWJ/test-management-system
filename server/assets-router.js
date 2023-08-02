const express = require("express");
const router = express.Router();
const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/; // You can add other image formats
const videoRegex = /\/.+\.(mp4|ogv)$/
router.get(imageRegex, (req, res) => {
  const filePath = req.path;
});
router.get(videoRegex, (req, res) => {
  const filePath = req.path;

  console.log("file" + res.redirect(303, `http://localhost:5173/src${filePath}`));
});
module.exports = router;