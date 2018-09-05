export default theme => ({
  root: {
    position: 'relative',
    top: '-2px'
  },
  fail: {
    color: 'red'
  },
  pass: {
    color: 'green'
  },
  pending: {
    color: 'grey',
    '-webkit-animation': 'spin 2s linear infinite',
    '-moz-animation': 'spin 2s linear infinite',
    animation: 'spin 2s linear infinite'
  },
  skip: {
    color: 'grey'
  },
  '@keyframes spin': {
    '100%': {
      '-webkit-transform': 'rotate(-360deg)',
      transform: 'rotate(-360deg)'
    }
  }
})
