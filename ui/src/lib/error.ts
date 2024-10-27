import { toast } from "sonner";
import { YouTubeError } from "./sources/youtube";

const PRESENTABLE_ERRORS = [YouTubeError];
export function presentError(error: unknown | Error): void {
	for (const err of PRESENTABLE_ERRORS) {
		if (error instanceof err) {
			toast.error(error.message);
			return;
		}
	}

	console.error(error);
}
