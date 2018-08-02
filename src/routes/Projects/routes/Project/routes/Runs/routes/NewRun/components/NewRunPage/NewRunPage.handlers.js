import { paths } from 'constants'

export function goBack({ router, params: { projectId } }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}

export function startTestRun({ firebase, params: { projectId } }) {
  const baristaProjectId = 'EJrWyFiygj6y3g2FfZh7'
  const baristaEnvironment = 'B2rKSXXOtyF5JBzXeI6k'
  return () => {
    return firebase.push('requests/callRunner', {
      projectId: baristaProjectId,
      environment: baristaEnvironment
    })
  }
}
