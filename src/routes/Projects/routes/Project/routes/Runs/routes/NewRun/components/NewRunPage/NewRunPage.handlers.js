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
    const pushRef = firebase.pushWithMeta('test_runs_meta', {
      projectId: baristaProjectId,
      environment: baristaEnvironment
    })
    const pushKey = pushRef.key
    return firebase.push('requests/callRunner', {
      jobRunKey: pushKey,
      projectId: baristaProjectId,
      environment: baristaEnvironment
    })
  }
}
