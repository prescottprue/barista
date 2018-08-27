import { invoke } from 'lodash'

export function reRunJob({ runId }) {
  return e => {
    invoke(e, 'preventDefault')
    invoke(e, 'stopPropagation')
    console.log('placeholder - rerun job', runId) // eslint-disable-line
  }
}
