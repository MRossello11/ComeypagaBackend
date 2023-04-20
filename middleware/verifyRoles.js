const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.session.hasOwnProperty("userRole")) return res.sendStatus(401);

        const rolesArray = [...allowedRoles];
        const result = req.session.userRole.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.sendStatus(401);
        next();
    }
}

module.exports = { verifyRoles }