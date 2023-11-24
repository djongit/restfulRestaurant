const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name,
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get('/:id', (req, res) => {
    const { id } = req.params;

  // Find the restaurant with the matching id.
  const restaurant = STARRED_RESTAURANTS.find((restaurant) => restaurant.id === id);

  // If the restaurant doesn't exist, let the client know.
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  res.json(restaurant);
});


/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post('/', (req, res) => {
  const { id } = req.body;
  
  const inStaredResturant = STARRED_RESTAURANTS.find((rest) => rest.restaurantId === id);
  
  // console.log('this is inStared', JSON.stringify(inStaredResturant, null, 2));
  if(inStaredResturant) {
    res.sendStatus(404);
    return;
  }
  const newId = uuidv4();
  const starredRestaurant = ALL_RESTAURANTS.find((rest) => rest.id === id);
  const newStarredRestaurant = {
    id: newId,
    restaurantId: starredRestaurant.id,
    comment: ''
  };
  STARRED_RESTAURANTS.push(newStarredRestaurant);
 
  res.json({
    id: newStarredRestaurant.id,
    comment: newStarredRestaurant.comment,
    name: starredRestaurant.name
  });
});


/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  
  const newStarredRestaurants = STARRED_RESTAURANTS.filter((rest) =>{
    return rest.id !== id
    
  } );
  
  // console.log('this is newSrarredR', JSON.stringify(newStarredRestaurants, null, 2));
  if(STARRED_RESTAURANTS.length === newStarredRestaurants.length ) {
    res.sendStatus(304);
    return;
  }
   STARRED_RESTAURANTS = newStarredRestaurants;
 
  res.sendStatus(200);
});

/**
 * Feature 10: Updating your comment of a starred restaurant.
 */

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { newComment } = req.body;
  
  const restToUpdate = STARRED_RESTAURANTS.find((rest) => rest.id === id);

  if(!restToUpdate) {
    res.sendStatus(404);
  }
  restToUpdate.comment = newComment;
 
  res.sendStatus(200);
})

module.exports = router;