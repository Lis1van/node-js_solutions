import { CronJob } from "cron";

import { config } from "../configs/config";
import { timeHelper } from "../helpers/timeHelper";
import { tokenRepository } from "../repositories/tokenRepository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfig(
      config.JWT_REFRESH_EXPIRATION,
    );
    const date = timeHelper.getCurrentTime(value, unit);
    console.log(date);
    const deletedCount = await tokenRepository.deleteManyByDate(date);
    console.log(`Deleted ${deletedCount} expired tokens.`);
  } catch (error) {
    console.error("Error deleting expired tokens:", error);
  }
};

export const deleteOldTokensCron = new CronJob("1 0 */10 * *", handler);
