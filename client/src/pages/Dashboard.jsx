import { useEffect, useState } from "react";

import {
  Package,
  ShoppingCart,
  ArrowRightLeft,
  ChefHat,
  Warehouse,
  UtensilsCrossed,
} from "lucide-react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import BusinessDayCard from "../components/dashboard/BusinessDayCard";
import InventoryCard from "../components/dashboard/InventoryCard";
import ActivityCard from "../components/dashboard/ActivityCard";
import ConfirmRolloverModal from "../components/dashboard/ConfirmRolloverModal";

import {
  getDashboardSummary,
  rolloverBusinessDay,
} from "../services/api";

import { useBusinessDay } from "../context/BusinessDayContext";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);

  const [rolling, setRolling] = useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);
const {
  businessDate,
  lastRolloverAt,
  refreshBusinessDay,
} = useBusinessDay();

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
const { data } =
  await getDashboardSummary();

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

  const handleNextDay =
    async () => {
      try {
        setRolling(true);

        await rolloverBusinessDay();

await refreshBusinessDay();

await loadDashboard();

setModalOpen(false);

        alert(
          "Business day changed successfully."
        );
      } catch (err) {
        alert(
          err.response?.data?.message ||
            "Unable to change business day."
        );
      } finally {
        setRolling(false);
      }
    };

  return (
    <>
      <ConfirmRolloverModal
        open={modalOpen}
        loading={rolling}
        onClose={() =>
          setModalOpen(false)
        }
        onConfirm={handleNextDay}
      />

      <div className="min-h-screen space-y-8 bg-[#F8FAFC] p-2">

        <DashboardHeader />

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">

            <BusinessDayCard
              businessDate={businessDate}
              lastRolloverAt={
                lastRolloverAt
              }
              loading={loading}
              rolling={rolling}
              onNextDay={() =>
                setModalOpen(true)
              }
            />

          </div>

          <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <h2 className="text-xl font-bold text-[#012A36]">
              Today's Activity
            </h2>

            <div className="mt-6 space-y-5">

              <ActivityCard
                title="Purchases"
                value={
                  summary.purchases
                }
                loading={loading}
                icon={ShoppingCart}
                color="text-green-600"
                bgColor="bg-green-100"
              />

              <ActivityCard
                title="Transfers"
                value={
                  summary.transfers
                }
                loading={loading}
                icon={
                  ArrowRightLeft
                }
                color="text-orange-600"
                bgColor="bg-orange-100"
              />

              <ActivityCard
                title="Consumptions"
                value={
                  summary.consumptions
                }
                loading={loading}
                icon={ChefHat}
                color="text-red-600"
                bgColor="bg-red-100"
              />

            </div>

          </div>

        </div>

        {/* Store Inventory */}

        <div>

          <div className="mb-6 flex items-center gap-3">

            <Warehouse
              className="text-[#012A36]"
              size={30}
            />

            <h2 className="text-2xl font-bold text-[#012A36]">

              Store Inventory

            </h2>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <InventoryCard
              title="Opening Stock"
              value={
                summary.store.opening
              }
              loading={loading}
              icon={Package}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            <InventoryCard
              title="Purchased"
              value={
                summary.store.purchased
              }
              loading={loading}
              icon={ShoppingCart}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              valueColor="text-green-600"
            />

            <InventoryCard
              title="Transferred"
              value={
                summary.store.transferred
              }
              loading={loading}
              icon={
                ArrowRightLeft
              }
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              valueColor="text-orange-600"
            />

            <InventoryCard
              title="Closing Stock"
              value={
                summary.store.closing
              }
              loading={loading}
              icon={Package}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              valueColor="text-purple-600"
            />

          </div>

        </div>
                {/* Kitchen Inventory */}

        <div>

          <div className="mb-6 flex items-center gap-3">

            <UtensilsCrossed
              className="text-[#012A36]"
              size={30}
            />

            <h2 className="text-2xl font-bold text-[#012A36]">
              Kitchen Inventory
            </h2>

          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            <InventoryCard
              title="Opening Stock"
              value={
                summary.kitchen.opening
              }
              loading={loading}
              icon={ChefHat}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />

            <InventoryCard
              title="Received"
              value={
                summary.kitchen.received
              }
              loading={loading}
              icon={
                ArrowRightLeft
              }
              iconBg="bg-green-100"
              iconColor="text-green-600"
              valueColor="text-green-600"
            />

            <InventoryCard
              title="Consumed"
              value={
                summary.kitchen.consumed
              }
              loading={loading}
              icon={ShoppingCart}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              valueColor="text-orange-600"
            />

            <InventoryCard
              title="Closing Stock"
              value={
                summary.kitchen.closing
              }
              loading={loading}
              icon={Package}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              valueColor="text-purple-600"
            />

          </div>

        </div>

      </div>

    </>
  );
};

export default Dashboard;