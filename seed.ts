import "dotenv/config";
import { prisma } from "./lib/prisma";

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);
  console.log("Seeding data...");

  // Create a customer
  const customer = await prisma.customer.create({
    data: {
      name: "Rutuja Patil",
      email: "rutuja@example.com",
      phone: "9876543210",
      address: "Pune, Maharashtra",
    },
  });

  // Create an invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-001",
      customerId: customer.id,
      status: "PAID",
      total: 5500,
      items: {
        create: [
          { description: "Website Development", quantity: 1, price: 5000, total: 5000 },
          { description: "Hosting Setup", quantity: 1, price: 500, total: 500 },
        ],
      },
    },
  });

  // Create a pending invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: "INV-002",
      customerId: customer.id,
      status: "PENDING",
      total: 1200,
      items: {
        create: [
          { description: "Logo Design", quantity: 1, price: 1200, total: 1200 },
        ],
      },
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // We don't need to disconnect manually in this script as it will end,
    // but it's good practice.
  });
