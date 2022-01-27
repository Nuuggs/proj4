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
  appState, setAppState, appParams, sessionId,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(restaurantCard.length - 1);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(async () => {
    console.log('This is running');
    // THIS IS PARAMS FROM FORM
    console.log('App Params: ', appParams);
    const result = await axios.post('/match', appParams);
    console.log('THIS IS RETURN RESULT AFTER AXIOS POST', result);
    console.log(result.data.createdDB);
    console.log(result.data.createdDB.id);
    const restaurantData = result.data.createdDB.searchResults.results;
    setRestaurantCard([...restaurantData]);
    setLoading(false);
    // setCurrentIndex(restaurantData.length - 1);
  }, []);
  // console.log('restaurantCard: ', restaurantCard);

  const TinderCards = () => {
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
              onSwipe={(direction) => swiped(direction, restaurant.place_id, restaurant.name)}
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
          <IconButton className="clickButtons__right" onClick={() => swiped(right, restaurant.place_id, restaurant.name)}>
            <FavoriteIcon fontSize="large" />
          </IconButton>
        </div> */}
      </>
    );
  };

  // To build a function onclickRight & onclickleft and attach same principle
  const swiped = async (direction, restaurantId, restaurantName) => {
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

      console.log('session id: ', sessionId);
      const data = {
        restaurantId,
        player1_Identity: getUser1Id,
        player2_Identity: getUser2Id,
        session_id: sessionId,
      };
      console.log('data: ', data);
      await axios.post('/swipe', data);

      // After that move to matchCtrl and create new function - do a .create if no existing restaurant ID in place - else do a .update on existing data
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
      {restaurantCard.length === 0
        ? <div>No cards</div>
        : <TinderCards />}
    </>
  );
};

export default RestaurantPage;
