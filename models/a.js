const Businesses = require('../models/Businesses');

a = async (req, res) => {
  console.log("!");
  try {
      const allBusinesses = await Businesses.getAllBusinesses();
      filterBusinesses(allBusinesses);
      res.status(200).json(allBusinesses).end();
  } catch (error) {
      res.status(503).json({ error: `Could not fetch all businesses: ${error}` }).end();
  }
};

console.log(a());