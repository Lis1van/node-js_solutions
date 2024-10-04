import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";

import { config } from "../configs/config";
import { emailConstants } from "../constants/emailConstants";
import { EmailEnum } from "../enums/emailEnum";
import { EmailTemplateData } from "../types/EmailTemplateData";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: "No reply",
      auth: {
        user: config.SMTP_EMAIL,
        pass: config.SMTP_PASSWORD,
      },
    });

    const hbsOptions = {
      viewEngine: {
        extname: ".hbs",
        defaultLayout: "main",
        layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"),
        partialsDir: path.join(process.cwd(), "src", "templates", "partials"),
      },
      viewPath: path.join(process.cwd(), "src", "templates", "views"),
      extName: ".hbs",
    };

    this.transporter.use("compile", hbs(hbsOptions));
  }

  public async sendMail<T extends EmailEnum>(
    type: T,
    to: string,
    context: EmailTemplateData[T],
  ): Promise<void> {
    const { subject, template } = emailConstants[type];
    context["frontUrl"] = config.FRONT_URL;
    const options = { to, subject, template, context };
    await this.transporter.sendMail(options);
  }
}

export const emailService = new EmailService();
