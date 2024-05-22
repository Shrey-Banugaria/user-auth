import { App } from "@/app";
import { AuthRoute } from "@routes/auth.route";
import { ValidateEnv } from "@utils/validateEnv";
import { UserRoute } from "./routes/user.route";

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new UserRoute(),
]);

app.listen();
