const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    const orgs = await prisma.organization.findMany({
      include: { memberships: true },
    });
    res.status(200).json({ orgs });
    return;
  }

  if (req.method === "POST") {
    const { name } = req.body || {};
    if (!name) {
      res.status(400).json({ error: "Missing org name" });
      return;
    }

    const org = await prisma.organization.create({ data: { name } });
    res.status(201).json({ org });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
};
