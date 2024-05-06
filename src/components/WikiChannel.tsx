import { createSignal } from "solid-js";

export default function WikiChannel(props: any) {
    const channel = props.channel || "unknown-channel";
    const id = props.id || "";
    return (
        <p class="wiki-channel" id={id}>{channel}</p>
    );
}
