const { config } = require("./config");
const port = config.port;

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
require("./mongo");

// routes
const userRouter = require("./routes/userRouter");
const roleRouter = require("./routes/roleRouter");
const imageRouter = require("./routes/imageRouter");

app.use("/users", userRouter);
app.use("/roles", roleRouter);
app.use("/images", imageRouter);

const {
  errorHandler,
  boomErrorHandler,
  logErrors,
} = require("./middleware/error.handler");
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in port ${port}`));
