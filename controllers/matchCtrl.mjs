/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

class MatchCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  async createSession(req, res) {
    console.log('POST Request: /match');
    console.log('req.body', req.body);
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    console.log('to get lat & lng and insert into DB ');
    // Destructure params from front end
    const {
      currentUserId, partner, coordinates, cuisine, dateTime, price, rating,
    } = req.body;
    const { lat } = coordinates;
    const { lng } = coordinates;
    const userId = Number(currentUserId);
    const partnerUserId = Number(partner);
    // console.log('coordinates', coordinates);
    // console.log('partner user ID', partnerUserId);

    // console.log('lat', lat);
    // console.log('lng', lng);
    // console.log('currentUserId', currentUserId);
    // console.log('partner:', partner);

    // Get URL request to google for nearby places Data
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=${cuisine}`;

    // response from google api
    const response = await axios.get(url);

    const searchResults = response.data;

    const initLikesList = [];

    const createSession = await this.model.create({
      p1Id: userId,
      p2Id: partnerUserId,
      // eslint-disable-next-line quote-props
      parameters: {
        url, cuisine, dateTime, price, rating,
      },
      searchResults,
      likesList: initLikesList,
    });

    res.status(200).send({ createdDB: createSession });
  }

  async swipeUpdate(req, res) {
    console.log('<------swipe update------>');
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const {
      restaurant_id, player1_Identity, player2_Identity, session_id,
    } = req.body;
    console.log(restaurant_id); // works

    const p1Id = Number(player1_Identity);
    const p2Id = Number(player2_Identity);

    console.log('p1Id:', p1Id); // what are these for??
    console.log('p2Id:', p2Id);

    const newData = {
      restaurantId: restaurant_id,
      p1_like: null,
      p2_like: null,
    };

    if (player1_Identity == 'p1') {
      newData.p1_like = true;
    } else {
      newData.p2_like = true;
    }

    console.log('newdata', newData);
    console.log('session id: ', session_id);

    console.log('FINDING BY PK');
    const findData = await this.db.Match.findByPk(session_id);
    console.log('findData', findData);
    console.log(findData.likesList);
    const dbLikesList = findData.likesList;
    const updatedLikesList = [...dbLikesList, newData];
    // dbLikesList.push(newData);
    console.log('updated likes list: ', updatedLikesList);

    console.log('UPDATING ');
    await this.db.Match.update(
      {
        likesList: updatedLikesList,
      },
      {
        where: {
          id: findData.id,
        },
      },
    );

    res.status(200).send({ restaurantId: restaurant_id });
  }
}

export default MatchCtrl;
