import { PinStatus } from "../types";

export default function statusColorMap(status: PinStatus, theme: any): string {
  const greenColor = theme.palette.primary.dark;
  const yellowColor = "#FFBF00";
  const redColor = "#D2222D";

  const colorMap: { [status: string]: string } = {
    pinned: greenColor, //  pins were correctly pinned
    remote: greenColor, //  pins that are allocated to other cluster peers (remote means not handled by this peer).
    // Processing
    pinning: yellowColor, //  pins that are currently being pinned by ipfs
    unpinning: yellowColor, //  pins that are currently being unpinned by ipfs
    pin_queued: yellowColor, //  pins that are waiting to start pinning (usually because ipfs is already pinning a bunch of other things)
    unpin_queued: yellowColor, //  pins that are waiting to start unpinning (usually because something else is being unpinned)
    queued: yellowColor, //  pins in pin_queued or unpin_queued states.
    // Error
    cluster_error: redColor, // pins for which we cannot obtain status information (i.e. the cluster peer is down)
    pin_error: redColor, // pins that failed to pin (due to an ipfs problem or a timeout)
    unpin_error: redColor, //  pins that failed to unpin (due to an ipfs problem or a timeout)
    error: redColor //  pins in pin_error or
  };

  return colorMap[status] || "gray";
}
