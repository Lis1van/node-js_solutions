import dayjs, { ManipulateType } from "dayjs";

class TimeHelper {
  public getCurrentTime(value: number, unit: ManipulateType): Date {
    return dayjs().subtract(value, unit).toDate();
  }
  public parseConfig(val: string): { value: number; unit: ManipulateType } {
    const [value, unit] = val.split(" ");
    return { value: parseInt(value), unit: unit as ManipulateType };
  }
}

export const timeHelper = new TimeHelper();
