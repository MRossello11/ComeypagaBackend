const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // check if user is logged (has a role)
        if (!req?.session.userRole) return res.sendStatus(401);
        const rolesArray = [...allowedRoles];
        // check if the user's roles are sufficient
        const result = rolesArray.includes(req.session.userRole);
        if (!result) return res.sendStatus(401);
        // if everything is ok, go to next function
        next();
    }
}

module.exports = verifyRoles