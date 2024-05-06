import { createSignal } from "solid-js";

export default function WikiUser(props: any) {
    const name = props.name || "unknown-user";
    const id = props.id || "";
    return (
        <p class="wiki-user" id={id}>{name}</p>
    );
}
