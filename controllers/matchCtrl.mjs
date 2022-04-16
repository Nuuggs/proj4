/* eslint-disable class-methods-use-this */
import dotenv from 'dotenv';
import axios from 'axios';

// Initialize dotenv to pull secrets for salting process
dotenv.config();

/**
 * Controller used for match functionality in the app
 * @constructor
 * @param {string} name - the name of the controller (used to check that the controller was running during setup)
 * @param {object} model - Match.db for ease of access to the model
 * @param {object} db - to access other models if necessary
 */
class MatchCtrl {
  constructor(name, model, db) {
    this.name = name;
    this.model = model;
    this.db = db;
  }

  /**
   * function to create a new matching session between two users when a user submits the search form
   * @param {*} req.body to get user and search parameters from the front-end
   * @param {*} res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
  async createSession(req, res) {
    console.log('POST Request: /match');
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Destructure params from front end
    const {
      currentUserId, partner, coordinates, cuisine, dateTime, price, radius,
    } = req.body;
    const { lat, lng } = coordinates;

    const userId = Number(currentUserId);
    const partnerUserId = Number(partner);

    // Get URL request to google for nearby places Data
    const url = `http://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${apiKey}&location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${cuisine}&rankby=prominence`;

    const response = await axios.get(url); // this is the response of the search query using the url
    const searchResults = response.data;

    // Verification. Check if search results = zero. Then do not store item in DB and render text at front end. No results
    const searchResultsCheck = response.data.status;
    if (searchResultsCheck === 'ZERO_RESULTS') return res.status(200).send('ZERO RESULTS');

    // Initialize an array to be stored as part of the new session
    const likesList = [];
    // Create a new session in the database
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

    // Sends the new session to the front-end as a response
    res.status(200).send({ newSession });
  }

  /**
   * Function to find an existing matching session between two users when user logs in
   * @param {*} req.body to get user data from the front-end
   * @param {*} res to return the status codes and back-end data
   * @returns the appropriate responses from the backend
   */
  async findSession(req, res) {
    console.log('PUT Request: /match/session/:sessionId');

    try {
      // sessionId from params is a string, store as a number
      const sessionId = Number(req.params.sessionId);
      const { userId } = req.body;

      // Find session in match table by pk
      const existingSession = await this.model.findByPk(sessionId);
      console.log('Existing session found!');

      // Check if existing session is a completed match session
      const { match, informedUsers: updatedInformedUsers, matchedRestaurant } = existingSession.likesList;
      if (match === true) {
        updatedInformedUsers.push(userId);
        // When match is true, update the db accordingly
        await this.model.update({
          likesList: {
            match: true,
            matchedRestaurant,
            informedUsers: updatedInformedUsers,
          },
        }, {
          where: {
            id: sessionId,
          },
        });
        // Send the matched restaurant back to the front-end
        return res.status(200).json({ match, matchedRestaurant });
      }
      // Else return restaurant data for user to swipe
      res.status(200).json({ existingSession });
    } catch (err) { console.log(err); }
  }

  /**
   * Function to update the database with each right swipe (user likes a specific restaurant)
   * @param {*} req.body to get user and search parameters from the front-end
   * @param {*} res to return the status codes and back-end data, updating front-end accordingly
   * @returns the appropriate responses from the backend
   */
  async swipeUpdate(req, res) {
    console.log('POST Request: /match/swipe');
    const {
      userId,
      sessionId,
      restaurant, // current restaurant object
      restaurantCardIndex,
    } = req.body;

    // Initiate isLastCard boolean
    // TinderCards frontend npm reads restaurantCards array from 19 to 0, hence last card's index is 0
    let isLastCard = false;
    if (restaurantCardIndex === 0) {
      isLastCard = true;
    }
    // Initialize transaction outside the try catch block to store sequelize transaction
    let transaction;
    try {
      // sequelize transaction to ensure that data from the front-end does not clash and overwrite each other when there are multiple users
      transaction = await this.db.sequelize.transaction();

      // Find current session in order to update it during each swipe
      const currentSession = await this.model.findByPk(sessionId, { transaction });

      // To check content of likesList before updating logic to either push existing restaurant data to card or update frontend it's a match
      const { match } = currentSession.likesList;
      if (match === true) {
        const { matchedRestaurant, informedUsers: updatedInformedUsers } = currentSession.likesList;
        updatedInformedUsers.push(userId);

        // Update informedUsers
        await this.model.update({
          likesList: {
            match: true,
            matchedRestaurant: restaurant,
            informedUsers: updatedInformedUsers,
          },
        }, {
          where: {
            id: sessionId,
          },
        }, { transaction });

        await transaction.commit();
        // Sends the matched restaurant back to the front-end
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
          await this.model.update({ lastCard: { outOfCardsPlayers } }, {
            where: { id: sessionId },
          }, { transaction });
        } else if (currentSession.lastCard) {
          // If user is second to hit last card, lastCard column would already have prior info
          const { outOfCardsPlayers: updatedOutOfCardsPlayers } = currentSession.lastCard;
          updatedOutOfCardsPlayers.push(userId);
          await this.model.update({ lastCard: { outOfCardsPlayers: updatedOutOfCardsPlayers } }, {
            where: { id: sessionId },
          }, { transaction });
        }
      }

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
                  informedUsers: [userId],
                },
              }, {
                where: {
                  id: sessionId,
                },
              }, { transaction });
              // If match: true, isLastCard: doesn't matter
              await transaction.commit();
              return res.status(200).json({ match: true, matchedRestaurant: restaurant, isLastCard });
            }
            console.log('<=== NO MATCH ===>');

            // If match: false, isLastCard: true/false
            await transaction.commit();
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
        { where: { id: sessionId } }, { transaction });

      // if match: false, isLastCard: true/false
      await transaction.commit();
      return res.status(200).json({ updatedSession, isLastCard });
    } catch (err) {
      // Within the catch block, log whatever error comes up and rollback the transaction beccause the process is not completed
      console.log('error: ', err);
      if (transaction) {
        await transaction.rollback();
      }
    }
  }

  /**
   * Function to update the database with each left swipe (user passes a specific restaurant)
   * Used to check for the last card on a left swipe.
   * @param {*} req.body to get user and session data from the front-end
   * @param {*} res to return the status codes and back-end data, updating front-end accordingly
   * @returns the appropriate responses from the backend
   */
  async swipeLeft(req, res) {
    console.log('POST request: /match/leftswipe');
    const { sessionId, userId, restaurantCardIndex } = req.body;

    // Initiate isLastCard boolean
    let isLastCard = false;
    if (restaurantCardIndex === 0) {
      isLastCard = true;
    }

    const currentSession = await this.model.findByPk(sessionId);
    // Return match false if likeList is empty
    if (!currentSession.likesList) {
      return res.status(200).json({ match: false, isLastCard });
    }

    const { match } = currentSession.likesList;
    if (match === true) {
      const { matchedRestaurant } = currentSession.likesList;
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
