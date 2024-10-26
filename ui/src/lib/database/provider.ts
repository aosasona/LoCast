import { PGlite, PGliteInterfaceExtensions } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { makePGliteProvider } from "@electric-sql/pglite-react";

export type CustomPGlite = PGlite &
	PGliteInterfaceExtensions<{ live: typeof live }>;

const { PGliteProvider, usePGlite } = makePGliteProvider<CustomPGlite>();

export { PGliteProvider, usePGlite };
