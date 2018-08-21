export const LIST_PATH = '/projects'
export const ACCOUNT_PATH = '/account'
export const LOGIN_PATH = '/login'
export const SIGNUP_PATH = '/signup'
export const ACCOUNT_FORM_NAME = 'account'
export const LOGIN_FORM_NAME = 'login'
export const SIGNUP_FORM_NAME = 'signup'
export const NEW_PROJECT_FORM_NAME = 'newProject'
export const NEW_JOB_RUN_FORM_NAME = 'newRun'
export const RUNS_PATH = 'runs'
export const NEWRUN_PATH = 'new'
export const RUN_PATH = ':runId'
export const BUILDS_PATH = 'builds'
export const CONTAINER_BUILDS_META_PATH = 'container_builds'
export const CONTAINER_BUILDS_STATUS_PATH = 'container_build_statues'
export const TEST_RUNS_META_PATH = 'test_runs_meta'
export const TEST_RUNS_DATA_PATH = 'test_runs_data'

export const formNames = {
  account: ACCOUNT_FORM_NAME,
  signup: SIGNUP_FORM_NAME,
  login: LOGIN_FORM_NAME,
  newProject: NEW_PROJECT_FORM_NAME,
  newJobRun: NEW_JOB_RUN_FORM_NAME
}

export const paths = {
  list: LIST_PATH,
  account: ACCOUNT_PATH,
  login: LOGIN_PATH,
  signup: SIGNUP_PATH,
  runs: RUNS_PATH,
  newRun: NEWRUN_PATH,
  builds: BUILDS_PATH
}

export const firebasePaths = {
  containerBuildStatuses: CONTAINER_BUILDS_STATUS_PATH
}

export const firestorePaths = {
  containerBuildsMeta: CONTAINER_BUILDS_META_PATH
}

export default { ...paths, ...formNames }
