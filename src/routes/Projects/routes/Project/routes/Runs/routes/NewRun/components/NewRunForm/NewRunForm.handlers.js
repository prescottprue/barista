import { paths } from 'constants'

export function goBack({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}

export function goToBuilds({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.builds}`)
  }
}
