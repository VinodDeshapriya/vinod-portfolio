import { Folder } from "atd-icons";

type EmptyStateProps = {
  title: string;
  description: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => (
  <div className="flex flex-col items-center text-center pt-common-space pb-4">
    <span className="flex items-center justify-center size-14 rounded-full bg-offwhite">
      <Folder size={24} className="text-text-inactive" />
    </span>
    <p className="text-title-base text-text-heading mt-4">{title}</p>
    <p className="text-body-base text-text-description mt-1 max-w-100">
      {description}
    </p>
  </div>
);

export default EmptyState;
