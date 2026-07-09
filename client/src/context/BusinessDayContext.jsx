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
const [
  previousBusinessDate,
  setPreviousBusinessDate,
] = useState("");

  const [lastRolloverAt, setLastRolloverAt] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const refreshBusinessDay =
    async () => {
      const token =
        localStorage.getItem("token");

      // Don't call API if user isn't logged in
      if (!token) {
        setBusinessDate("");
        setLastRolloverAt("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data } =
          await getCurrentBusinessDay();

        setBusinessDate(
          data.currentBusinessDate
        );
        setPreviousBusinessDate(
  data.previousBusinessDate
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

  previousBusinessDate,

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