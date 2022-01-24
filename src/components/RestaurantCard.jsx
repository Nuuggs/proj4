import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import './tinderCard.scss';

const RestaurantPage = () => {
  const [restaurantCard, setRestaurantCard] = useState([
    {
      name: 'Odette',
      image: 'https://www.odetterestaurant.com/wp-content/uploads/2017/03/odette-reservations-mobile-bg-1.jpg',
    },
    {
      name: 'Bakalaki Greek',
      image: 'https://www.worldgourmetsummit.com/wgs2019/files/estab/1551681672.84597.jpg',
    },
  ]);

  useEffect(() => { setRestaurantCard([...restaurantCard]); }, []);

  return (
    <div>
      <div className="restaurantcontainer">
        {restaurantCard.map((restaurant) => (
          <TinderCard classname="swipe" key={restaurant.name} preventSwipe={['up', 'down']}>
            <div className="resCard" style={{ backgroundImage: `url(${restaurant.image})` }}>
              <h3>{restaurant.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
    </div>
  );
};

export default RestaurantPage;
