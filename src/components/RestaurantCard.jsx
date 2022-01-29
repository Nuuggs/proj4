import React, {
  useState, useEffect,
} from 'react';
import { Rating } from '@mui/material';
import TinderCard from 'react-tinder-card';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ErrorBoundary from './ErrorBoundaries.jsx';
import Navigation from './NavBar.jsx';

const RestaurantPage = ({
  appState, setAppState, appParams, sessionId, setSessionId,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(restaurantCard.length - 1);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // If there is no sessionId, either there was no existing session
  // Or user clicked 'New Session' button which deletes previously existing session
  // Refer: SessionPage.jsx createNewSession()
  // We can thus create new session

  if (!sessionId) {
    useEffect(
      async () => {
        console.log('no session id detected block is running');
        // appParams = { currentUserId, partner, coordinates, cuisine, dateTime, price, rating }
        // setAppParams in <FormComplete /> FormPage.jsx

        const result = await axios.post('/match/create', appParams);

        setSessionId(result.data.newSession.id);

        const restaurantData = result.data.newSession.searchResults.results;
        console.log('<=== RESTAURANT DATA ===>', restaurantData);
        setRestaurantCard([...restaurantData]);
        setLoading(false);
        // setCurrentIndex(restaurantData.length - 1);
      }, [],
    );
  }
  else if (sessionId) {
    // If sessionId exists
    console.log('else if session id exists block is running, sessio id:', sessionId);

    useEffect(
      async () => {
        const result = await axios.get(`/match/session/${sessionId}`);
        const restaurantData = result.data.existingSession.searchResults.results;
        console.log('<=== RESTAURANT DATA ===>', restaurantData);
        setRestaurantCard([...restaurantData]);
        setLoading(false);
      }, [],
    );
  }

  console.log('...... RESTAURANT CARD ......', restaurantCard);
  console.log('?? is loading ??', isLoading);

  const TinderCards = () => {
    console.log('<TinderCards/> running');

    return (
      <>
        <ErrorBoundary>
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
        </ErrorBoundary>
        <div className="arrow-div">
          <div className="left-arrow">
            <ArrowBackIcon />
            <h2>
              This way to dislike
            </h2>
          </div>
          <div className="right-arrow">
            <ArrowForwardIcon />
            <h2>
              This way to like
            </h2>
          </div>
        </div>
        <div className="nav-box-restaurant">
          <Navigation appState={appState} setAppState={setAppState} setSessionId={setSessionId} />
        </div>
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

      const p1Id = localStorage.getItem('p1Id');
      const p2Id = localStorage.getItem('p2Id');
      const userId = localStorage.getItem('userId');

      const data = {
        restaurantId,
        userId,
        p1Id,
        p2Id,
        sessionId,
      };

      console.log('<=== RIGHT SWIPE ===> Sending data: ', data);
      const response = await axios.post('/match/swipe', data);
      if (response.data.match === true) {
        console.log("************ IT'S A MATCH **************", response.data.matchedRestaurant);
      }
      console.log('<<<< SWIPE RESPONSE >>>>', response);
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

  return (
    <div>
      {isLoading === true && (<div><h2>Loading</h2></div>)}
      {(isLoading === false && restaurantCard.length !== 0)
   && (
   <ErrorBoundary>
     <TinderCards />
   </ErrorBoundary>
   )}
    </div>

  );
};

export default RestaurantPage;
