import { TrendingUp } from "lucide-react";

const StockCard = ({
  title,
  value,
  unit = "",
  icon: Icon,
  color = "#012A36",
  subtitle = "",
}) => {
  return (
    <div className="rounded-3xl border border-[#e3e3e9] bg-[#FDFCFA] p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#747293]">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-[#012A36]">
            {value}
            <span className="ml-1 text-base font-medium">{unit}</span>
          </h2>

          {subtitle && (
            <p className="mt-2 text-sm text-[#5F313B]">{subtitle}</p>
          )}
        </div>

        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${color}20` }}
        >
          {Icon ? (
            <Icon size={28} style={{ color }} />
          ) : (
            <TrendingUp size={28} style={{ color }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StockCard;