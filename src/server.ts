import { App } from "@/app";
import { AuthRoute } from "@routes/auth.route";
import { ValidateEnv } from "@utils/validateEnv";
import { UserRoute } from "./routes/user.route";
import { AdRoute } from "./routes/ad.route";
import { PageRoute } from "./routes/page.route";
import { BoardRoute } from "./routes/board.route";
import { FolderRoute } from "./routes/folder.route";
import { TagRoute } from "./routes/tag.route";
import { AnalyticsRoute } from "./routes/analytics.route";
import { TranscriptRoute } from "./routes/transcript.route";

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new UserRoute(),
  new AdRoute(),
  new PageRoute(),
  new BoardRoute(),
  new FolderRoute(),
  new TagRoute(),
  new AnalyticsRoute(),
  new TranscriptRoute(),
]);

app.listen();
