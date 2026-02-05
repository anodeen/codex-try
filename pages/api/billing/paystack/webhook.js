const prisma = require("../../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const payload = req.body || {};
  const { event, data } = payload;

  const webhookEvent = await prisma.webhookEvent.create({
    data: {
      provider: "PAYSTACK",
      eventType: event || "unknown",
      payload,
      orgId: data?.metadata?.orgId,
    },
  });

  if (event === "charge.success" && data?.metadata?.orgId) {
    await prisma.payment.updateMany({
      where: { providerRef: data?.reference },
      data: { status: "PAID" },
    });
  }

  res.status(200).json({ received: true, id: webhookEvent.id });
};
