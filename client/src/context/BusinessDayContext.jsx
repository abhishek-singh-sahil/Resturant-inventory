import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { getCurrentBusinessDay } from "../services/api";

const BusinessDayContext = createContext();

export const BusinessDayProvider = ({
  children,
}) => {
  const [businessDate, setBusinessDate] =
    useState("");

  const [lastRolloverAt, setLastRolloverAt] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const refreshBusinessDay =
    async () => {
      try {
        setLoading(true);

        const { data } =
          await getCurrentBusinessDay();
            console.log("Business Date from API:", data.currentBusinessDate);
        setBusinessDate(
          data.currentBusinessDate
        );

        setLastRolloverAt(
          data.lastRolloverAt
        );
      } catch (err) {
        console.error(
          "Business Day Error:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    refreshBusinessDay();
  }, []);

  return (
    <BusinessDayContext.Provider
      value={{
        businessDate,
        lastRolloverAt,
        loading,
        refreshBusinessDay,
      }}
    >
      {children}
    </BusinessDayContext.Provider>
  );
};

export const useBusinessDay = () =>
  useContext(BusinessDayContext);