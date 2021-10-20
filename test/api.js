process.env.NODE_ENV = 'test';

const chai = require('chai');
const api = 'http://localhost:3000';

/**
 * Test the GET /api/businesses route
 */
describe('/GET /api/businesses', () => {
    it('it should GET all the business', async () => {
      const response = await axios.get('/businesses')
      chai.expect(response).to.have.status(200);
    });
});

