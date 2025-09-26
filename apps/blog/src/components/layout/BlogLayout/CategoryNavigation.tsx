import type { BlogIndex } from "../../../service/blogData";
import { AllCategoryItem } from "./AllCategoryItem";
import { CategoryItem } from "./CategoryItem";

// Props 타입 정의
interface CategoryNavigationProps {
  data: BlogIndex | undefined;
  isLoading: boolean;
}

export function CategoryNavigation({
  data,
  isLoading,
}: CategoryNavigationProps) {
  if (isLoading || !data) {
    return (
      <div className="overflow-x-auto">
        <div className="flex gap-2">
          <AllCategoryItem totalCount={0} isLoading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2">
        <AllCategoryItem totalCount={data.all.length} isLoading={false} />

        {data.categories.map((category: string) => {
          const count = data.byCategory[category]?.length ?? 0;
          const encodedCategory = encodeURIComponent(category);

          return (
            <CategoryItem
              key={category}
              category={category}
              count={count}
              to={`/blog/c/${encodedCategory}`}
            />
          );
        })}
      </div>
    </div>
  );
}
