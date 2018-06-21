import React from 'react'
import { Link } from 'react-router'
import { paths } from 'constants'
import classes from './HomePage.scss'

export const Home = () => (
  <div className={classes.container}>
    <div className="flex-row-center">
      <h2>Mocha Test Running Suite</h2>
      <p>More Coming Soon</p>
      <Link to={paths.account}>
        <p>Account Page</p>
      </Link>
    </div>
  </div>
)

export default Home
