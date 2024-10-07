import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import path from "path";

import { config } from "../configs/config";
import { FileItemTypeEnum } from "../enums/fileItemTypeEnum";

class S3Service {
  constructor(
    private readonly client = new S3Client({
      region: config.AWS_S3_REGION,
      credentials: {
        accessKeyId: config.AWS_ACCESS_KEY,
        secretAccessKey: config.AWS_SECRET_KEY,
      },
    }),
  ) {}

  public async uploadFile(
    file: UploadedFile,
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string> {
    try {
      const filePath = this.buildPath(itemType, itemId, file.name);
      await this.client.send(
        new PutObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filePath,
          Body: file.data,
          ContentType: file.mimetype,
          ACL: config.AWS_S3_ACL,
        }),
      );
      return filePath;
    } catch (error) {
      console.error("Error upload: ", error);
      return null;
    }
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: config.AWS_S3_BUCKET_NAME,
          Key: filePath,
        }),
      );
    } catch (error) {
      console.error("Error delete: ", error.message);
    }
  }

  private buildPath(
    itemType: FileItemTypeEnum,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();
