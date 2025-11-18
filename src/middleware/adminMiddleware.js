const jwt = require('jsonwebtoken');

function adminMiddleware(req, res, next) {
    if (req.user.role !== "adm"){
        return res.status(403).json({message: "Você não tem autorização!"});
    };

    next()
}

module.exports = adminMiddleware