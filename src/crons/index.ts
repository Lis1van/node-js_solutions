import { deleteOldPasswordCron } from "./deleteOldPasswordCron";
import { deleteOldTokensCron } from "./deleteOldTokensCron";
import { oldVisitCron } from "./oldVisitCrone";
// import { testCronJob } from "./testCron";

export const testCron = () => {
  // testCronJob.start();
  deleteOldTokensCron.start();
  deleteOldPasswordCron.start();
  oldVisitCron.start();
};
