import { CronJob } from "cron";

import { EmailEnum } from "../enums/emailEnum";
import { timeHelper } from "../helpers/timeHelper";
import { userRepository } from "../repositories/userRepository";
import { emailService } from "../services/emailService";

const handler = async () => {
  try {
    const date = timeHelper.getCurrentTime(7, "days");
    const users = await userRepository.findOldUsers(date);
    await Promise.all(
      users.map(async (user) => {
        await emailService.sendMail(EmailEnum.OLD_VISIT, user.email, {
          name: user.name,
        });
      }),
    );
    console.log(`Sent email to ${users.length} users.`);
  } catch (error) {
    console.error("Error in oldVisitCron: ", error);
  }
};

export const oldVisitCron = new CronJob("1 0 */10 * *", handler);
