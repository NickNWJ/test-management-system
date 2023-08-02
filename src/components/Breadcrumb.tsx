import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  link?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between items-center">
      <h2 className="flex text-center text-title-md2 font-semibold text-black dark:text-white">
        {items[items.length - 1].label}
      </h2>

      <nav>
        <ol className="flex xl:flex-row flex-col items-center text-center gap-2">
          {items.map((item, index) => (
            <li key={index}>
              {item.link ? (
                <Link to={item.link} className={`${index === items.length - 1 ? "text-primary font-bold" : ""}`} >{item.label} {index === items.length-1 ? "" : "/"}</Link>
              ) : (
                <span className="text-red">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;