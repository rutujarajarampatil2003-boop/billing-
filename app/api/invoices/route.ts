import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        customer: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("GET /api/invoices Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerId, items, status, dueDate } = body;

    if (!customerId || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const total = items.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        customerId,
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
        total,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: Number(item.quantity),
            price: Number(item.price),
            total: Number(item.quantity) * Number(item.price),
          })),
        },
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return NextResponse.json(invoice);
  } catch (error: any) {
    console.error("POST /api/invoices Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
