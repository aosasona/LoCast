import { PGliteWorker } from "@electric-sql/pglite/worker";
import { CustomPGlite } from "./provider";
import { live } from "@electric-sql/pglite/live";

const pg = new PGliteWorker(
	new Worker(new URL("./worker.js", import.meta.url), { type: "module" }),
	{
		extensions: { live },
	},
);

export default pg as unknown as CustomPGlite;
