export type SelectPropertiesType<T, K extends keyof T> = {
  [P in K]-?: T[P];
};
