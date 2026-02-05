const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const { profileId } = req.query;
    const leads = await prisma.lead.findMany({
      where: profileId ? { profileId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ leads });
    return;
  }

  if (req.method === "POST") {
    const { profileId, name, email, phone, company, message } = req.body || {};
    if (!profileId || !name || !email) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const lead = await prisma.lead.create({
      data: { profileId, name, email, phone, company, message },
    });
    res.status(201).json({ lead });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
