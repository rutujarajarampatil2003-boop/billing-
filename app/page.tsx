import BillingDashboard from "@/components/BillingDashboard";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Billing Dashboard</h1>
            <p className="text-zinc-500 dark:text-zinc-400">Manage your customers and invoices efficiently.</p>
          </div>
        </header>

        <BillingDashboard />
      </div>
    </main>
  );
}
