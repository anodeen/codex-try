const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../../lib/prisma");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ error: "Missing credentials" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberships: true },
  });

  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const primaryOrg = user.memberships[0];
  const token = jwt.sign(
    {
      sub: user.id,
      orgId: primaryOrg?.orgId,
    },
    process.env.JWT_SECRET || "dev-secret",
    { expiresIn: "12h" }
  );

  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
};
