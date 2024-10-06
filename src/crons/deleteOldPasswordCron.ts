import { CronJob } from "cron";

import { timeHelper } from "../helpers/timeHelper";
import { oldPasswordRepository } from "../repositories/oldPasswordRepository";

const handler = async () => {
  try {
    const date = timeHelper.getCurrentTime(90, "days");
    const deletedCount = await oldPasswordRepository.deleteByParams({
      createdAt: { $lt: date },
    });
    console.log(`Deleted ${deletedCount} old passwords`);
  } catch (error) {
    console.error("Error deleting old passwords: ", error);
  }
};

export const deleteOldPasswordCron = new CronJob("1 0 */10 * *", handler);
