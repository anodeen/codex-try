const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method === "POST") {
    const { profileId, type, metadata } = req.body || {};
    if (!profileId || !type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const event = await prisma.event.create({
      data: {
        profileId,
        type,
        metadata: metadata || undefined,
      },
    });
    res.status(201).json({ event });
    return;
  }

  if (req.method === "GET") {
    const { profileId } = req.query;
    const events = await prisma.event.findMany({
      where: profileId ? { profileId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ events });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
