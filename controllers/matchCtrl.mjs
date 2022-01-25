/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import { Sequelize, Op } from 'sequelize';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

class MatchCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  async createSession(req, res) {
    console.log('req.body', req.body);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    console.log('to get lat & lng and insert into DB ');
    // Destructure params from front end

    // To include p1_Id & p2_Id into destructuring later. Placeholder for creation first
    const p1_Id = 3;
    const p2_Id = 5;
    const {
      coordinates, cuisine, dateTime, partner, price, rating,
    } = req.body;
    const { lat } = coordinates;
    const { lng } = coordinates;
    console.log('coordinates', coordinates);

    console.log('lat', lat);
    console.log('lng', lng);

    // placeHolder to perform a get request store it and save in a const
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=chinese`;

    const response = await axios.get(url);
    // console.log('response to gAPI', response);
    const searchResult = response.data;
    console.log(searchResult);

    const initLikesList = { restaurant_id: 'null', likes: { p1_like: 'null', p2_like: 'null' } };

    const createSession = await this.model.create({
      p1_id: p1_Id,
      p2_id: p2_Id,
      // eslint-disable-next-line quote-props
      parameters: {
        URL: url, Cuisine: cuisine, DateTime: dateTime, Partner: partner, Price: price, Rating: rating,
      },
      search_results: searchResult,
      likes_list: initLikesList,
    });

    res.status(200).send({ createdDB: createSession });
  }

  async swipeUpdate(req, res) {
    const { restaurant_ID, player_Identity } = req.body;
    console.log(restaurant_ID);
    console.log(player_Identity);

    const findData = await this.db.Matches.findAll({
      where: {
        likes_list: {
          restaurant_id: {
            [Op.eq]: restaurant_ID,
          },
        },
      },
    });

    res.status(200).send({ restaurantID: restaurant_ID });
  }

  async getCard(req, res) {
    console.log('GET Request: /card');
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile(resolve('dist', 'main.html'));
  }
}

export default MatchCtrl;
