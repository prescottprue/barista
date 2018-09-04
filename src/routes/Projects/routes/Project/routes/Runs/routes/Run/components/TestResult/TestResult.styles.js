export default theme => ({
  root: {
    width: '100%'
  },
  stacked: {
    flexDirection: 'column'
  },
  fail: {
    color: 'red'
  },
  pass: {
    color: 'green'
  },
  pending: {
    color: 'grey',
    '-webkit-animation': 'spin 4s linear infinite',
    '-moz-animation': 'spin 4s linear infinite'
  }
})
