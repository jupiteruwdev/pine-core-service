import { expect } from 'chai'
import request from 'supertest'
import app from '../../src/app'
import appConf from '../../src/app.conf'

describe('routes/v0/collaterals', () => {
  describe('GET /collaterals', () => {
    it('can get all Ethereum Mainnet collaterals', async () => {
      const { body: res } = await request(app).get('/v0/collaterals')
        .query({
          ethereum: 1,
          owner: appConf.tests.walletAddress,
        })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.length).to.be.greaterThanOrEqual(1)

      for (const item of res) {
        expect(item).to.have.property('collection')
        expect(item).to.have.property('id')
        expect(item).to.have.property('ownerAddress')
        expect(item).to.have.property('imageUrl')
        expect(item).to.have.property('name')
      }
    })

    it('can get all Ethereum Rinkeby collaterals', async () => {
      const { body: res } = await request(app).get('/v0/collaterals')
        .query({
          ethereum: 4,
          owner: appConf.tests.walletAddress,
        })
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.length).to.be.greaterThanOrEqual(1)

      for (const item of res) {
        expect(item).to.have.property('collection')
        expect(item).to.have.property('id')
        expect(item).to.have.property('ownerAddress')
        expect(item).to.have.property('imageUrl')
        expect(item).to.have.property('name')
      }
    })
  })
})
