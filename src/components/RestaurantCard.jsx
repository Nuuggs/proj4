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
        coordinates: { lat: 1.2902, lng: 103.8515 },
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

  const swiped = (direction, nameToDelete) => {
    console.log('removing:', nameToDelete);
    // setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(`${name} left the screen`);
  };

  return (
    <div>
      <div className="restaurantcontainer">
        {restaurantCard.map((restaurant) => (
          <TinderCard classname="swipe" key={restaurant.name} preventSwipe={['up', 'down']} onSwipe={(direction) => swiped(direction, restaurant.name)} onCardLeftScreen={() => outOfFrame(restaurant.name)}>
            <div className="resCard" style={{ backgroundImage: `url(https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photo_reference=${restaurant.photos[0].photo_reference}&key=${apiKey})` }}>
              <h3>{restaurant.name}</h3>
              {/* <h3>{restaurant.rating}</h3>
              <p>{restaurant.vicnity}</p> */}
            </div>
          </TinderCard>
        ))}
      </div>
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
