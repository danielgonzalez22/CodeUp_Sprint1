const jwt = require('jsonwebtoken')

const authMiddleware = (role) => {
    return (req, res, next) => {
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json({ success: false, message: 'No token, authorization denied.' })
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decoded

            if (role && role !== req.user.role) {
                return res.status(403).json({ success: false, message: 'Forbidden: Access is denied.' })
            }

            next()
        } catch (error) {
            res.status(401).json({ success: false, message: 'Token is not valid.' })
        }
    }
}

module.exports = authMiddleware