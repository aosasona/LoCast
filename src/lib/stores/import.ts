import { proxy } from "valtio";

type ImportStore = {
	isImportingFromYouTube: boolean;
};

const importStore = proxy<ImportStore>({
	isImportingFromYouTube: false,
});

function toggleImportingFromYouTube(open: boolean | undefined = undefined) {
	importStore.isImportingFromYouTube = open ?? !importStore.isImportingFromYouTube;
}

export { importStore, toggleImportingFromYouTube };
