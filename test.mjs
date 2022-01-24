import db from './models/index.mjs';
import {Sequelize} from 'sequelize';
let sequelize;

sequelize = new Sequelize;

seuqlieze.transaction()
(function (t) {
  console.log(t);
  return Match.create({
    p1_id: 4,
    p2_id: 2,
  }, {transaction: t}).then(function (match) {
    return console.log(match);
  }, {transaction: t});

})