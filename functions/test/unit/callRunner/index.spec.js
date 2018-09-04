import * as admin from 'firebase-admin'
const baristaProject = 'test'
const jobRunKey = 'test'
const pushId = '123ABC'
const testRunMetaPath = `test_runs_meta/${baristaProject}/${jobRunKey}`

describe('callRunner RTDB Cloud Function (onCreate)', function() {
  let adminInitStub
  let callRunner
  this.timeout(20000)
  let databaseStub
  let refStub
  let setStub
  beforeEach(() => {
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    databaseStub = sinon.stub()
    refStub = sinon.stub()
    setStub = sinon.stub()
    refStub.returns({ set: setStub, update: setStub })
    setStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    databaseStub.returns({ ref: refStub })
    callRunner = functionsTest.wrap(
      require(`${__dirname}/../../../index`).callRunner
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('handles event', async () => {
    const refStub = sinon.stub()
    const updateStub = sinon.stub().returns(Promise.resolve({ ref: 'new_ref' }))
    const setStub = sinon.stub().returns(Promise.resolve({ ref: 'new_ref' }))
    const updateResponseStub = sinon
      .stub()
      .returns(Promise.resolve({ ref: 'new_ref' }))
    const pushStub = sinon
      .stub()
      .onFirstCall()
      .returns({
        ref: 'new_ref',
        set: setStub
      })
      .onSecondCall()
      .returns(Promise.resolve({ snap: { on: sinon.stub() } }))
    const removeResponseOnStub = (eventType, successCb, errorCb) => {
      // Invoke success callback
      successCb({ val: () => ({ complete: 'true' }) })
      // requestListener (used in off)
      return {}
    }
    // test_run_meta Ref
    refStub.withArgs(testRunMetaPath).returns({ update: updateStub })
    // callRunner and callGoogleAPi responseRefs
    refStub.returns({
      push: pushStub,
      on: removeResponseOnStub,
      off: sinon.stub(),
      update: updateResponseStub
    })
    // Apply stubs as admin.database()
    const databaseStub = sinon.stub().returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => ({
        createdBy: 'asdf',
        jobRunKey,
        baristaProject
      })
    }
    const fakeContext = {
      params: { pushId }
    }

    const res = await callRunner(snap, fakeContext)
    expect(res).to.be.null
  })
})
