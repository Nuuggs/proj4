import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import TinderCard from 'react-tinder-card';
import '../styles.scss';
import axios from 'axios';
import { Rating } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const RestaurantPage = ({
  appState, setAppState, appParams, sessionId, sessionType,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [localSessionId, setLocalSessionId] = useState();
  const [currentIndex, setCurrentIndex] = useState(restaurantCard.length - 1);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(async () => {
    console.log('This is running');

    // Require dummy variable to track appPreviousState - to track and run different post request.

    // This runs if previousState is joinSession
    if (sessionType === 'join') {
      console.log('<------Restaurant Card: Join Session------>');
      const getUserId = window.localStorage.getItem('userId');
      const data = {
        playerId: getUserId,
        sessionId, // this comes from globalState
      };
      // Do post request to get data stored in DB.
      const result = await axios.post('/join', data);
      console.log('THIS IS RETURN RESULT AFTER AXIOS POST', result);
      const restaurantData = result.data.createdDB.searchResults.results;
      setLocalSessionId(result.data.createdDB.id);

      // const currentUser = window.localStorage.getItem('userID');

      // // Set p2Id in localStorage as p1Id in DB since player join
      // localStorage.setItem('p2Id', result.data.createdDB.p1Id);

      setRestaurantCard([...restaurantData]);
      setLoading(false);
    } else if (sessionType === 'create') {
      // This runs if previousState is createSession
      console.log('<------Restaurant Card: Create Session------>');
      // THIS IS PARAMS FROM FORM
      console.log('App Params: ', appParams);
      const result = await axios.post('/match', appParams);
      console.log('THIS IS RETURN RESULT AFTER AXIOS POST', result);
      console.log(result.data.createdDB);
      console.log(result.data.createdDB.id);
      setLocalSessionId(result.data.createdDB.id);
      const restaurantData = result.data.createdDB.searchResults.results;
      // console.log('restaurantData[0].photos', restaurantData[0].photos); // works
      // console.log('restaurant[0].photos[0]', restaurantData[0].photos[0]); // works
      // console.log('restaurant[0].photos[0].photo_reference', restaurantData[0].photos[0].photo_reference); // works
      setRestaurantCard([...restaurantData]);
      setLoading(false);
    }

    // setCurrentIndex(restaurantData.length - 1);
  }, []);
  // console.log('restaurantCard: ', restaurantCard);

  const TinderCardsIfJoin = () => {
    console.log('this is tinder cards component');
    // console.log('restaurantCard: ', restaurantCard);
    // console.log(restaurantCard[0]);
    // console.log(restaurantCard[0].photos);
    // console.log(restaurantCard[0].photos[0]);
    // console.log(restaurantCard[0].photos[0].photo_reference);
    return (
      <>
        <div className="restaurantcontainer">
          {restaurantCard.map((restaurant) => (
            <TinderCard
              className="swipe"
              key={restaurant.place_id}
              id={restaurant.place_id}
              preventSwipe={['up', 'down']}
              onSwipe={(direction) => swipedIfJoin(direction, restaurant.place_id, restaurant.name)}
              onCardLeftScreen={() => outOfFrame(restaurant.name)}
            >
              <div className="resCard" style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${restaurant.photos[0].photo_reference}&key=${apiKey})` }}>
                <div className="caption-div">
                  <h2>{restaurant.name}</h2>
                  <Rating name="half-rating" defaultValue={restaurant.rating} precision={0.5} size="small" />
                  <h2>
                    out of
                    {' '}
                    {restaurant.user_ratings_total}
                    {' '}
                    reviews
                  </h2>

                </div>

              </div>
            </TinderCard>
          ))}
        </div>
        <div className="arrow-div">
          <div className="left-arrow">
            <ArrowBackIcon />
            <h2>This way to like</h2>
          </div>
          <div className="right-arrow">
            <h2>This way to dislike </h2>
            <ArrowForwardIcon />
          </div>
        </div>
        {/* <div className="cardsButtons">
          <IconButton className="clickButtons__left">
            <CloseIcon fontSize="large" />
          </IconButton>
          <IconButton className="clickButtons__right" onClick={() => swipedIfJoin(right, restaurant.place_id, restaurant.name)}>
            <FavoriteIcon fontSize="large" />
          </IconButton>
        </div> */}
      </>
    );
  };

  const TinderCardsIfCreate = () => {
    console.log('this is tinder cards component');
    // console.log('restaurantCard: ', restaurantCard);
    // console.log(restaurantCard[0]);
    // console.log(restaurantCard[0].photos);
    // console.log(restaurantCard[0].photos[0]);
    // console.log(restaurantCard[0].photos[0].photo_reference);
    return (
      <>
        <div className="restaurantcontainer">
          {restaurantCard.map((restaurant) => (
            <TinderCard
              className="swipe"
              key={restaurant.place_id}
              id={restaurant.place_id}
              preventSwipe={['up', 'down']}
              onSwipe={(direction) => swipedIfCreate(direction, restaurant.place_id, restaurant.name)}
              onCardLeftScreen={() => outOfFrame(restaurant.name)}
            >
              <div className="resCard" style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${restaurant.photos[0].photo_reference}&key=${apiKey})` }}>
                <h3>{restaurant.name}</h3>
                {/* <h3>{restaurant.rating}</h3>
              <p>{restaurant.vicnity}</p> */}
              </div>
            </TinderCard>
          ))}
        </div>
        <div className="cardsButtons">
          <IconButton className="clickButtons__left">
            <CloseIcon fontSize="large" />
          </IconButton>
          <IconButton className="clickButtons__right" onClick={() => swipedIfCreate(right, restaurant.place_id, restaurant.name)}>
            <FavoriteIcon fontSize="large" />
          </IconButton>
        </div>
      </>
    );
  };

  // Function to append to TinderCards swipe if 'create'
  const swipedIfCreate = async (direction, restaurantId, restaurantName) => {
    console.log('removing:', restaurantName);
    // setLastDirection(direction);
    console.log('swiped direction =', direction);
    console.log('restaurantId:', restaurantId);
    console.log('restaurant Card', restaurantCard);
    console.log('set restaurant Card', setRestaurantCard);
    if (direction === 'right') {
      console.log('its right');
      // If swiped direction is right - do a axios.post to DB to store data

      // dummy player identity (either p1 or p2) post to backend - to work on further with team

      const getUser1Id = window.localStorage.getItem('userId');
      const getUser2Id = localStorage.getItem('p2Id');
      console.log('userId local', getUser1Id);
      console.log('user2d local', getUser2Id);

      console.log('session id: ', localSessionId);
      const data = {
        restaurantId,
        player1_Identity: getUser1Id,
        player2_Identity: getUser2Id,
        session_id: localSessionId,
      };
      console.log('data: ', data);
      await axios.post('/swipe/ifCreate', data);
    }
  };

  // Function to append to TinderCards swipe if 'join
  const swipedIfJoin = async (direction, restaurantId, restaurantName) => {
    console.log('removing:', restaurantName);
    // setLastDirection(direction);
    console.log('swiped direction =', direction);
    console.log('restaurantId:', restaurantId);
    console.log('restaurant Card', restaurantCard);
    console.log('set restaurant Card', setRestaurantCard);
    if (direction === 'right') {
      console.log('its right');
      // If swiped direction is right - do a axios.post to DB to store data

      const getUser1Id = window.localStorage.getItem('userId');

      console.log('session id: ', localSessionId);
      const data = {
        restaurant_id: restaurantId,
        user_identity: getUser1Id,
        session_id: localSessionId,
      };
      console.log('data: ', data);
      await axios.post('/swipe/ifJoin', data);
    }
  };

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen`);
  };
  const canSwipe = currentIndex >= 0;

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <>
      {sessionType === 'create'
        ? <TinderCardsIfCreate />
        : <TinderCardsIfJoin />}
    </>
  );
};

export default RestaurantPage;
