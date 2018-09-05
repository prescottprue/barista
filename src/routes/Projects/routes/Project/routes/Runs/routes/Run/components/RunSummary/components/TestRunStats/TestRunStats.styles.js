export default theme => ({
  root: {
    // style code
  },
  repo: {
    display: 'grid',
    gridTemplateColumns: '112px 1fr',
    gridRowGap: '.75rem',
    padding: '32px',
    alignContent: 'start'
  },
  label: {
    gridColumnStart: 1,
    gridColumnEnd: 2,
    alignSelf: 'center',
    '&:after': {
      content: ':'
    }
  },
  value: {
    gridColumnStart: 2,
    gridColumnEnd: 3,
    fontSize: '16px',
    alignSelf: 'center'
  },
  link: {
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
})
