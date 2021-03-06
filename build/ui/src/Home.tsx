import React from "react";
// Material UI components
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// Own components
import AssetsTable from "./Assets/AssetsTable";
import SourcesTable from "./Sources/SourcesTable";
import AddSourceForm from "./Sources/AddSourceForm";
import PollStatusView from "./Sources/PollStatusView";
import AssetsStatusChart from "./AssetsStatusChart";
import {
  AssetWithMetadata,
  SourceWithMetadata,
  ClusterPeer,
  PollStatus
} from "./types";
import { Box, Fade, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    addForm: {
      margin: "0 auto",
      maxWidth: "40rem"
    },
    boxPollStatus: {
      height: theme.spacing(6),
      marginBottom: theme.spacing(2)
    },
    boxChart: {
      width: "100%",
      marginBottom: theme.spacing(0)
    },
    heroSection: {
      margin: theme.spacing(14, 0, 3)
    },
    summary: {
      marginBottom: theme.spacing(6)
    }
  })
);

export default function Home({
  assets,
  sources,
  peers,
  pollStatus
}: {
  assets: AssetWithMetadata[];
  sources: SourceWithMetadata[];
  peers: ClusterPeer[];
  pollStatus: PollStatus;
}) {
  const classes = useStyles();

  const showTables = assets.length > 0 || sources.length > 0;

  return (
    <>
      <Box className={classes.heroSection}>
        <Box>
          <Typography variant="h4" align="center" color="textSecondary">
            Pin anything
          </Typography>
          {/* <Typography align="center" color="textSecondary">
            Select an asset type to start
          </Typography> */}
        </Box>

        <Grid container spacing={2} className={classes.addForm}>
          <Grid item xs={12}>
            <AddSourceForm />
          </Grid>
        </Grid>
      </Box>

      <Box className={classes.boxChart}>
        <Fade in={assets.length > 0}>
          {assets.length ? (
            <AssetsStatusChart assets={assets} peerCount={peers.length} />
          ) : (
            <span />
          )}
        </Fade>
      </Box>

      <Box className={classes.boxPollStatus}>
        <Fade in={!!pollStatus}>
          {pollStatus ? <PollStatusView {...{ pollStatus }} /> : <span />}
        </Fade>
      </Box>

      {showTables ? (
        <Fade in={showTables}>
          <Grid container spacing={3}>
            {[
              <AssetsTable {...{ assets }} summary />,
              <SourcesTable {...{ sources, peers }} summary />
            ].map((SummaryTable, i) => (
              <Grid
                key={i}
                item
                xs={12}
                sm={12}
                md={12}
                lg={6}
                className={classes.summary}
              >
                {SummaryTable}
              </Grid>
            ))}
          </Grid>
        </Fade>
      ) : null}
    </>
  );
}
