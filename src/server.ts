import * as app from "express";

import { router } from "./routes";

/*import database do make a test connection */
import "./database";

const server = app();

server.use(router);

server.listen(process.env.SERVER_PORT, () => {
  console.log(`Running on port ${process.env.SERVER_PORT}`);
});
