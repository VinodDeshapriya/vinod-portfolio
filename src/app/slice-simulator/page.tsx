import {
  SliceSimulator,
  SliceSimulatorParams,
  getSlices,
} from "@prismicio/next";
import { SliceZone } from "@prismicio/react";

import { components } from "../../slices";
import { components as blogComponents } from "../../slices-blogs";
import { components as NavComponents } from "../../slices-nav";

export default async function SliceSimulatorPage({
  searchParams,
}: SliceSimulatorParams) {
  const { state } = await searchParams;
  const slices = getSlices(state);

  return (
    <SliceSimulator>
      <SliceZone
        slices={slices}
        components={{ ...components, ...blogComponents, ...NavComponents }}
      />
    </SliceSimulator>
  );
}
