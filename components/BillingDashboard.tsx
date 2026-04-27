"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  MoreVertical,
  Search
} from "lucide-react";

export default function BillingDashboard() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isDataValid = Array.isArray(invoices);

  const stats = [
    { 
      label: "Total Revenue", 
      value: `₹${isDataValid ? invoices.reduce((acc, inv) => acc + (inv.total || 0), 0).toLocaleString() : 0}`, 
      icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" 
    },
    { 
      label: "Pending Bills", 
      value: isDataValid ? invoices.filter(inv => inv.status === "PENDING").length : 0, 
      icon: Clock, color: "text-amber-600", bg: "bg-amber-50" 
    },
    { 
      label: "Active Customers", 
      value: isDataValid ? new Set(invoices.map(inv => inv.customerId)).size : 0, 
      icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" 
    },
    { 
      label: "Total Invoices", 
      value: isDataValid ? invoices.length : 0, 
      icon: FileText, color: "text-purple-600", bg: "bg-purple-50" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Invoices</h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input 
                type="text" 
                placeholder="Search bills..." 
                className="pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
              />
            </div>
            <a href="/billing/create" className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2 text-sm shadow-lg shadow-blue-500/20">
              <Plus className="w-4 h-4" />
              New Invoice
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Invoice No</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-4 h-16 bg-zinc-50/50 dark:bg-zinc-800/20"></td>
                  </tr>
                ))
              ) : !isDataValid || invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    {!isDataValid ? (
                      <div className="flex flex-col items-center gap-2">
                        <p>Database connection error.</p>
                        <button onClick={fetchInvoices} className="text-blue-500 underline text-sm">Retry Connection</button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4">
                        <p>No invoices found. Create your first one!</p>
                        <button 
                          onClick={async () => {
                            await fetch("/api/seed");
                            fetchInvoices();
                          }} 
                          className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg text-sm font-bold"
                        >
                          Seed Sample Data
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">{inv.invoiceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-zinc-900 dark:text-white">{inv.customer.name}</div>
                      <div className="text-xs text-zinc-500">{inv.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      ₹{inv.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        inv.status === "PAID" 
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-zinc-500" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
