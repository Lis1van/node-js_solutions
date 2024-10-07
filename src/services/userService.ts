import { UploadedFile } from "express-fileupload";

import { FileItemTypeEnum } from "../enums/fileItemTypeEnum";
import { ApiError } from "../errors/apiError";
import { ITokenPayload } from "../interfaces/tokenInterface";
import { IUser } from "../interfaces/userInterface";
import { userRepository } from "../repositories/userRepository";
import { s3Service } from "./s3Service";

class UserService {
  public async getList(): Promise<IUser[]> {
    return await userRepository.getList();
  }

  public async getById(userId: string): Promise<IUser> {
    const user = await userRepository.getById(userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async getMe(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }
    return user;
  }

  public async updateMe(jwtPayload: ITokenPayload, dto: IUser): Promise<IUser> {
    return await userRepository.updateById(jwtPayload.userId, dto);
  }

  public async deleteMe(jwtPayload: ITokenPayload): Promise<void> {
    return await userRepository.deleteById(jwtPayload.userId);
  }

  public async uploadAvatar(
    jwtPayload: ITokenPayload,
    file: UploadedFile,
  ): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);

    const avatar = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      user._id,
    );
    const updatedUser = await userRepository.updateById(user._id, { avatar });
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return updatedUser;
  }

  public async deleteAvatar(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getById(jwtPayload.userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }

    return await userRepository.updateById(user._id, {
      avatar: null,
    });
  }
}

export const userService = new UserService();
