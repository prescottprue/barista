import { paths } from 'constants'

export function goBack({ router, params: { projectId } }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}
