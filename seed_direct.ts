import { prisma } from "./lib/prisma";

async function main() {
  console.log("Seeding data using Prisma 5...");

  try {
    const customer = await prisma.customer.create({
      data: {
        name: "Rutuja Patil",
        email: "rutuja@example.com",
        phone: "9876543210",
        address: "Pune, Maharashtra",
      },
    });

    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-001-${Date.now()}`,
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

    console.log("✅ Seeding finished successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
