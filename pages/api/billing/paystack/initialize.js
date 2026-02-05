const prisma = require("../../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { orgId, amount, currency } = req.body || {};
  if (!orgId || !amount) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const payment = await prisma.payment.create({
    data: {
      orgId,
      provider: "PAYSTACK",
      providerRef: `paystack_${Date.now()}`,
      amount,
      currency: currency || "USD",
      status: "PENDING",
    },
  });

  res.status(201).json({
    payment,
    checkoutUrl: "https://checkout.paystack.com/placeholder",
  });
};
