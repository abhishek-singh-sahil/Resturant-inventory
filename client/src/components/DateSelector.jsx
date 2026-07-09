import { CalendarDays } from "lucide-react";
import { useMemo, useRef } from "react";

const DateSelector = ({
  selectedDate,
  onChange,
}) => {
  const inputRef = useRef(null);

  const businessDate = useMemo(() => {
    if (!selectedDate) return new Date();

    return new Date(selectedDate);
  }, [selectedDate]);

  const dates = useMemo(() => {
    const list = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date(businessDate);

      date.setDate(date.getDate() - i);

      list.push(date);
    }

    return list;
  }, [businessDate]);

  const formatValue = (date) =>
    date.toISOString().split("T")[0];

  const formatDay = (date) =>
    date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const formatWeekday = (date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "short",
    });

  const isBusinessDay = (date) =>
    formatValue(date) === selectedDate;

  return (
    <div className="flex flex-wrap items-center gap-3">

      {dates.map((date) => {
        const value = formatValue(date);

        const active =
          value === selectedDate;

        return (
          <button
            key={value}
            onClick={() =>
              onChange(value)
            }
            className={`min-w-[82px] rounded-xl border px-4 py-3 transition-all ${
              active
                ? "border-[#0A3A4A] bg-[#E8F4F8] text-[#0A3A4A] shadow-sm"
                : "border-[#E5E7EB] bg-white hover:bg-[#F8F8F8]"
            }`}
          >
            <div className="text-xl font-bold">
              {formatDay(date)}
            </div>

            <div className="text-sm text-gray-500">
              {isBusinessDay(date)
                ? "Today"
                : formatWeekday(date)}
            </div>
          </button>
        );
      })}

      <button
        onClick={() =>
          inputRef.current?.showPicker()
        }
        className="flex min-w-[90px] flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 hover:bg-[#F8F8F8]"
      >
        <CalendarDays
          size={22}
          className="mb-1 text-[#0A3A4A]"
        />

        <span className="text-sm">
          Calendar
        </span>
      </button>

      <input
        ref={inputRef}
        type="date"
        value={selectedDate}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="hidden"
      />

    </div>
  );
};

export default DateSelector;