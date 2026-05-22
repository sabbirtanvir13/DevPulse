export const isMaintainer = (req: any, res: any, next: any) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (user.role !== "maintainer") {
    return res.status(403).json({ message: "Only maintainer allowed" });
  }

  next();
};