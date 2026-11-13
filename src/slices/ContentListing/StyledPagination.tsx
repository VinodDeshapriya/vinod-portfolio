import React from "react";
import Link from "next/link";
import clsx from "clsx";
import { ChevronBack, ChevronForward } from "atd-icons";

const DoubleChevronBack = ({ size = 16 }: { size?: number }) => (
  <span className={"flex items-center"}>
    <ChevronBack size={size} className={"-mr-2 text-text-heading"} />
    <ChevronBack size={size} className={"text-text-heading"} />
  </span>
);

const DoubleChevronForward = ({ size = 16 }: { size?: number }) => (
  <span className={"flex items-center"}>
    <ChevronForward size={size} className={"-mr-2 text-text-heading"} />
    <ChevronForward size={size} className={"text-text-heading"} />
  </span>
);

const pageLinkClasses = (isActive: boolean) =>
  clsx("flex items-center justify-center size-8 rounded-[8px] text-sm", {
    "bg-primary-light text-white": isActive,
    "text-text-description hover:bg-offwhite": !isActive,
  });

const NavButton = ({
  href,
  disabled,
  ariaLabel,
  children,
}: {
  href: string;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}) => {
  const className = clsx("flex items-center justify-center size-8", {
    "cursor-not-allowed pointer-events-none opacity-60": disabled,
  });

  if (disabled) {
    return (
      <span aria-label={ariaLabel} aria-disabled={"true"} className={className}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
};

const StyledPagination = ({
  currentPage = 1,
  totalPageCount = 1,
  firstPage = "/",
}) => {
  const isTooLarge = totalPageCount > 4;
  if (!totalPageCount || totalPageCount < 2) return null;

  let windowStart = 1;
  let windowEnd = totalPageCount;
  if (isTooLarge) {
    windowStart = currentPage - 1;
    windowEnd = currentPage + 1;
    if (windowStart < 1) {
      windowEnd += 1 - windowStart;
      windowStart = 1;
    }
    if (windowEnd > totalPageCount) {
      windowStart -= windowEnd - totalPageCount;
      windowEnd = totalPageCount;
    }
    windowStart = Math.max(1, windowStart);
    windowEnd = Math.min(totalPageCount, windowEnd);
  }
  const showLeadingGap = windowStart > 1;
  const showLeadingEllipsis = windowStart > 2;
  const showTrailingGap = windowEnd < totalPageCount;
  const showTrailingEllipsis = windowEnd < totalPageCount - 1;
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPageCount;

  return (
    <div className={"pt-6 md:pt-8"}>
      <ul className={"flex items-center justify-end gap-[5px]"}>
        <li>
          <NavButton href={firstPage} disabled={isFirstPage} ariaLabel={"First"}>
            <DoubleChevronBack />
          </NavButton>
        </li>
        <li>
          <NavButton
            href={
              currentPage < 3
                ? firstPage
                : `${firstPage}/page/${Math.max(currentPage - 1, 1)}`
            }
            disabled={isFirstPage}
            ariaLabel={"Prev"}
          >
            <ChevronBack size={16} className={"text-text-heading"} />
          </NavButton>
        </li>

        {showLeadingGap && (
          <li>
            <Link href={firstPage} className={pageLinkClasses(currentPage === 1)}>
              1
            </Link>
          </li>
        )}
        {showLeadingEllipsis && (
          <li className={"py-[3px] flex justify-center items-end text-[18px] size-8 text-text-inactive"}>&middot;&middot;&middot;</li>
        )}

        {[...Array(totalPageCount).keys()].map((i) => {
          if (i + 1 < windowStart) return null;
          if (i + 1 > windowEnd) return null;
          if (!i) {
            return (
              <li key={i}>
                <Link href={firstPage} className={pageLinkClasses(i + 1 === currentPage)}>
                  {i + 1}
                </Link>
              </li>
            );
          }
          return (
            <li key={i}>
              <Link
                href={`${firstPage}/page/${i + 1}`}
                className={pageLinkClasses(i + 1 === currentPage)}
              >
                {i + 1}
              </Link>
            </li>
          );
        })}
        {showTrailingEllipsis && (
          <li className={"py-[3px] flex justify-center items-end text-[18px] size-8 text-text-description"}>&middot;&middot;&middot;</li>
        )}
        {showTrailingGap && (
          <li>
            <Link
              href={`${firstPage}/page/${totalPageCount}`}
              className={pageLinkClasses(currentPage === totalPageCount)}
            >
              {totalPageCount}
            </Link>
          </li>
        )}
        <li>
          <NavButton
            href={`${firstPage}/page/${Math.min(currentPage + 1, totalPageCount)}`}
            disabled={isLastPage}
            ariaLabel={"Next"}
          >
            <ChevronForward size={16} className={"text-text-heading"} />
          </NavButton>
        </li>
        <li>
          <NavButton
            href={`${firstPage}/page/${totalPageCount}`}
            disabled={isLastPage}
            ariaLabel={"Last"}
          >
            <DoubleChevronForward />
          </NavButton>
        </li>
      </ul>
    </div>
  );
};

export default StyledPagination;
