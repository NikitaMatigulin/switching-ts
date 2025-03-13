const express = require("express");
const serverConfig = require("./config/serverConfig");
const indexRouter = require("./routes/index.routes");

const app = express();

serverConfig(app);

const PORT = process.env.PORT || 3000;

app.use("/api", indexRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
