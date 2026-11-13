import { FC } from "react";
import { asText, Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import slugify from "slugify";
import PrismicRichTextNormalized from "@/components/ui/PrismicRichTextNormalized";
import PrismicRichText from "@/components/ui/PrismicRichText";
import StyledContainer from "@/components/ui/StyledContainer";

/**
 * Props for `TableBlock`.
 */
export type TableBlockProps = SliceComponentProps<Content.TableBlockSlice>;

/**
 * Component for "TableBlock" Slices.
 */
const TableBlock: FC<TableBlockProps> = ({ slice }) => {
  const { title, table } = slice.primary;

  return (
    <section
      id={slugify(asText(title), { lower: true, strict: true })}
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <StyledContainer slice={slice} className="max-w-[846px]!">
        <PrismicRichTextNormalized
          field={title}
          className="inline-block my-3 text-title-medium"
        />
        {table && (
          <table className="w-full border-collapse">
            {!!table.head?.rows.length && (
              <thead>
                {table.head.rows.map((row) => (
                  <tr key={row.key}>
                    {row.cells.map((cell) => (
                      <th key={cell.key} className="border p-2 text-left">
                        <PrismicRichText field={cell.content} />
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            )}
            <tbody>
              {table.body.rows.map((row) => (
                <tr key={row.key}>
                  {row.cells.map((cell) =>
                    cell.type === "header" ? (
                      <th key={cell.key} className="border p-2 text-left">
                        <PrismicRichText field={cell.content} />
                      </th>
                    ) : (
                      <td key={cell.key} className="border p-2 text-left">
                        <PrismicRichText field={cell.content} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </StyledContainer>
    </section>
  );
};

export default TableBlock;
