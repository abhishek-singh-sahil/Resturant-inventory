import { performDayRollover } from "../services/dayRolloverService.js";

export const ensureTodayInventory = async (req, res, next) => {
  try {
    await performDayRollover();
    next();
  } catch (error) {
    next(error);
  }
};