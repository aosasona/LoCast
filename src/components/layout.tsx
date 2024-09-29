import type { PropsWithChildren } from "react";
import { Fragment } from "react";
import logo from "@images/light-logo.svg";
import PWABadge from "$/PWABadge";

type Props = PropsWithChildren<{}>;

// TODO: make this toggle-able for mobile
export default function Layout({ children }: Props) {
	return (
		<Fragment>
			<main className="flex w-screen h-screen gap-x-3">
				<nav className="h-full border-r border-r-neutral-800 px-3 py-4 select-none">
					<img src={logo} alt="YouCast Logo" className="w-8 aspect-square" />
				</nav>

				{children}
			</main>

			<PWABadge />
		</Fragment>
	);
}
