import * as admin from 'firebase-admin'

describe('onCloudBuildEvent RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let onCloudBuildEvent

  before(() => {
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    onCloudBuildEvent = functionsTest.wrap(
      require(`${__dirname}/../../../index`).onCloudBuildEvent
    )
    /* eslint-enable global-require */
  })

  after(() => {
    adminInitStub.restore()
    functionsTest.cleanup()
    process.env.GCLOUD_PROJECT = undefined
  })

  it('throws if message does not contain attributes', async () => {
    try {
      await onCloudBuildEvent({})
    } catch (err) {
      expect(err).to.have.property('message', 'No attributes in message')
    }
  })

  it('throws if there is no repo name in the message body', async () => {
    const fakeMessage = {
      attributes: { buildId: 'testing' },
      body: {}
    }
    const fakeMessageEvent = {
      json: JSON.stringify(fakeMessage.body),
      attributes: fakeMessage.attributes
    }
    try {
      await onCloudBuildEvent(fakeMessageEvent)
    } catch (err) {
      expect(err).to.have.property(
        'message',
        'No repo name found in message body'
      )
    }
  })

  it('writes status updates to RTDB', async () => {
    const setStub = sinon.stub().returns(Promise.resolve({}))
    const getStub = sinon.stub().returns(Promise.resolve({}))
    const refStub = sinon.stub().returns({ set: setStub })
    const docStub = sinon.stub().returns({ set: setStub, get: getStub })
    const collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    // Apply stubs as admin.database()
    const databaseStub = sinon.stub().returns({ ref: refStub })
    databaseStub.ServerValue = { TIMESTAMP: 'test' }
    sinon.stub(admin, 'database').get(() => databaseStub)
    // Apply stubs as admin.firestore()
    const firestoreStub = sinon
      .stub()
      .returns({ doc: docStub, collection: collectionStub })
    sinon.stub(admin, 'firestore').get(() => firestoreStub)
    const createdAt = 'timestamp'
    const status = 'SUCCESS'
    const commitSha = 'asdf'
    const branchName = 'master'
    const repoName = 'testing'
    const buildId = 'myBuildId'
    admin.firestore.FieldValue = { serverTimestamp: () => createdAt }
    const fakeMessage = {
      attributes: { buildId, status },
      json: {
        source: { repoSource: { repoName, branchName } },
        sourceProvenance: { resolvedRepoSource: { commitSha } }
      }
    }
    const res = await onCloudBuildEvent(fakeMessage)
    expect(res).to.be.null
    // Confirm that RTDB is updated with object containing nessesary data
    expect(setStub).to.be.calledWith(
      {
        createdAt,
        status,
        buildId,
        projectId: repoName,
        repoName,
        branchName,
        commitSha
      },
      { merge: true }
    )
  })
})
