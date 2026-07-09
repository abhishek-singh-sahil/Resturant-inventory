import SystemSettings from "../models/SystemSettings.js";
import {
  performDayRollover,
  initializeSystemSettings,
} from "../services/dayRolloverService.js";

/* -------------------------------------------------------------------------- */
/*                     GET CURRENT BUSINESS DATE                              */
/* -------------------------------------------------------------------------- */

export const getCurrentBusinessDay =
  async (req, res) => {
    try {
      const settings =
        await initializeSystemSettings();

      res.status(200).json({
  success: true,
  currentBusinessDate:
    settings.currentBusinessDate,

  previousBusinessDate:
    settings.previousBusinessDate,

  lastRolloverAt:
    settings.lastRolloverAt,
});
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch business day.",
      });
    }
  };

/* -------------------------------------------------------------------------- */
/*                     START NEXT BUSINESS DAY                                */
/* -------------------------------------------------------------------------- */

export const rolloverBusinessDay =
  async (req, res) => {
    try {
      const result =
        await performDayRollover(
          req.user._id
        );

      res.status(200).json({
        success: true,
        message: result.message,
        currentBusinessDate:
  result.businessDate,

previousBusinessDate:
  result.previousBusinessDate,
      });
    } catch (error) {
      console.error(error);

      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };