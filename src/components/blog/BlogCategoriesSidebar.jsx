import Link from "next/link";
import clsx from "clsx";
import { isFilled } from "@prismicio/client";

const itemClasses = (isActive) =>
  clsx(
    "block px-4 py-3 text-title-base border-l-2 transition-colors",
    isActive
      ? "border-primary-light text-primary-light font-medium bg-offwhite"
      : "border-transparent text-text-placeholder hover:text-text-heading hover:border-border-primary",
  );

const BlogCategoriesSidebar = ({ categories, activeCategoryUid, basePath }) => {
  if (!categories?.length) return null;

  return (
    <div className="p-2">
      <div className="px-4 pt-2 pb-1 text-title-medium text-text-heading">
        Categories
      </div>
      <ul className="flex flex-col">
        <li>
          <Link href={basePath} className={itemClasses(!activeCategoryUid)}>
            All Blogs
          </Link>
        </li>
        {categories.map((category) => {
          if (!isFilled.keyText(category.data.title)) return null;

          return (
            <li key={category.id}>
              <Link
                href={`${basePath}/category/${category.uid}`}
                className={itemClasses(category.uid === activeCategoryUid)}
              >
                {category.data.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BlogCategoriesSidebar;
