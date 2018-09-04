describe.skip('callGoogleApi RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let callGoogleApi
  let databaseStub
  let refStub
  let configStub // eslint-disable-line
  let functions
  let admin

  before(() => {
    /* eslint-disable global-require */
    admin = require('firebase-admin')
    adminInitStub = sinon.stub(admin, 'initializeApp')
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
    refStub = sinon.stub()
    const setStub = sinon.stub()
    refStub.returns({ set: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub = sinon.stub(admin, 'database').returns({ ref: refStub })
    // admin.database.ServerValue = { TIMESTAMP: { '.sv': 'timestamp' } }
    callGoogleApi = functionsTest.wrap(
      require(`${__dirname}/../../../index`).callGoogleApi
    )
    /* eslint-enable global-require */
  })

  after(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
    databaseStub.restore()
  })

  it('handles event', async () => {
    const snap = {
      val: () => ({
        api: 'compute'
      }),
      ref: refStub
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }

    const res = await callGoogleApi(snap, fakeContext)
    expect(res).to.be.null
  })
})
