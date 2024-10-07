import { deleteOldPasswordCron } from "./deleteOldPasswordCron";
import { deleteOldTokensCron } from "./deleteOldTokensCron";
import { oldVisitCron } from "./oldVisitCrone";
// import { testCronJob } from "./testCron";

export const cronRunner = () => {
  // testCronJob.start();
  deleteOldTokensCron.start();
  deleteOldPasswordCron.start();
  oldVisitCron.start();
};
