describe('api HTTPS Cloud Function', () => {
  let myFunctions
  let configStub
  let adminInitStub
  let functions
  let admin

  before(() => {
    /* eslint-disable global-require */
    admin = require('firebase-admin')
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's functions.config()
    functions = require('firebase-functions')
    configStub = sinon.stub(functions, 'config').returns({
      firebase: {
        databaseURL: 'https://not-a-project.firebaseio.com',
        storageBucket: 'not-a-project.appspot.com',
        projectId: 'not-a-project.appspot',
        messagingSenderId: '823357791673'
      }
      // You can stub any other config values needed by your functions here
    })
    myFunctions = require(`../../index`)
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    configStub.restore()
    adminInitStub.restore()
  })
  describe('missing parameters in request', () => {
    it('responds with environmentId is missing', done => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: { text: 'input' } }
      // A fake response object, with a stubbed redirect function which asserts that it is called
      // with parameters 303, 'new_ref'.
      const res = {
        end: msg => {
          expect(msg).to.equal('Error')
          done()
        }
      }
      // Invoke https function with fake request + response objects
      myFunctions.indexUser(req, res)
    })
  })

  it('responds with success message if provided valid request', done => {
    const req = { body: { environmentId: '123', projectId: '123' } }
    const res = {
      end: msg => {
        expect(msg).to.equal('Test run started!')
        done()
      }
    }
    // Invoke https function with fake request + response objects
    myFunctions.indexUser(req, res)
  })
})
