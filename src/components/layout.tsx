import type { PropsWithChildren } from "react";
import logo from "@images/light-logo.svg";
import PWABadge from "$/PWABadge";

type Props = PropsWithChildren<{}>;

export default function Layout({ children }: Props) {
	return (
		<main className="bg-dark">
			<nav className="px-4 py-2">
				<img src={logo} alt="YouCast Logo" className="w-8 aspect-square" />
			</nav>
			<hr className="border-neutral-800" />
			{children}
			<PWABadge />
		</main>
	);
}
