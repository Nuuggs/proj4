/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import { resolve } from 'path';
import axios from 'axios';
import { Sequelize } from 'sequelize';

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
    const partnerUserId = Number(partner)
    console.log('coordinates', coordinates);
    console.log('partner user ID', partnerUserId);

    console.log('lat', lat);
    console.log('lng', lng);
    console.log('currentUserId', currentUserId)
    console.log('partner:', partner)


    // Get URL request to google for nearby places Data
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=2000&type=restaurant&keyword=${cuisine}`;

    const response = await axios.get(url);
    // console.log('response to gAPI', response);
    const searchResult = response.data;
    // console.log(searchResult);

    const initLikesList = [{ restaurant_id: 'null', likes: { p1_like: 'null', p2_like: 'null' } }];

    const createSession = await this.model.create({
      p1Id: userId,
      p2Id: partnerUserId,
      // eslint-disable-next-line quote-props
      parameters: {
        url, cuisine, dateTime, price, rating,
      },
      searchResults: searchResult,
      likesList: initLikesList,
    });

    res.status(200).send({ createdDB: createSession });
  }

  async swipeUpdate(req, res) {
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const { restaurant_ID, player_Identity } = req.body;
    console.log(restaurant_ID);
    console.log(player_Identity); // must show whether p1 or p2 and with userID
    const newData = {
      restaurant_id: restaurant_ID,
      p1_like: null,
      p2_like: null,
    };

    // Placeholder for player_identity
    if (player_Identity == 'p1') {
      newData.p1_like = true;
    } else {
      newData.p2_like = true;
    }
    console.log('newdata', newData);
    const findData = await this.db.Match.findAll({
      where: {
        p1Id: 7,
      },
    });

    //     likes_list: {
    //       restaurant_id: {
    //         [Op.eq]: restaurant_ID,
    //       },
    //     },
    //   },
    // });
    // if (!findData) {
    //   const createSwipe = await this.db.Match.update({

    //   });
    // }
    console.log('id test', findData[0].id);
    // console.log(typeof findData[0]);
    // console.log(JSON.stringify(findData[0]));
    console.log('findData[0] :', findData[0]);
    const resultSearch = findData[0];
    console.log('resultSearc', resultSearch);
    // const likeList = findData.match.likes_list;
    // const updatedList = [...likeList, newData];
    // console.log('UpdatedLIST', updatedList);
    // console.log('likeList', likeList);
    await this.db.Match.update({
      likes_list: newData,
    },
      {
        where: {
          id: findData[0].id,
        },
      });

    res.status(200).send({ restaurantID: restaurant_ID });
  }
}

export default MatchCtrl;
