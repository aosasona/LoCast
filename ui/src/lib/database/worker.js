import { IdbFs, PGlite } from "@electric-sql/pglite";

import { worker } from "@electric-sql/pglite/worker";
import { vector } from "@electric-sql/pglite/vector";

worker({
	async init() {
		return new PGlite({
			fs: new IdbFs("locast-db"),
			extensions: { vector },
		});
	},
});
