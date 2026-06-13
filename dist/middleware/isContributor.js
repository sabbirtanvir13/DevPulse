export const isContributor = (req, res, next) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "contributor") {
        return res.status(403).json({ message: "Only contributor allowed" });
    }
    next();
};
//# sourceMappingURL=isContributor.js.map