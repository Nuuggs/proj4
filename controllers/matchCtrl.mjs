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
    if (player_Identity == 1) {
      newData.p1_like = true;
    } else {
      newData.p2_like = true;
    }
    console.log('newdata', newData);
    const findData = await this.db.Match.findAll({
      where: {
        p1_id: 3,
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

  async getCard(req, res) {
    console.log('GET Request: /card');
    console.log(`Running ${this.name} controller`);
    res.status(200).sendFile(resolve('dist', 'main.html'));
  }
}

export default MatchCtrl;
