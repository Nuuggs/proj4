/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import { throws } from 'assert';
import pkg from 'sequelize';

const { Op, sequelize } = pkg;

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

  async swipeUpdateCreate(req, res) {
    console.log('<------swipe update create------>');
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const {
      restaurant_id, player1_Identity, player2_Identity, session_id,
    } = req.body;
    console.log(restaurant_id); // works

    const newData = {
      restaurantId: restaurant_id,
      p1_like: null,
      p2_like: null,
    };

    console.log('newdata', newData);
    console.log('session id: ', session_id);

    console.log('FINDING BY PK');
    const findData = await this.db.Match.findByPk(session_id);
    console.log('findData', findData);
    console.log(findData.likesList);

    console.log('SEARCHING TO CHECK IF USER IS P1 or P2');
    const dbPlayer1Check = findData.p1Id;
    const dbPlayer2Check = findData.p2Id;
    console.log('this is Player1 ID from DB', dbPlayer1Check);
    console.log('this is Player2 ID from DB', dbPlayer2Check);

    // Conditional check if current player is p1 or p2, then update newData else return error
    if (player1_Identity == dbPlayer1Check) {
      console.log('Currrent player is p1');
      newData.p1_like = true;
    } else if (player1_Identity == dbPlayer2Check) {
      console.log('Currrent player is p2');
      newData.p2_like = true;
    } else {
      return res.status(404).send('Error\: Current player doesn\'t match any data');
    }

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

  async joinSession(req, res) {
    // Destructuring and converting to Number
    const {
      playerId, sessionId,
    } = req.body;
    // const numPlayerId = Number(playerId);
    // const numSessionId = Number(sessionId);

    console.log('FINDING BY PK');
    const findSession = await this.db.Match.findByPk(sessionId);

    console.log('Sending back joinSession data to frontend');
    res.status(200).send({ createdDB: findSession });
  }

  async swipeUpdateJoin(req, res) {
    console.log('<------swipe update join------>');
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const {
      restaurant_id, user_identity, session_id,
    } = req.body;
    console.log(restaurant_id); // works
    console.log(user_identity); // works

    const newData = {
      restaurantId: restaurant_id,
      p1_like: null,
      p2_like: null,
    };

    console.log('newdata', newData);
    console.log('session id: ', session_id);

    console.log('FINDING BY PK');
    const findData = await this.db.Match.findByPk(session_id);
    // console.log('findData', findData);
    // console.log(findData.likesList);

    console.log('SEARCHING TO CHECK IF USER IS P1 or P2');
    const dbPlayer1Check = findData.p1Id;
    const dbPlayer2Check = findData.p2Id;
    console.log('this is Player1 ID from DB', dbPlayer1Check);
    console.log('this is Player2 ID from DB', dbPlayer2Check);

    console.log('SEARCH IF EXISTING RESTAURANT_ID EXIST IN LIKES_LIST');

    const findExistingRestaurant = await this.db.Match.sequelize.query(`SELECT * FROM match WHERE restaurantId=${session_id} AND json::text LIKE '${restaurant_id}'`);

    // ({
    //   include: [{
    //     id: session_id,
    //     // where: sequelize.literal("SELECT p1_id FROM matches ")
    //   }]
    // })

    console.log('findExistingRestaurant query :', findExistingRestaurant);

    // Conditional check if current player is p1 or p2, then update newData else return error
    if (user_identity == dbPlayer1Check) {
      console.log('Currrent player is p1');
      newData.p1_like = true;
    } else if (user_identity == dbPlayer2Check) {
      console.log('Currrent player is p2');
      newData.p2_like = true;
    } else {
      return res.status(404).send('Error\: Current player doesn\'t match any data');
    }

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

/**
 * Raw SQL query
 *
 *  SELECT * FROM matches WHERE
 *
 *
 *  */
