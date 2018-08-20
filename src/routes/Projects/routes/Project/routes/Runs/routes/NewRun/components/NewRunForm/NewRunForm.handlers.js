import { paths } from 'constants'

/**
 * Handler for going back to runs page
 * @param  {Object} props - Component's props
 * @return {Function} Function that routes back to runs page
 */
export function goBack({ router, projectId }) {
  return () => {
    router.push(`${paths.list}/${projectId}/${paths.runs}`)
  }
}
