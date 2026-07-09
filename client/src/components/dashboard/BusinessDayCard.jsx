import {
  RotateCw,
  Clock3,
  ArrowRight,
  CheckCircle2,
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

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDay = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  const formatTime = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#012A36] via-[#014A5C] to-[#026A82] shadow-2xl">

      {/* Decorative Background */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"></div>

      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl"></div>

      <div className="relative p-8">

        {/* Header */}

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[4px] text-cyan-100/80">
              Business Day
            </p>

          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">

            <CheckCircle2
              size={16}
              className="text-green-300"
            />

            <span className="text-sm font-medium text-white">
              System Ready
            </span>

          </div>

        </div>

        {/* Date */}

        <div className="mt-10 text-center">

          <h1 className="text-5xl font-black tracking-tight text-white drop-shadow-lg">

            {loading
              ? "--"
              : formatDate(businessDate)}

          </h1>

          <p className="mt-2 text-lg font-medium text-cyan-100">

            {loading
              ? ""
              : formatDay(businessDate)}

          </p>

        </div>

        {/* Divider */}

        <div className="my-8 h-px bg-white/10"></div>

        {/* Bottom */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

          {/* Last Change */}

          <div>

            <div className="flex items-center gap-2">

              <Clock3
                size={18}
                className="text-yellow-300"
              />

              <span className="text-xs font-semibold uppercase tracking-[3px] text-cyan-100/70">

                Last Business Day Change

              </span>

            </div>

            <p className="mt-3 text-lg font-semibold text-white">

              {loading
                ? "--"
                : formatTime(lastRolloverAt)}

            </p>

            <p className="mt-2 max-w-md text-sm leading-6 text-cyan-100/75">

              Starting a new business day automatically carries forward today's closing stock as tomorrow's opening stock.

            </p>

          </div>

          {/* Button */}

          <div className="flex flex-col items-end">

            <button
              disabled={rolling}
              onClick={onNextDay}
              className="group flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-semibold text-[#012A36] shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >

              <RotateCw
                size={20}
                className={
                  rolling
                    ? "animate-spin"
                    : "transition-transform duration-300 group-hover:rotate-180"
                }
              />

              {rolling
                ? "Changing..."
                : "Start Next Business Day"}

              {!rolling && (
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              )}

            </button>

            <span className="mt-3 text-xs text-cyan-100/60">

              Admin access required

            </span>

          </div>

        </div>

      </div>

    </div>
  );
};

export default BusinessDayCard;