import { Content } from "@prismicio/client";
import TrustBarRows from "../components/TrustBarRows";

type Props = {
  slice: Extract<Content.TrustBarSlice, { variation: "default" }>;
};

const Default = ({ slice }: Props) => (
  <TrustBarRows items={slice.primary.items} isDark={false} />
);

export default Default;
