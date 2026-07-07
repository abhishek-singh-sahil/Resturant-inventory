import { useEffect, useState } from "react";

import {
  Package,
  ShoppingCart,
  ArrowRightLeft,
  ChefHat,
  Warehouse,
  UtensilsCrossed,
} from "lucide-react";

import { getDashboardSummary } from "../services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    purchases: 0,
    transfers: 0,
    consumptions: 0,

    store: {
      opening: 0,
      purchased: 0,
      transferred: 0,
      closing: 0,
    },

    kitchen: {
      opening: 0,
      received: 0,
      consumed: 0,
      closing: 0,
    },
  });

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const { data } = await getDashboardSummary();

      setSummary(data.summary);
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Unable to load dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-[#012A36]">
          Dashboard
        </h1>

        <p className="mt-2 text-[#747293]">
          Today's Restaurant Inventory Overview
        </p>
      </div>

      {/* Store Inventory */}

      <div>

        <div className="mb-5 flex items-center gap-3">

          <Warehouse
            size={28}
            className="text-[#012A36]"
          />

          <h2 className="text-2xl font-bold text-[#012A36]">
            Store Inventory
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <Package
              size={30}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Opening Stock
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[#012A36]">
              {loading ? "--" : summary.store.opening}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ShoppingCart
              size={30}
              className="text-green-600"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Purchased
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {loading ? "--" : summary.store.purchased}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ArrowRightLeft
              size={30}
              className="text-orange-600"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Transferred
            </p>

            <h3 className="mt-2 text-3xl font-bold text-orange-600">
              {loading ? "--" : summary.store.transferred}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <Package
              size={30}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Closing Stock
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[#012A36]">
              {loading ? "--" : summary.store.closing}
            </h3>

          </div>

        </div>

      </div>

      {/* Kitchen Inventory */}

      <div>

        <div className="mb-5 flex items-center gap-3">

          <UtensilsCrossed
            size={28}
            className="text-[#012A36]"
          />

          <h2 className="text-2xl font-bold text-[#012A36]">
            Kitchen Inventory
          </h2>

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ChefHat
              size={30}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Opening Stock
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[#012A36]">
              {loading ? "--" : summary.kitchen.opening}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ArrowRightLeft
              size={30}
              className="text-green-600"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Received
            </p>

            <h3 className="mt-2 text-3xl font-bold text-green-600">
              {loading ? "--" : summary.kitchen.received}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ShoppingCart
              size={30}
              className="text-orange-600"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Consumed
            </p>

            <h3 className="mt-2 text-3xl font-bold text-orange-600">
              {loading ? "--" : summary.kitchen.consumed}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <Package
              size={30}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Closing Stock
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[#012A36]">
              {loading ? "--" : summary.kitchen.closing}
            </h3>

          </div>

        </div>

      </div>

      {/* Today's Activity */}

      <div>

        <div className="mb-5">
          <h2 className="text-2xl font-bold text-[#012A36]">
            Today's Activity
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ShoppingCart
              size={32}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Purchases
            </p>

            <h3 className="mt-2 text-4xl font-bold text-[#012A36]">
              {loading ? "--" : summary.purchases}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ArrowRightLeft
              size={32}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Transfers
            </p>

            <h3 className="mt-2 text-4xl font-bold text-[#012A36]">
              {loading ? "--" : summary.transfers}
            </h3>

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <ChefHat
              size={32}
              className="text-[#012A36]"
            />

            <p className="mt-4 text-sm text-[#747293]">
              Consumptions
            </p>

            <h3 className="mt-2 text-4xl font-bold text-[#012A36]">
              {loading ? "--" : summary.consumptions}
            </h3>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;