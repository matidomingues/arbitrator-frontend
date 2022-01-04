import { Link, ProviderPreference } from "@imtbl/imx-sdk";
import { useParams } from "react-router-dom";

export interface IProps {
}

export function LoginApp(props: IProps) {
    const link = new Link('https://link.x.immutable.com');

    link.setup({providerPreference: ProviderPreference.METAMASK});

    return (
        <div />
    )
}