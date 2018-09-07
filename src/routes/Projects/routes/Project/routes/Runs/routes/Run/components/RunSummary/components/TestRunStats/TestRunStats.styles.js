const baseIcon = {
  height: '1rem',
  width: '1rem',
  marginRight: '.25rem',
  position: 'relative',
  top: '-1px'
}

export default theme => ({
  root: {
    // style code
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '128px 1fr',
    gridColumnGap: '.75rem',
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
  },
  withIcon: {
    display: 'flex',
    alignItems: 'center'
  },
  duration: baseIcon
})
