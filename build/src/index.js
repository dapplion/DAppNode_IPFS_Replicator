require("./utils/arrayPrototype");
// Stages
const fetchFromRegistries = require("./stages/fetchFromRegistries");
const fetchFromRepos = require("./stages/fetchFromRepos");
const pinCollectedHashes = require("./stages/pinCollectedHashes");
const portMissingAssetsFromGithubToIpfs = require("./stages/portMissingAssetsFromGithubToIpfs");
// DB
const db = require("./db");
// Utils
const runEvery = require("./utils/runEvery");
const { ens } = require("./web3");
const parseCsv = require("./utils/parseCsv");

start();

async function start() {
  /**
   * Initialize database entries with CSV passed through ENVs
   * - REGISTRY_CSV="dnp.dappnode.eth, public.dappnode.eth"
   */
  await parseCsv(
    process.env.REGISTRY_CSV || "dnp.dappnode.eth"
  ).mapAsyncParallel(async name => {
    const address = await ens.resolve(name);
    console.log(`Adding registry: ${name} ${address}`);
    await db.addRegistry({ name, address });
  });

  /**
   * [NOTE] runEvery will make sure that the async function function is run
   * every interval or less dependening on how much time the task takes
   */

  await runEvery("5 minutes", async () => {
    // #### If the connection to the node is lost, this stages will
    // output an insane amount of errors. Abort them if connection is lost

    /**
     * 1. Fetch new repos
     *   - Collect known registries form the DB.
     *   - Fetch new repos for each registry and store to the DB
     */
    await fetchFromRegistries();

    /**
     * 2. Fetch new versions of repos
     *   - Collect known repos from the DB.
     *   - Fetch new version for each repo
     *   - For each version resolve the contentUris and store to the DB
     * }, ... ]
     */
    await fetchFromRepos();

    /**
     * 3. Pin collected hashes
     *   - Collect aggregated hashes from previous stages
     *   - Get the pin list from the node
     *   - Pin the not yet pinned hashes
     */
    await pinCollectedHashes();

    console.log(`Finished run`);
  });

  // Run every day after the first run of the previous block
  await runEvery("1 day", async () => {
    /**
     * 4. portMissingAssetsFromGithubToIpfs
     * - Collects all fetched repo's asstes for each version
     * - Collects pinned hashes and checks which assets are not pinned
     * - Checks if those assets are available in a github release
     * - If so, it add the file to IPFS with a stream
     * - If Github replies with 404, it will NOT try to fetch the fail again
     */
    await portMissingAssetsFromGithubToIpfs();
  });
}
