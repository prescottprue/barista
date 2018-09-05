export default theme => ({
  root: {
    width: '100%'
  },
  stacked: {
    flexDirection: 'column'
  },
  content: {
    display: 'grid',
    gridTemplateColumns:
      '[statusIcon] 36px [testTitle] 1fr [testDuration] 56px',
    gridTemplateRows: '100%',
    gridRowGap: 0,
    margin: 0,
    marginRight: '1.5rem',
    alignItems: 'center'
  },
  testTitle: {
    '&:first-letter': {
      textTransform: 'capitalize'
    }
  },
  testSummaryPanel: {
    paddingLeft: 0,
    margin: 0
  },
  spacer: {
    height: '100%',
    minWidth: '2px'
  },
  failed: {
    backgroundColor: 'red'
  }
})
