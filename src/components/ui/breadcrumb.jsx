import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500">
      <ol className="inline-flex items-center">
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} className="flex items-center">
              {index > 0 && <ChevronRight className="w-3 h-3 mx-1" />}
              <Link
                to={routeTo}
                className={`${isLast ? 'font-semibold text-gray-900' : 'hover:text-gray-700'}`}
                aria-current={isLast ? 'page' : undefined}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;