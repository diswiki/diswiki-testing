import { Title } from "@solidjs/meta";
import { useNavigate } from "@solidjs/router";

export default function ServerHome() {

    const navigate = useNavigate();
    navigate('/');
    return <></>;
}
