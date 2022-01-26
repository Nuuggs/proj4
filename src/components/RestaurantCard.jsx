import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import TinderCard from 'react-tinder-card';
import '../styles.scss';
import axios from 'axios';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';

// class CustomTextInput extends React.Component {
//   constructor(props) {
//     super(props);
//     // create a ref to store the textInput DOM element
//     this.textInput = React.createRef();
//     this.focusTextInput = this.focusTextInput.bind(this);
//   }

//     focusTextInput() {
//     // Explicitly focus the text input using the raw DOM API
//     // Note: we're accessing "current" to get the DOM node
//     this.textInput.current.focus();
//   }

const RestaurantPage = () => {
  const [restaurantCard, setRestaurantCard] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(restaurantCard.length - 1);
  const [testIndex, setTestIndex] = useState();
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    async function fetchData() {
      console.log('This is running');
      // Placeholder for hardcoded test
      const allParams = {
        coordinates: { lat: 1.2940, lng: 103.8531 },
        p1_Id: 3,
        p2_Id: 5,
      };
      await axios.post('/match', allParams).then((result) => {
        console.log(result);
        const restaurantData = result.data.createdDB.search_results.results;
        console.log(restaurantData);
        // const restaurantPicID = restaurantData.photos[0].photo_reference;
        // console.log(restaurantPicID);
        setRestaurantCard(restaurantData);
        setCurrentIndex(restaurantData.length - 1);
      });
    }
    fetchData();
  }, []);
  // To build a function onclickRight & onclickleft and attach same principle
  const swiped = async (direction, restaurantID, restaurantName) => {
    console.log('removing:', restaurantName);
    // setLastDirection(direction);
    console.log('swiped direction =', direction);
    console.log('restaurantID:', restaurantID);
    console.log('restaurant Card', restaurantCard);
    console.log('set restaurant Card', setRestaurantCard);
    if (direction === 'right') {
      console.log('its right');
      // If swiped direction is right - do a axios.post to DB to store data

      // dummy player identity (either p1 or p2) post to backend - to work on further with team
      const playerIdentity = p1;

      // dummy placeholder to check if player is p1 or p2
      if (playerIdentity == p1) {
        console.log(playerIdentity);
      } else {
        console.log(playerIdentity);
      }

      const data = {
        restaurant_ID: restaurantID,
        player_Identity: playerIdentity,
      };

      await axios.post('/match', data);

      // After that move to matchCtrl and create new function - do a .create if no existing restaurant ID in place - else do a .update on existing data
    }
  };

  // useEffect(() => {
  //   console.log(currentIndex);
  // });

  const currentIndexRef = useRef(currentIndex);

  // const childRefs = useMemo(
  //   () => Array(restaurantCard.length)
  //     .fill(0)
  //     .map((i) => React.createRef()),
  //   [restaurantCard],
  // );
  let childRefs = [];

  useEffect(() => {
    childRefs = Array(restaurantCard.length)
      .fill(0)
      .map((i) => React.createRef());
  }, []);

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen`);
  };
  const canSwipe = currentIndex >= 0;

  const swipe = async (dir) => {
    console.log(childRefs);
    if (canSwipe && currentIndex < restaurantCard.length) {
      console.log('childref', childRefs[currentIndex]);
      console.log('current index', currentIndex);
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // const swipe = async (direction) => {
  //   console.log('This run');
  //   // console.log(restaurantCard.current);
  //   console.log([currentIndex]);
  //   await childRefs[currentIndex].current.swipe(direction);
  // };

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
      <>
        <div className="cardsButtons">
          <IconButton className="clickButtons__left">
            <CloseIcon fontSize="large" />
          </IconButton>

          <IconButton className="clickButtons__right" onClick={() => swipe(right, restaurant.place_id, restaurant.name)}>
            <FavoriteIcon fontSize="large" />
          </IconButton>
        </div>
      </>
    </>
  );
};

export default RestaurantPage;

// have a child component: make API call in parent component and get data - pass it in as props to child component.

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
