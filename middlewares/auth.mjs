import dotenv from 'dotenv';
dotenv.config();
const { JWT_SALT } = process.env;
import jwt from 'jsonwebtoken';


const tokenAuth = () => (req, res, next) => {
  console.log(`! token authorization running !`);
  console.log('Authenticating @ URL...', req.url);
  console.log(req.headers);
    try{
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];
      if (token == null) return res.sendStatus(401);

      const verifyToken = jwt.verify(token, JWT_SALT);
      console.log('TOKEN VERIFIEDDDDDD YASSSSSS!!!!');
      next();
    } catch(err){
        return res.sendStatus(403);
    }
}

export default tokenAuth;