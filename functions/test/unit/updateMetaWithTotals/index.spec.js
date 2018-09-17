import * as admin from 'firebase-admin'
const userId = 1
const refParam = `users_public/${userId}`

describe('updateMetaWithTotals RTDB Cloud Function (onWrite)', () => {
  let adminInitStub
  let updateMetaWithTotals

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Stub Firebase's config environment var
    process.env.FIREBASE_CONFIG = JSON.stringify({
      databaseURL: 'https://some-project.firebaseio.com',
      storageBucket: 'some-bucket.appspot.com'
    })
    /* eslint-disable global-require */
    updateMetaWithTotals = functionsTest.wrap(
      require(`${__dirname}/../../../index`).updateMetaWithTotals
    )
    /* eslint-enable global-require */
  })

  after(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
  })

  it('handles event', async () => {
    const databaseStub = sinon.stub()
    const refStub = sinon.stub()
    const removeStub = sinon.stub()

    refStub.withArgs(refParam).returns({ remove: removeStub })
    removeStub.returns(Promise.resolve({ ref: 'new_ref' }))
    databaseStub.returns({ ref: refStub })
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    // Apply stubs as admin.database()
    sinon.stub(admin, 'database').get(() => databaseStub)
    const docStub = sinon
      .stub()
      .returns({ get: sinon.stub().returns(Promise.resolve({})) })
    const collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    const snap = {
      val: () => null
    }
    const fakeContext = {
      params: { filePath: 'testing', userId: 1 }
    }

    const res = await updateMetaWithTotals({ after: snap }, fakeContext)
    expect(res).to.be.null
  })
})
