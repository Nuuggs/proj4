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
      if (token == null) return res.status(401).redirect('/home');

      const verifyToken = jwt.verify(token, JWT_SALT);
      console.log('TOKEN VERIFIEDDDDDD YASSSSSS!!!!');
      next();
    } catch(err){
        return res.status(403).redirect('/home');
    }
}

export default tokenAuth;