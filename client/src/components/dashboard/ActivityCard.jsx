const ActivityCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  loading,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[#E8ECF1] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Decorative Background */}
      <div
        className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${bgColor} opacity-20 transition-all duration-300 group-hover:scale-125`}
      />

      <div className="relative flex items-center justify-between">

        <div>

          <p className="text-sm font-medium text-[#747293]">
            {title}
          </p>

          <h2
            className={`mt-4 text-5xl font-extrabold ${color}`}
          >
            {loading ? "--" : value}
          </h2>

        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${bgColor}`}
        >
          <Icon
            size={30}
            className={color}
          />
        </div>

      </div>

      <div className="relative mt-8">

        <div className="h-2 w-full rounded-full bg-gray-100">

          <div
            className={`h-full w-3/4 rounded-full ${bgColor}`}
          />

        </div>

      </div>

    </div>
  );
};

export default ActivityCard;