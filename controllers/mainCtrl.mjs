import dotenv from 'dotenv';
import { resolve } from 'path';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

// const { PW_SALT_ROUNDS, JWT_SALT } = process.env;

class MainCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  getMain (req, res) {
    console.log(`GET Request: /home`);
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile(resolve('dist', 'main.html'));
  };

  // async postRegister (req, res) {
  //   console.log(`POST Request: /main/register`);
  //   console.log(req.body);
  //   const { username, email, password } = req.body;
  //   if ( !username || !email || !password ) {
  //     return res.status(500).json({ msg: `registration error`});
  //   }
  //   const hash = await bcrypt.hash(password, Number(PW_SALT_ROUNDS));
  //   const newUser = await this.model.create({ username, email, password: hash });
  //   const payload = {id: newUser.id, email: newUser.email};
  //   const token = jwt.sign(payload, JWT_SALT, {expiresIn:'1h'});
  //   return res.status(200).json({newUser, token});
  // };

  // async postLogin (req, res) {
  //   console.log(`POST Request: /main/login`);
  //   console.log(req.body);
  //   const { username, password } = req.body;
  //   if (!username || !password) { return res.status(500).json({ msg: `login error` }) }
  //   const user = await this.model.findOne({where: {username}});
  //   if(!user){ return res.status(404).json({ msg: `user not found` })}
  //   const compare = await bcrypt.compare(password, user.password);
  //   if(compare){
  //     const payload = {id: user.id, username: user.username};
  //     const token = jwt.sign(payload, JWT_SALT, {expiresIn:'1h'});
  //     return res.status(200).json({success: true, token, id: user.id});
  //   }
  //   return res.status(401).json({ msg: `error: wrong password!` });
  // };

}

export default MainCtrl;