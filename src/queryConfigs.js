import { CONTAINER_BUILDS_META_PATH } from './constants'

/**
 * Create object with query configs for container builds
 * meta data
 * @param {Object} props - Component props
 * @param {Object} props.projectId - Component props
 * @example
 * firestoreConnect(({ projectId }) => [
 *   // create listener for builds
 *   containerBuildsMetaQuery({ projectId })
 * ]),
 */
export function containerBuildsMetaQuery({ projectId }) {
  return {
    collection: CONTAINER_BUILDS_META_PATH,
    orderBy: ['finishTime', 'desc'],
    where: ['projectId', '==', projectId],
    storeAs: `builds-${projectId}`
  }
}

/**
 * Create object with query configs for container builds
 * meta data
 * @param {Object} props - Component props
 * @param {Object} props.projectId - Component props
 * @example
 * firestoreConnect(({ projectId }) => [
 *   // create listener for builds
 *   containerBuildsMetaQuery({ projectId })
 * ]),
 */
export function mostRecentContainerBuildMetaQuery({ projectId }) {
  return {
    ...containerBuildsMetaQuery({ projectId }),
    limit: 1,
    storeAs: `mostRecentBuild-${projectId}`
  }
}
