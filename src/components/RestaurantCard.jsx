import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import '../styles.scss';
import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

const RestaurantPage = () => {
  const [restaurantCard, setRestaurantCard] = useState([]);
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
      });
    }
    fetchData();
  }, []);

  const swiped = (direction, restaurantID, restaurantName) => {
    console.log('removing:', restaurantName);
    // setLastDirection(direction);
    console.log('swiped direction =', direction);
    console.log('restaurantID:', restaurantID);

    if (direction === 'right') {
      console.log('its right');
      // If swiped direction is right - do a axios.post to DB to store data

      // After that move to matchCtrl and create new function - do a .create if no existing restaurant ID in place - else do a .update on existing data
    }
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen`);
  };

  return (
    <div className="restaurantcontainer">
      {restaurantCard.map((restaurant) => (
        <TinderCard
          className="swipe"
          key={restaurant.place_id}
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
