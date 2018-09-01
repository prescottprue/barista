import * as admin from 'firebase-admin'

describe('onCloudBuildEvent RTDB Cloud Function (onCreate)', () => {
  let adminInitStub
  let onCloudBuildEvent
  let setStub
  let getStub
  let refStub
  let docStub
  let collectionStub

  beforeEach(() => {
    setStub = sinon.stub().returns(Promise.resolve({}))
    getStub = sinon.stub().returns(Promise.resolve({}))
    refStub = sinon.stub().returns({ set: setStub })
    docStub = sinon.stub().returns({ set: setStub, get: getStub })
    collectionStub = sinon
      .stub()
      .returns({ add: sinon.stub().returns(Promise.resolve({})), doc: docStub })
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    // Set GCLOUD_PROJECT to env
    process.env.GCLOUD_PROJECT = 'test'
    onCloudBuildEvent = functionsTest.wrap(
      require(`${__dirname}/../../../index`).onCloudBuildEvent
    )
    /* eslint-enable global-require */
  })

  afterEach(() => {
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

  it('throws if message does not contain message body', async () => {
    try {
      await onCloudBuildEvent({ attributes: {} })
    } catch (err) {
      expect(err).to.have.property(
        'message',
        'The message does not have a body'
      )
    }
  })

  it('throws if there is no repo name in the message body', async () => {
    try {
      await onCloudBuildEvent({
        json: {},
        attributes: {}
      })
    } catch (err) {
      expect(err).to.have.property(
        'message',
        'No repo name found in message body'
      )
    }
  })

  it('writes status updates to RTDB', async () => {
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

  it('includes finishTime in update', async () => {
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
    const finishTime = 'timestamp'
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
        sourceProvenance: { resolvedRepoSource: { commitSha } },
        finishTime
      }
    }
    const res = await onCloudBuildEvent(fakeMessage)
    expect(res).to.be.null
    // Confirm that RTDB is updated with object containing finishTime
    expect(setStub).to.be.calledWith(
      {
        createdAt,
        status,
        buildId,
        projectId: repoName,
        repoName,
        branchName,
        commitSha,
        finishTime
      },
      { merge: true }
    )
  })
})
