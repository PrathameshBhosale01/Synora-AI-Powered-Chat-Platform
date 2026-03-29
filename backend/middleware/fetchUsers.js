import jwt from 'jsonwebtoken';

const fetchUsers = (req, res, next) => {
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({ msg: "Access denied no auth token found" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "invalid token" });
    }
}
    
export default fetchUsers;