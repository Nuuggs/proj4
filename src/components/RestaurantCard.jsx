import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import TinderCard from 'react-tinder-card';
import '../styles.scss';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

const RestaurantPage = ({ appState, setAppState, appParams }) => {
  const [isLoading, setLoading] = useState(true);
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [sessionId, setSessionId] = useState();
  const [currentIndex, setCurrentIndex] = useState(restaurantCard.length - 1);
  const [testIndex, setTestIndex] = useState();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  

  useEffect(async () => {
    console.log('This is running');
    // THIS IS PARAMS FROM FORM
    console.log('App Params: ', appParams);
    const result = await axios.post('/match', appParams);
    console.log('THIS IS RETURN RESULT AFTER AXIOS POST', result);
    console.log(result.data.createdDB);
    console.log(result.data.createdDB.id);
    setSessionId(result.data.createdDB.id);
    const restaurantData = result.data.createdDB.searchResults.results;
    // console.log(restaurantData);
    // console.log('restaurantData[0]', restaurantData[0]);
    // console.log('restaurantData[0].photos', restaurantData[0].photos); // works
    // console.log('restaurant[0].photos[0]', restaurantData[0].photos[0]); // works
    // console.log('restaurant[0].photos[0].photo_reference', restaurantData[0].photos[0].photo_reference); // works
    // const restaurantPicID = restaurantData.photos[0].photo_reference;
    // console.log(restaurantPicID);
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
          <IconButton className="clickButtons__right" onClick={() => swiped(right, restaurant.place_id, restaurant.name)}>
            <FavoriteIcon fontSize="large" />
          </IconButton>
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

      // dummy player identity (either p1 or p2) post to backend - to work on further with team
      const getUser1Id = window.localStorage.getItem('userId');
      const getUser2Id = localStorage.getItem('p2Id');
      console.log('userId local', getUser1Id);
      console.log('user2d local', getUser2Id);

      // // dummy placeholder to check if player is p1 or p2
      // if (playerIdentity == p1) {
      //   console.log(playerIdentity);
      // } else {
      //   console.log(playerIdentity);
      // }
      console.log('session id: ', sessionId);
      const data = {
        restaurant_id: restaurantId,
        player1_Identity: getUser1Id,
        player2_Identity: getUser2Id,
        session_id: sessionId,
      };
      console.log('data: ', data);
      await axios.post('/swipe', data);

      // After that move to matchCtrl and create new function - do a .create if no existing restaurant ID in place - else do a .update on existing data
    }
  };

  // useEffect(() => {
  //   console.log(currentIndex);
  // });

  // const currentIndexRef = useRef(currentIndex);

  // const childRefs = useMemo(
  //   () => Array(restaurantCard.length)
  //     .fill(0)
  //     .map((i) => React.createRef()),
  //   [restaurantCard],
  // );
  // let childRefs = [];

  // useEffect(() => {
  //   childRefs = Array(restaurantCard.length)
  //     .fill(0)
  //     .map((i) => React.createRef());
  // }, []);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen`);
  };
  const canSwipe = currentIndex >= 0;

  // const swipe = async (dir) => {
  //   console.log(childRefs);
  //   if (canSwipe && currentIndex < restaurantCard.length) {
  //     console.log('childref', childRefs[currentIndex]);
  //     console.log('current index', currentIndex);
  //     await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
  //   }
  // };

  // const swipe = async (direction) => {
  //   console.log('This run');
  //   // console.log(restaurantCard.current);
  //   console.log([currentIndex]);
  //   await childRefs[currentIndex].current.swipe(direction);
  // };

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

// Hard code useState in restaurantcard for test
// [
//     {
//       name: 'Odette',
//       image: 'https://www.odetterestaurant.com/wp-content/uploads/2017/03/odette-reservations-mobile-bg-1.jpg',
//     },
//     {
//       name: 'Bakalaki Greek',
//       image: 'https://www.worldgourmetsummit.com/wgs2019/files/estab/1551681672.84597.jpg',
//     },
//   ]
