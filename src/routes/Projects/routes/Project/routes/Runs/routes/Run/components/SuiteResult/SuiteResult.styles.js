export default theme => ({
  root: {
    width: '100%'
  },
  stacked: {
    flexDirection: 'column'
  },

  suiteSummary: {
    display: 'grid',
    gridTemplateColumns:
      '[suiteTitle] 1fr [failCount] 32px [suiteDuration] 8rem'
  },
  failCount: {
    gridArea: 'failCount',
    height: '24px',
    width: '24px',
    fontSize: '12px',
    alignSelf: 'center',
    backgroundColor: theme.palette.error.main
  },
  suiteTitle: {
    gridArea: 'suiteTitle'
  },
  suiteDuration: {
    gridArea: 'suiteDuration',
    justifySelf: 'end',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center'
  },
  baseIcon: theme.baseIcon,
  details: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
})
