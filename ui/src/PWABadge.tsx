import { Box, Button, Flex, Text } from "@radix-ui/themes";
import { useRegisterSW } from "virtual:pwa-register/react";

function PWABadge() {
	// check for updates every hour
	const period = 60 * 60 * 1000;

	const {
		offlineReady: [offlineReady, setOfflineReady],
		needRefresh: [needRefresh, setNeedRefresh],
		updateServiceWorker,
	} = useRegisterSW({
		onRegisteredSW(swUrl, r) {
			if (period <= 0) return;
			if (r?.active?.state === "activated") {
				registerPeriodicSync(period, swUrl, r);
			} else if (r?.installing) {
				r.installing.addEventListener("statechange", (e) => {
					const sw = e.target as ServiceWorker;
					if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
				});
			}
		},
	});

	function close() {
		setOfflineReady(false);
		setNeedRefresh(false);
	}

	return (
		<Box className="fixed bottom-5 right-5 border border-gray rounded-lg transition-all" role="alert" aria-labelledby="toast-message">
			{(offlineReady || needRefresh) && (
				<Box p="2">
					<Text size="2">
						{offlineReady ? <span id="toast-message">App ready to work offline</span> : <span id="toast-message">New content available, click on reload button to update.</span>}
					</Text>
					<Flex justify="end" mt="2" gap="2">
						<Button size="1" variant="soft" color="gray" onClick={() => close()}>
							Close
						</Button>
						{needRefresh && (
							<Button size="1" onClick={() => updateServiceWorker(true)}>
								Reload
							</Button>
						)}
					</Flex>
				</Box>
			)}
		</Box>
	);
}

export default PWABadge;

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
	if (period <= 0) return;

	setInterval(async () => {
		if ("onLine" in navigator && !navigator.onLine) return;

		const resp = await fetch(swUrl, {
			cache: "no-store",
			headers: {
				cache: "no-store",
				"cache-control": "no-cache",
			},
		});

		if (resp?.status === 200) await r.update();
	}, period);
}
