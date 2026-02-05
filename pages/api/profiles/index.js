const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const { orgId } = req.query;
    const profiles = await prisma.profile.findMany({
      where: orgId ? { orgId } : undefined,
      include: { links: true },
    });
    res.status(200).json({ profiles });
    return;
  }

  if (req.method === "POST") {
    const { userId, orgId, displayName, title, company, bio } = req.body || {};
    if (!userId || !orgId || !displayName) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const profile = await prisma.profile.create({
      data: { userId, orgId, displayName, title, company, bio },
    });
    res.status(201).json({ profile });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
