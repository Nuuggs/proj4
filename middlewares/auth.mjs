import dotenv from 'dotenv';
dotenv.config();
const { JWT_SALT } = process.env;
import jwt from 'jsonwebtoken';


const tokenAuth = () => (req, res, next) => {
  console.log(req.url);
  console.log(`! token authorization running !`);
    try{
      console.log('request headers: ', req.headers);
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401);

      const verifyToken = jwt.verify(token, JWT_SALT);
      console.log('TOKEN VERIFIEDDDDDD YASSSSSS!!!!');
      console.log('Verified Token', verifyToken);
      next();
    } catch(err){
        return res.sendStatus(403);
    }
}

export default tokenAuth;