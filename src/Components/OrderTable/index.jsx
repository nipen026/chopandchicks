"use client";

import Image from "next/image";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const orders = [
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "Completed", payment: "PhonePe", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "Cancelled", payment: "UPI", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "Cancelled", payment: "UPI", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "Completed", payment: "Cash", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "Cancelled", payment: "PhonePe", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "In Progress", payment: "UPI", amount: "$212.50" },
  { id: "1010246", date: "09:09 AM, 10-10-2025", products: 2, status: "In Progress", payment: "PhonePe", amount: "$212.50" },
];

const statusStyles = {
  Completed: "bg-white text-green-600 border-[#26953E]",
  Cancelled: "bg-white text-red-500 border-red-300",
  "In Progress": "bg-white text-orange-500 border-orange-300",
};

const paymentStyles = {
  PhonePe: "bg-[#5441C321] text-purple-600",
  UPI: "bg-[#AE422921] text-orange-500",
  Cash: "bg-[#1AB75921] text-green-600",
};

export default function OrderTable() {
  return (
    <div className="bg-white w-full rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-red-500">
          Profile Settings
        </h2>

        <button className="border border-primary px-4 py-1.5 rounded-full text-sm text-primary flex items-center gap-2 hover:bg-gray-50">
          Sort By
          <span className="text-xs"><MdOutlineKeyboardArrowDown /></span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-spacing-y-4 text-sm">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-3 font-medium text-left">Order ID</th>
              <th className="py-3 font-medium text-left">Products</th>
              <th className="py-3 font-medium text-left">Status</th>
              <th className="py-3 font-medium text-left">Payment Method</th>
              <th className="py-3 font-medium text-left">Amount</th>
              <th className="py-3 font-medium text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, i) => (
              <tr
                key={i}
                className="border-b last:border-none hover:bg-gray-50 transition"
              >
                {/* Order ID */}
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/assets/product.jpg" // replace with your image
                      alt="product"
                      width={40}
                      height={40}
                      className="rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {order.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.date}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Products */}
                <td className="py-4 text-gray-500">
                  {order.products} Product
                </td>

                {/* Status */}
                <td className="py-4">
                  <span
                    className={`px-3 py-1 w-[130px] rounded-lg text-xs border font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Payment */}
                <td className="py-4">
                  <span
                    className={`px-4 py-1 rounded-full text-xs font-medium ${paymentStyles[order.payment]}`}
                  >
                    {order.payment}
                  </span>
                </td>

                {/* Amount */}
                <td className="py-4 font-medium text-gray-700">
                  {order.amount}
                </td>

                {/* Action */}
                <td className="py-4  text-center">
                  <button className="w-6 h-6 btn-gradient text-white rounded-full ">
                    i
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
        <p>Showing 1 to 4 of 20 results</p>

        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-full btn-gradient text-white">
            1
          </button>
          <button className="w-7 h-7 rounded-full border border-primary">2</button>
          <span>...</span>
          <button className="w-7 h-7 rounded-full border border-primary">5</button>
        </div>
      </div>
    </div>
  );
}
