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
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${cuisine}&rankby=prominence`;

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

      res.status(200).json({ existingSession });
    } catch (err) { console.log(err); }
  }

  async swipeUpdate(req, res) {
    console.log('POST Request: /match/swipe');
    // Request.body = {restaurant_ID: integer, playerID, player1/player2 }
    const {
      userId,
      sessionId,
      restaurant, // current restaurant object
      restaurantCardIndex,
    } = req.body;

<<<<<<< HEAD
    // Initiate isLastCard boolean
    // TinderCards frontend npm reads restaurantCards array from 19 to 0, hence last card's index is 0
    let isLastCard = false;
    if (restaurantCardIndex === 0) {
      isLastCard = true;
    }

    console.log(`<======= C H E C K  L A S T  C A R D ======> 
    is this the last card? ${isLastCard} card index: ${restaurantCardIndex}`);

    // Find current session in order to update it during each swipe
    const currentSession = await this.model.findByPk(sessionId);
=======
    let transaction;
    try {
      transaction = await this.db.sequelize.transaction(); // Starting new transation
      const currentSession = await this.model.findByPk(sessionId, { transaction });
>>>>>>> 1c3c2e00db7a6896438175adcd81d1b8bc318f51

      // To check content of likesList before updating logic to either push existing restaurant data to card or update frontend it's a match

<<<<<<< HEAD
    const { match } = currentSession.likesList;

    if (match === true) {
      const { matchedRestaurant } = currentSession.likesList;
      console.log('<<<<<< M A T C H E D  R E S T O >>>>>>', matchedRestaurant);
      return res.status(200).json({ match, matchedRestaurant });
    }

    // Destructure likesList from currentSession to update it according to swipe info
    const { likesList: updatedLikesList } = currentSession;

    // If this is the final card, push userId into last_card column
    // Session Page will check this when user logs in again
    if (isLastCard === true) {
      // If user is first to hit last card
      if (!currentSession.lastCard) {
        console.log('<====== LAST CARD ======>');
        const outOfCardsPlayers = [userId];
        const sessionOutOfCards = await this.model.update({ lastCard: { outOfCardsPlayers } }, {
          where: { id: sessionId },
        });
        console.log('<===== UPDATED DB =====>', sessionOutOfCards);
      } else if (currentSession.lastCard) {
        // If user is second to hit last card, lastCard column would already have prior info
        const { outOfCardsPlayers: updatedOutOfCardsPlayers } = currentSession.lastCard;
        updatedOutOfCardsPlayers.push(userId);
        const sessionOutOfCards = await this.model.update({ lastCard: { outOfCardsPlayers: updatedOutOfCardsPlayers } }, {
          where: { id: sessionId },
        });
      }
    }
=======
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

      // If nothing in likes list... transaction added!
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
        }, { transaction }); // part of transaction!!
        console.log('OOOOOOOOOOO LIKES LIST UPDATED OOOOOOOOOO');

        await transaction.commit(); // commit transaction before return

        return res.status(200).json({ updatedSession });
      }
>>>>>>> 1c3c2e00db7a6896438175adcd81d1b8bc318f51

      // If restaurant is already in like list, means that match is found! Transaction Added!
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
            }, { transaction });

            // Handle success
            console.log('matchedSession updated in db', matchedSession);
            await transaction.commit(); // commit transaction before return
            // send name instead of restaurantId
            return res.status(200).json({ match: true, matchedRestaurant: restaurant });
          } if (updatedLikesList[i].likes.length < 2) {
            console.log('<=== NO MATCH ===>');
            await transaction.commit(); // commit transaction before return
            return res.status(200).json({ match: false });
          }
        }
      }

<<<<<<< HEAD
    // If restaurant is already in like list
    // For loop needs updatedLikesList.length > 0
    if (updatedLikesList.length !== 0) {
      for (let i = 0; i < updatedLikesList.length; i += 1) {
        if (
          updatedLikesList[i].restaurant_id === restaurant.place_id) {
          updatedLikesList[i].likes.push(userId);

          // If there is a match
          if (updatedLikesList[i].likes.length === 2) {
            console.log('////// MATCH /////');

            // Replace entire likes list of session with {match: true}
            // so that when user opens session page in future, this session will be deleted
            await this.model.update({
              likesList: {
                match: true,
                matchedRestaurant: restaurant,
              },
            }, {
              where: {
                id: sessionId,
              },
            });
            // If match: true, isLastCard: doesn't matter
            return res.status(200).json({ match: true, matchedRestaurant: restaurant, isLastCard });
          }
          console.log('<=== NO MATCH ===>');

          // If match: false, isLastCard: true/false
          return res.status(200).json({ match: false, isLastCard });
        }
      }
    }

    // else if restaurant is not yet in likes list
    updatedLikesList.push({
      restaurant_id: restaurant.place_id,
      likes: [userId],
      dislikes: [],
    });

    const updatedSession = await this.model.update({ likesList: updatedLikesList },
      { where: { id: sessionId } });

    // if match: false, isLastCard: true/false
    return res.status(200).json({ updatedSession, isLastCard });
=======
      // else if restaurant is not yet in likes list, update likesList. Added Transaction!
      updatedLikesList.push({
        restaurant_id: restaurantId,
        likes: [userId],
        dislikes: [],
      });
      const updatedSession = await this.model.update({ likesList: updatedLikesList },
        { where: { id: sessionId } }, { transaction });
      console.log('OOOOOOOOOOO LIKES LIST UPDATED OOOOOOOOOO');
      await transaction.commit(); // commit transaction before return
      return res.status(200).json({ updatedSession });
    } catch (err) {
      console.log('error: ', err);
      if (transaction) {
        await transaction.rollback();
      }
    }
>>>>>>> 1c3c2e00db7a6896438175adcd81d1b8bc318f51
  }

  async swipeLeft(req, res) {
    const { sessionId, userId, restaurantCardIndex } = req.body;

    // Initiate isLastCard boolean
    let isLastCard = false;
    if (restaurantCardIndex === 0) {
      isLastCard = true;
    }

    console.log('<=== LEFT: LAST CARD ===>', isLastCard);

    const currentSession = await this.model.findByPk(sessionId);

    // Return match false if likeList is empty
    if (!currentSession.likesList) {
      return res.status(200).json({ match: false, isLastCard });
    }

    const { match } = currentSession.likesList;

    if (match === true) {
      const { matchedRestaurant } = currentSession.likesList;
      console.log('<<<<<< L E F T  S W I P E  M A T C H E D  R E S T O >>>>>>', matchedRestaurant);
      return res.status(200).json({ match, matchedRestaurant, isLastCard });
    }

    // If this is the final card, push userId into last_card column
    // Session Page will check this when user logs in again
    if (isLastCard === true) {
      // If user is first to hit last card
      if (!currentSession.lastCard) {
        console.log('<====== LAST CARD ======>');
        const outOfCardsPlayers = [userId];
        const sessionOutOfCards = await this.model.update({ lastCard: { outOfCardsPlayers } }, {
          where: { id: sessionId },
        });
        console.log('<===== UPDATED DB =====>', sessionOutOfCards);
      } else if (currentSession.lastCard) {
        // If user is second to hit last card, lastCard column would already have prior info
        const { outOfCardsPlayers: updatedOutOfCardsPlayers } = currentSession.lastCard;

        updatedOutOfCardsPlayers.push(userId);

        await this.model.update({ lastCard: { outOfCardsPlayers: updatedOutOfCardsPlayers } }, {
          where: { id: sessionId },
        });
      }
    }

    return res.status(200).json({ match: false, isLastCard });
  }
}

export default MatchCtrl;
