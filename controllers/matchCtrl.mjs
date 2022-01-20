import dotenv from 'dotenv';
import { resolve } from 'path';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

class MatchCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  createSession(req, res) {
    // placeHolder to perform a get request
    console.log('to get lat & lng and insert into DB ');
  }
}

export default MatchCtrl;
