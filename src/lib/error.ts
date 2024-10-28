import { toast } from "sonner";

export class YouTubeError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "YouTubeError";
	}
}

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
