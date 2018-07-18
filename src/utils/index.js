import { initGA } from './analytics'
import { init as initErrorHandler } from './errorHandling'

export const initScripts = () => {
  initGA()
  initErrorHandler()
}
