import { PaginationProps } from '@/interfaces';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/router';

export default function Pagination({ totalPages, currentPage, numPageShow, nearPage }: PaginationProps) {
  const router = useRouter();

  const handlePrevious = () => {
    const params = router.query;
    router.push({ query: { ...params, page: currentPage - 1 } });
  };

  const handleNext = () => {
    const params = router.query;
    router.push({ query: { ...params, page: currentPage + 1 } });
  };

  const handleSelectPage = (x: number) => {
    const params = router.query;
    router.push({ query: { ...params, page: x } });
  };

  return (
    <nav className="w-[1300px] mt-5 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
      <div className="-mt-px flex w-0 flex-1">
        <button
          disabled={currentPage == 1 || totalPages == 0 ? true : false}
          onClick={handlePrevious}
          className="inline-flex items-center cursor-pointer border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          <ArrowLongLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>

      <div className="hidden md:-mt-px md:flex">
        {totalPages <= 5 ? (
          Array.from({ length: totalPages }, (_, i) => i + 1).map((x) => (
            <button
              key={x}
              onClick={() => handleSelectPage(x)}
              className={
                currentPage == x
                  ? 'items-center border-t-2 border-indigo-500 px-4 pt-4 text-sm font-medium text-indigo-600'
                  : 'cursor-pointer inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500'
              }
              aria-current="page"
            >
              {x}
            </button>
          ))
        ) : (
          <div></div>
        )}
      </div>

      <div className="-mt-px flex w-0 flex-1 justify-end">
        <button
          disabled={currentPage == totalPages || totalPages == 0 ? true : false}
          onClick={handleNext}
          className="cursor-pointer inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
        >
          Next
          <ArrowLongRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
