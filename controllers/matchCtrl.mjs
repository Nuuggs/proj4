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

    // Destructure params from front end
    const {
      currentUserId, partner, coordinates, cuisine, dateTime, price, radius,
    } = req.body;
    const { lat, lng } = coordinates;

    const userId = Number(currentUserId);
    const partnerUserId = Number(partner);

    // Get URL request to google for nearby places Data
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${cuisine}`;

    const response = await axios.get(url);

    const searchResults = response.data;

    // Check if search results = zero. Then do not store item in DB and render text at front end. No results
    console.log('SeARCH results from new api call', searchResults);
    const searchResultsCheck = response.data.status;
    if (searchResultsCheck === 'ZERO_RESULTS') return res.status(200).send('ZERO RESULTS');

    const likesList = [];

    const newSession = await this.model.create({
      p1Id: userId,
      p2Id: partnerUserId,
      // eslint-disable-next-line quote-props
      parameters: {
        url, cuisine, dateTime, price,
      },
      searchResults,
      likesList,
    });

    res.status(200).send({ newSession });
  }

  async findSession(req, res) {
    console.log('GET Request: /match/session/:sessionId');
    console.log('req params', req.params);

    try {
      // sessionId is a string
      const sessionPk = Number(req.params.sessionId);

      // Find session in match table by pk
      const existingSession = await this.model.findByPk(sessionPk);

      console.log('found exisitng session?', existingSession);

      // Check if existing session is a completed match session
      const { match } = existingSession.likesList;
      console.log('check if existingSession is a match', match);

      if (match === true) {
        const { matchedRestaurant } = existingSession.likesList;
        console.log('##### MATCH ##### this detected a match:true ');
        console.log('<<<<<< M A T C H E D  R E S T O >>>>>>', matchedRestaurant);
        return res.status(200).json({ match, matchedRestaurant });
      }
      // Else return restaurant data for user to swipe
      res.status(200).json({ existingSession });
    } catch (err) { console.log(err); }
  }

  async swipeUpdate(req, res) {
    console.log('POST Request: /match/swipe');
    console.log('<------swipe update------>');
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const {
      restaurantId,
      userId,
      p1Id,
      p2Id,
      sessionId,
      restaurant, // current restaurant object
    } = req.body;

    const currentSession = await this.model.findByPk(sessionId);

    // To check content of likesList before updating logic to either push existing restaurant data to card or update frontend it's a match

    const { match } = currentSession.likesList;
    console.log('RIGHT SWIPE: check return of session Like', match);

    if (match === true) {
      const { matchedRestaurant } = currentSession.likesList;
      console.log('##### MATCH ##### this detected a match:true ');
      console.log('<<<<<< M A T C H E D  R E S T O >>>>>>', matchedRestaurant);
      return res.status(200).json({ match, matchedRestaurant });
    }

    const { likesList: updatedLikesList } = currentSession;
    console.log('+++++++++++++++ current session likes list +++++++++++++++', updatedLikesList);

    // >>>>>> NEW likesList format <<<<<< //
    // [{
    // restaurant_id: blah-blah-numbers,
    // likes: [p1Id, p2Id],
    // dislikes: []
    // }]

    if (updatedLikesList.length === 0) {
      updatedLikesList.push({
        restaurant_id: restaurantId,
        likes: [userId],
        dislikes: [],
      });
      const updatedSession = await this.model.update({ likesList: updatedLikesList }, {
        where: {
          id: sessionId,
        },
      });
      console.log('OOOOOOOOOOO LIKES LIST UPDATED OOOOOOOOOO');
      return res.status(200).json({ updatedSession });
    }

    // If restaurant is already in like list
    for (let i = 0; i < updatedLikesList.length; i += 1) {
      if (updatedLikesList[i].restaurant_id === restaurantId) {
        console.log('updatedLikesList[i]', updatedLikesList[i]);
        console.log('updatedLikesList[i].likes', updatedLikesList[i].likes);
        updatedLikesList[i].likes.push(userId);
        if (updatedLikesList[i].likes.length === 2) {
          console.log('////// MATCH /////');

          // Replace entire likes list of session with {match: true}
          // so that when user opens session page in future, this session will be deleted
          const matchedSession = await this.model.update({ likesList: { match: true, matchedRestaurant: restaurant } }, {
            where: { id: sessionId },
          });

          // Handle success
          console.log('matchedSession updated in db', matchedSession);

          // send name instead of restaurantId
          return res.status(200).json({ match: true, matchedRestaurant: restaurant });
        } if (updatedLikesList[i].likes.length < 2) {
          console.log('<=== NO MATCH ===>');
          return res.status(200).json({ match: false });
        }
      }
    }
    // else if restaurant is not yet in likes list
    updatedLikesList.push({
      restaurant_id: restaurantId,
      likes: [userId],
      dislikes: [],
    });
    const updatedSession = await this.model.update({ likesList: updatedLikesList },
      { where: { id: sessionId } });
    console.log('OOOOOOOOOOO LIKES LIST UPDATED OOOOOOOOOO');
    return res.status(200).json({ updatedSession });
  }

  async swipeLeft(req, res) {
    const { sessionId } = req.body;
    console.log('<---- session id ---->', sessionId);
    const currentSession = await this.model.findByPk(sessionId);

    // Return match false if likeList is empty
    if (!currentSession.likesList) {
      return res.status(200).json({ match: false });
    }
    const { match } = currentSession.likesList;
    console.log('LEFT SWIPE: check return of session Like', match);

    if (match === true) {
      const { matchedRestaurant } = currentSession.likesList;
      console.log('##### MATCH ##### this detected a match:true ');
      console.log('<<<<<< L E F T  S W I P E  M A T C H E D  R E S T O >>>>>>', matchedRestaurant);
      return res.status(200).json({ match, matchedRestaurant });
    }
  }
}

export default MatchCtrl;
