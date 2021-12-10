import { schedule } from "danger";
import eslint from "./src";

schedule(async () => {
  await eslint();
});
