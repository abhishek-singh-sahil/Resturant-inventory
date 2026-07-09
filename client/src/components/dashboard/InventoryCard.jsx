const InventoryCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor = "text-[#012A36]",
  loading,
}) => {
  return (
    <div className="group rounded-3xl border border-[#E8ECF1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#012A36]/10 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#747293]">
            {title}
          </p>

          <h2
            className={`mt-4 text-4xl font-extrabold ${valueColor}`}
          >
            {loading ? "--" : value}
          </h2>

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconBg} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon
            size={30}
            className={iconColor}
          />
        </div>

      </div>

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-gray-100">

        <div
          className={`h-full rounded-full ${iconBg}`}
        />

      </div>

    </div>
  );
};

export default InventoryCard;