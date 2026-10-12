
const express = require("express");
const {
  getProfile,
  updateProfile
} = require("../controllers/userController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/me", getProfile);
router.patch("/me", updateProfile);

module.exports = router;
