import SystemSettings from "../models/SystemSettings.js";

export const getBusinessDate = async () => {
  let settings = await SystemSettings.findOne();

  if (!settings) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    settings = await SystemSettings.create({
      currentBusinessDate: today,
    });
  }

  const businessDate = new Date(
    settings.currentBusinessDate
  );

  businessDate.setHours(0, 0, 0, 0);

  return businessDate;
};

export const getSystemSettings =
  async () => {
    let settings =
      await SystemSettings.findOne();

    if (!settings) {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      settings =
        await SystemSettings.create({
          currentBusinessDate: today,
        });
    }

    return settings;
  };