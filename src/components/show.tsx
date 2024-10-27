import type { ReactNode } from "react";
import { Fragment } from "react";

type Props = {
	when: boolean;
	children: ReactNode;
};

export default function Show(props: Props) {
	return props.when ? <Fragment>{props.children}</Fragment> : null;
}
