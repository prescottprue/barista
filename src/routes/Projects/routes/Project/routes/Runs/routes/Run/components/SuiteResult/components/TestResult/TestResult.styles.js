export default theme => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '4px 1fr'
  },
  root: {},
  expanded: {
    margin: '1px 0'
  },
  content: {
    display: 'grid',
    gridTemplateColumns:
      '[statusIcon] 36px [testTitle] 1fr [testDuration] 96px',
    gridTemplateRows: '100%',
    gridRowGap: 0,
    margin: 0,
    marginRight: '1.5rem',
    alignItems: 'center',
    paddingLeft: '24px'
  },
  testSummaryPanel: {
    paddingLeft: 0,
    margin: 0
  },
  testTitle: {
    '&:first-letter': {
      textTransform: 'capitalize'
    }
  },
  spacer: {
    height: '100%',
    minWidth: '1px'
  },
  failed: {
    backgroundColor: theme.palette.error.main
  },
  passed: {
    backgroundColor: theme.palette.success.main
  },
  pending: {
    backgroundColor: theme.palette.grey2
  }
})
