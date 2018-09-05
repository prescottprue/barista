export default theme => ({
  root: {
    marginLeft: '1rem',
    marginRight: '1rem',
    width: '100%'
  },
  summaryRoot: {
    padding: 0
  },
  progressMargin: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)',
    marginBottom: 0
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)'
  },
  data: {
    display: 'block',
    alignSelf: 'center'
  },
  dateWords: {
    textAlign: 'left'
  },
  buttonContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    justifySelf: 'center',
    paddingRight: '0 !important'
  },
  button: {
    margin: theme.spacing.unit
  },
  reRunButton: {
    gridColumnStart: 1
  },
  detailsButton: {
    gridColumnStart: 2
  },
  progressBar: {
    gridColumnStart: 1,
    gridColumnEnd: 9,
    marginTop: '1rem'
  }
})
