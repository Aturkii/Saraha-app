
import jwt from 'jsonwebtoken';
import { userModel } from '../../db/models/user.model.js';


const authMiddleware = () => {
  return async (req, res, next) => {

    try {
      const { token } = req.headers;
      if (!token) {
        res.status(400).json({ message: "Token Not Found" });
      }
      if (!token.startsWith("ahmed__")) {
        res.status(400).json({ message: "Token Not Valid" });
      }
      const realToken = token.split("ahmed__")[1]
      const decoded = jwt.verify(realToken, "AhmedSecretKey")
      if (!decoded?.userId) {
        res.status(400).json({ message: "Invalid PayLoad" })
      }
      const user = await userModel.findOne({_id: decoded.userId});
      if (!user) {
        res.status(400).json({ message: "User Not found" })
      }``
      req.user = user;
      next()
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
export default authMiddleware;