"use client";

import CountUp from "react-countup";

type Props = {
  value?: string | null;
};

/**
 * Splits a stat into the number to count and the text either side of it:
 * `"12K+"` → 12 + `"K+"`, `"94%"` → 94 + `"%"`, `"$1,200"` → `"$"` + 1200.
 *
 * Returns null when there is no number to animate, so the caller can fall back
 * to rendering the value as typed.
 */
const parseValue = (raw: string) => {
  const match = raw.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const [, prefix, digits, suffix] = match;
  const end = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(end)) return null;

  return {
    prefix,
    suffix,
    end,
    decimals: digits.split(".")[1]?.length ?? 0,
    useGrouping: digits.includes(","),
  };
};

/**
 * The stat value, counted up when an editor ticks "Animate Numbers?".
 *
 * `value` is free text, so anything that is not a recognisable number renders
 * unchanged rather than failing — an editor writing "Lots" still gets "Lots".
 *
 * `autoAnimate` starts the count when the element scrolls into view;
 * `enableScrollSpy` is the deprecated spelling in this version of countup.js.
 */
const AnimatedNumber = ({ value }: Props) => {
  const parsed = value ? parseValue(value) : null;
  if (!parsed) return <>{value}</>;

  return (
    <CountUp
      end={parsed.end}
      decimals={parsed.decimals}
      prefix={parsed.prefix}
      suffix={parsed.suffix}
      useGrouping={parsed.useGrouping}
      duration={2}
      autoAnimate
      autoAnimateOnce
    />
  );
};

export default AnimatedNumber;
