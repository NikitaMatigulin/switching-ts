const router = require("express").Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const formatResponse = require("../utils/formatResponse");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);

router.use("*", (req, res) => {
  res
    .status(404)
    .json(formatResponse(404, "Not found", null, "Resource not found"));
});

module.exports = router;
