import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Seeding data via API...");

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

    return NextResponse.json({ message: "Seeding finished successfully" });
  } catch (error: any) {
    console.error("Seeding failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
