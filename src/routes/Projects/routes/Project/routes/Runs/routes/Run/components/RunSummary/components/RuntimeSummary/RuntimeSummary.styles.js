export default theme => ({
  root: {
    // style code
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '64px 1fr',
    gridTemplateRows: 'auto',
    gridRowGap: '.75rem',
    gridColumnGap: '.75rem',
    marginLeft: '1rem',
    padding: '32px'
  },
  label: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    alignSelf: 'center'
  },
  value: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    fontSize: '16px',
    alignSelf: 'center'
  },
  logs: {
    gridColumnStart: 1,
    gridColumnEnd: 'span 2',
    justifySelf: 'end',
    color: theme.palette.primary.light,
    fontSize: '1rem',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})
