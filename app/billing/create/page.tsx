"use client";

import { useState } from "react";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateInvoice() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, price: 0 }]);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    (newItems[index] as any)[field] = value;
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((acc, item) => acc + (item.quantity * item.price), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. First, create/fetch customer (simplified for this demo)
      const customerRes = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: customerName }),
      });
      const customer = await customerRes.json();

      // 2. Create Invoice
      const invoiceRes = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          items: items.map(item => ({
            ...item,
            quantity: Number(item.quantity),
            price: Number(item.price)
          })),
          status: "PENDING"
        }),
      });

      if (invoiceRes.ok) {
        alert("✅ Invoice successfully save jhale ani History madhe add jhale!");
        router.push("/");
        router.refresh(); // Force refresh to show new data
      } else {
        const errorData = await invoiceRes.json();
        alert(`❌ Error: ${errorData.details || "Save karta aale nahi"}`);
      }
  };

  return (
    <main className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Create New Bill</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Customer Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-500 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter customer name"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold">Bill Items</h2>
              <button 
                type="button" 
                onClick={addItem}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add Item
              </button>
            </div>
            
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex flex-col sm:grid sm:grid-cols-12 gap-3 p-4 sm:p-0 border sm:border-0 border-zinc-100 dark:border-zinc-800 rounded-xl relative">
                  <div className="sm:col-span-6">
                    <label className="block text-xs text-zinc-500 mb-1">Description</label>
                    <input 
                      type="text" 
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                      placeholder="Service/Product name"
                      required
                    />
                  </div>
                  <div className="flex gap-3 sm:contents">
                    <div className="flex-1 sm:col-span-2">
                      <label className="block text-xs text-zinc-500 mb-1">Qty</label>
                      <input 
                        type="number" 
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                        min="1"
                      />
                    </div>
                    <div className="flex-1 sm:col-span-3">
                      <label className="block text-xs text-zinc-500 mb-1">Price (₹)</label>
                      <input 
                        type="number" 
                        value={item.price}
                        onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeItem(index)}
                    className="absolute top-2 right-2 sm:static p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t flex justify-between items-center">
              <span className="text-xl font-bold text-zinc-900 dark:text-white">Total Amount:</span>
              <span className="text-2xl font-black text-blue-600">₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Invoice
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
