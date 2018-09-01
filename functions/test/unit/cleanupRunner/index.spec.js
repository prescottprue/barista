import * as admin from 'firebase-admin'

describe('cleanupRunner RTDB Cloud Function (onUpdate)', () => {
  let adminInitStub
  let cleanupRunner

  beforeEach(() => {
    mockFunctionsConfig()
    // Stub Firebase's admin.initializeApp
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Real Time Database and Firestore
    /* eslint-disable global-require */
    cleanupRunner = functionsTest.wrap(
      require(`${__dirname}/../../../index`).cleanupRunner
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('exits with null for invalid data', async () => {
    const snap = {
      val: () => null
    }
    const fakeContext = {
      params: {}
    }

    const res = await cleanupRunner({ before: snap, after: snap }, fakeContext)
    expect(res).to.be.null
  })

  it('exits for non failure statuses', async () => {
    const databaseStub = sinon.stub()
    const refStub = sinon.stub()
    const removeStub = sinon.stub()

    refStub.returns({ remove: removeStub })
    removeStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => null
    }
    const fakeContext = {
      params: { projectId: 'testing', jobRunKey: 1 }
    }

    const res = await cleanupRunner({ before: snap, after: snap }, fakeContext)
    expect(res).to.be.null
  })

  it('makes delete request if status is passed or failed', async () => {
    const refStub = sinon.stub()
    const parentOnceStub = sinon.stub()
    const removeResponseOnStub = (eventType, successCb, errorCb) => {
      // Invoke success callback
      successCb({ val: () => ({ complete: 'true' }) })
      // requestListener (used in off)
      return {}
    }
    const parentUpdateStub = sinon.stub().returns(Promise.resolve())
    const setStub = sinon.stub().returns(Promise.resolve())
    const removeRequestPushStub = sinon.stub()
    const removeRequestSetStub = sinon.stub()
    removeRequestPushStub.returns({ key: 'testing', set: removeRequestSetStub })
    removeRequestSetStub.returns(Promise.resolve())
    const runDataSnap = {
      val: () => ({ instanceMeta: { resourceUrl: 'asdf' } })
    }
    refStub.returns({
      set: setStub,
      on: removeResponseOnStub,
      off: () => ({}),
      push: removeRequestPushStub
    })
    refStub.parent = { once: parentOnceStub, update: parentUpdateStub }
    // Get meta stub
    parentOnceStub.returns(Promise.resolve(runDataSnap))
    // remove request response stub
    // Apply stubs as admin.database()
    const databaseStub = sinon.stub().returns({ ref: refStub })
    sinon.stub(admin, 'database').get(() => databaseStub)
    const snap = {
      val: () => 'failed',
      ref: refStub
    }
    const fakeContext = {
      params: { projectId: 'testing', jobRunKey: 1 }
    }

    const res = await cleanupRunner({ before: snap, after: snap }, fakeContext)
    expect(res).to.be.null
  })
})
