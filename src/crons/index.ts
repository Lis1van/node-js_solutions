import { deleteOldTokens } from "./deleteOldTokens";
// import { testCronJob } from "./testCron";

export const testCron = () => {
  // testCronJob.start();
  deleteOldTokens.start();
};
