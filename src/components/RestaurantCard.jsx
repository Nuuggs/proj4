/* eslint-disable react/prop-types */
/* eslint-disable max-len */
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
  const [zeroResults, setZeroResults] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [matchedRestaurant, setMatchedRestaurant] = useState(null);
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [isLastCard, setIsLastCard] = useState(false);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  // If there is no sessionId, either there was no existing session
  // Or user clicked 'New Session' button which deletes previously existing session
  // Refer: SessionPage.jsx createNewSession()
  // We can thus create new session

  if (!sessionId) {
    useEffect(
      async () => {
        console.log('no session id detected block is running');

        const result = await axios.post('/match/create', appParams);

        // If zero results to notify page to render zero results instead of error
        console.log('Result test if 0 results', result);
        if (result.data === 'ZERO RESULTS') {
          setLoading(false);
          return setZeroResults(true);
        }
        // Maybe can remove? No longer need p1Id, p2Id
        const p1Id = localStorage.setItem('p1Id', result.data.newSession.p1Id);
        const p2Id = localStorage.setItem('p2Id', result.data.newSession.p2Id);

        setSessionId(result.data.newSession.id);

        const restaurantData = result.data.newSession.searchResults.results;
        console.log('<=== RESTAURANT DATA ===>', restaurantData);
        setRestaurantCard([...restaurantData]);
        setLoading(false);
      }, [],
    );
  }
  else if (sessionId) {
    // If sessionId exists
    console.log('else if session id exists block is running, sessio id:', sessionId);

    useEffect(
      async () => {
        const result = await axios.get(`/match/session/${sessionId}`);

        if (result.data.match === true) {
          console.log("************ IT'S A MATCH **************", result.data.matchedRestaurant);
          setMatchedRestaurant(result.data.matchedRestaurant);
          setIsMatch(true);
          setLoading(false);
          return;
        }

        const restaurantData = result.data.existingSession.searchResults.results;
        console.log('<=== RESTAURANT DATA ===>', restaurantData);
        setRestaurantCard([...restaurantData]);
        setLoading(false);
      }, [],
    );
  }

  console.log('restaurantCard ---->', restaurantCard);
  console.log('isLoading ---->', isLoading);
  console.log('zeroResults ---->', zeroResults);

  const TinderCards = () => {
    console.log('<TinderCards/> running');

    return (
      <>
        <ErrorBoundary>
          <div className="restaurantcontainer">
            {restaurantCard.map((restaurant, restaurantCardIndex) => (
              <TinderCard
                className="swipe"
                key={restaurant.place_id}
                id={restaurant.place_id}
                preventSwipe={['up', 'down']}
                onSwipe={(direction) => swiped(direction, restaurant, restaurantCardIndex)}
              >
                { restaurant.photos === undefined
                  ? (
                    <div className="resCard" style={{ backgroundImage: 'url(/chicken-logo-temp.jpg)' }}>
                      {' '}
                      no photo
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
                  )
                  : (
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
                  )}

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

  // To render MatchCard function once there's a match
  const MatchCard = () => {
    console.log('<TinderCards/> running');

    return (
      <>
        <ErrorBoundary>
          <div className="matchCardContainer">
            <h2> It's A MATCH!!!</h2>

            <div className="resCard" onClick={() => googleRestaurantSearch(matchedRestaurant)} style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${matchedRestaurant.photos[0].photo_reference}&key=${apiKey})` }}>
              <div className="caption-div">
                <h2>{matchedRestaurant.name}</h2>
                <h2>It's a Match!</h2>
                {/* <Rating name="half-rating" defaultValue={restaurant.rating} precision={0.5} size="small" />
                <h2>
                  out of
                  {' '}
                  {restaurant.user_ratings_total}
                  {' '}
                  reviews
                </h2> */}

              </div>

            </div>
          </div>
        </ErrorBoundary>
      </>
    );
  };

  const googleRestaurantSearch = (matchedRestaurant) => {
    window.open(`http://www.google.com/search?q=${matchedRestaurant.name}`, '_blank');
  };

  // To build a function onclickRight & onclickleft and attach same principle
  const swiped = async (direction, restaurant, restaurantCardIndex) => {
    const userId = localStorage.getItem('userId');

    const data = {
      userId,
      sessionId,
      restaurant,
      restaurantCardIndex,
    };
    if (direction === 'right') {
      // If swiped direction is right - do a axios.post to DB to store data
      const response = await axios.post('/match/swipe', data);
      if (response.data.match === true) {
        console.log('<=== M A T C H ===>', response.data.matchedRestaurant);
        setMatchedRestaurant(response.data.matchedRestaurant);
        setIsMatch(true);
      } else if (response.data.isLastCard === true) {
        setIsLastCard(true);
        console.log('<===== RIGHT SWIPE: L A S T  C A R D =====>');
      }
    } else if (direction === 'left') {
      const response = await axios.post('/match/leftswipe', data);

      if (response.data.match === true) {
        console.log("************ IT'S A MATCH **************", response.data.matchedRestaurant);
        setMatchedRestaurant(response.data.matchedRestaurant);
        setIsMatch(true);
      } else if (response.data.isLastCard === true) {
        setIsLastCard(true);
        console.log('<===== LEFT SWIPE: L A S T  C A R D =====>');
      }
    }
  };

  return (
    <div>
      {isLoading === true && (<div><h2>Loading</h2></div>)}
      {isLoading === false && zeroResults === true && (
      <div>
        <h2>No Results - Please create a new session </h2>
        <div className="nav-box-restaurant">
          <Navigation appState={appState} setAppState={setAppState} setSessionId={setSessionId} />
        </div>
      </div>
      )}
      {(isLoading === false && restaurantCard.length !== 0 && isMatch === false && isLastCard === false)
   && (
   <ErrorBoundary>
     <TinderCards />
   </ErrorBoundary>
   )}
      {isLoading === false && isMatch === true && (<ErrorBoundary><MatchCard /></ErrorBoundary>)}
      {isLoading === false && isLastCard === true && (
      <div>
        <h2>
          Sorry, we've ran out of suggestions for
          restaurants around your chosen area.
        </h2>
        <h2>Start a new session to try something else.</h2>
        <div className="nav-box-restaurant">
          <Navigation appState={appState} setAppState={setAppState} setSessionId={setSessionId} />
        </div>
      </div>
      )}
    </div>

  );
};

export default RestaurantPage;
