import React from 'react'
import PropTypes from 'prop-types'
import { map, get, startCase } from 'lodash'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import { formatDateTime } from 'utils/formatters'
import ImageBuildStatus from 'routes/Projects/routes/Project/components/ImageBuildStatus'
import MostRecentImageInfo from 'routes/Projects/routes/Project/components/MostRecentImageInfo'

export const Builds = ({ builds, buildStatuses, projectId, classes }) => (
  <div className={classes.root}>
    <Typography variant="headline" component="h3">
      {startCase(projectId)} Builds
    </Typography>
    <Paper className={classes.paper}>
      <ImageBuildStatus projectId={projectId} />
      <MostRecentImageInfo projectId={projectId} />
    </Paper>
    <Paper className={classes.paper}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Build Id</TableCell>
            <TableCell>Finish Time</TableCell>
            <TableCell>Branch Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(builds, build => {
            return (
              <TableRow key={build.id}>
                <TableCell>
                  {get(build, 'buildData.attributes.buildId')}
                </TableCell>
                <TableCell>
                  {formatDateTime(get(build, 'finishTime'))}
                </TableCell>
                <TableCell>{get(build, 'buildData.branchName')}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Paper>
  </div>
)

Builds.propTypes = {
  projectId: PropTypes.string.isRequired,
  builds: PropTypes.array, // from enhancer (firestoreConnect + connect)
  buildStatuses: PropTypes.object,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default Builds
