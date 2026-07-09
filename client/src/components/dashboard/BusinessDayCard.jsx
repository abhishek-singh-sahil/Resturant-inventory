import {
  CalendarDays,
  RotateCw,
  Clock3,
} from "lucide-react";

const BusinessDayCard = ({
  businessDate,
  lastRolloverAt,
  loading,
  rolling,
  onNextDay,
}) => {
  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#012A36] via-[#013E4F] to-[#025A73] p-8 text-white shadow-2xl">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left */}

        <div>

          <div className="flex items-center gap-3">

            <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">

              <CalendarDays size={32} />

            </div>

            <div>

              <p className="text-sm uppercase tracking-[4px] text-white/70">

                Current Business Day

              </p>

              <h2 className="mt-2 text-4xl font-extrabold">

                {loading
                  ? "--"
                  : formatDate(
                      businessDate
                    )}

              </h2>

            </div>

          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">

            <Clock3
              size={20}
              className="text-yellow-300"
            />

            <div>

              <p className="text-xs uppercase text-white/60">

                Last Day Change

              </p>

              <p className="font-medium">

                {loading
                  ? "--"
                  : formatTime(
                      lastRolloverAt
                    )}

              </p>

            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-col items-end gap-4">

          <button
            disabled={rolling}
            onClick={onNextDay}
            className="flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-bold text-[#012A36] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
          >

            <RotateCw
              className={
                rolling
                  ? "animate-spin"
                  : ""
              }
              size={22}
            />

            {rolling
              ? "Changing..."
              : "Start Next Day"}

          </button>

          <p className="max-w-xs text-right text-sm text-white/70">

            This will close today's inventory
            and create the next business day.

          </p>

        </div>

      </div>

    </div>
  );
};

export default BusinessDayCard;