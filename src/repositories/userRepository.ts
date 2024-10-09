import { FilterQuery, SortOrder } from "mongoose";

import { UserListOrderEnum } from "../enums/userListOrderEnum";
import { ApiError } from "../errors/apiError";
import { IUser, IUserListQuery } from "../interfaces/userInterface";
import { Token } from "../models/tokenModel";
import { User } from "../models/userModel";

class UserRepository {
  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    const filters: FilterQuery<IUser> = {
      // isVerified: true
    };
    if (query.search) {
      filters.name = { $regex: query.search, $options: "i" };
    }

    const sortObj: { [key: string]: SortOrder } = {};
    switch (query.orderBy) {
      case UserListOrderEnum.NAME:
        sortObj.name = query.order;
        break;
      case UserListOrderEnum.AGE:
        sortObj.age = query.order;
        break;
      case UserListOrderEnum.CREATED_AT:
        sortObj.createdAt = query.order;
        break;
      default:
        throw new ApiError("Invalid orderBy", 500);
    }

    const skip = query.limit * (query.page - 1);
    return await Promise.all([
      User.find(filters).sort(sortObj).limit(query.limit).skip(skip),
      User.countDocuments(filters),
    ]);
  }

  public async create(dto: Partial<IUser>): Promise<IUser> {
    return await User.create(dto);
  }

  public async getById(userId: string): Promise<IUser | null> {
    return await User.findById(userId).select("+password");
  }

  public async getByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    return await User.findByIdAndUpdate(userId, dto, { new: true });
  }

  public async deleteById(userId: string): Promise<void> {
    await User.deleteOne({ _id: userId });
  }

  public async findOldUsers(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      { $match: { tokens: { $size: 0 } } },
    ]);
  }
}

export const userRepository = new UserRepository();
