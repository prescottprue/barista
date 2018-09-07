export default theme => ({
  root: {
    position: 'relative',
    top: '-2px'
  },
  fail: {
    color: theme.palette.error.main
  },
  pass: {
    color: theme.palette.success.main
  },
  pending: {
    color: theme.palette.grey1,
    '-webkit-animation': 'spin 2s linear infinite',
    '-moz-animation': 'spin 2s linear infinite',
    animation: 'spin 2s linear infinite'
  },
  skip: {
    color: theme.palette.grey1
  },
  '@keyframes spin': {
    '100%': {
      '-webkit-transform': 'rotate(-360deg)',
      transform: 'rotate(-360deg)'
    }
  }
})
