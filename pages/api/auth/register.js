const bcrypt = require("bcryptjs");
const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, password, name, orgName, userType } = req.body || {};
  if (!email || !password || !name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    res.status(409).json({ error: "User already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        passwordHash,
        name,
        userType: userType === "TEAM" ? "TEAM" : "INDIVIDUAL",
      },
    });

    const organization = await tx.organization.create({
      data: {
        name: orgName || `${name}'s workspace`,
        plan: "FREE",
        billingStatus: "TRIAL",
        memberships: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    await tx.profile.create({
      data: {
        userId: user.id,
        orgId: organization.id,
        displayName: name,
        title: "",
        company: "",
        bio: "",
      },
    });

    return { user, organization };
  });

  res.status(201).json({
    user: { id: result.user.id, email: result.user.email, name: result.user.name },
    organization: { id: result.organization.id, name: result.organization.name },
  });
};
