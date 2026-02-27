import { fetcher } from "@/lib/coin-gecko-actions";
import React from "react";
import DataTable from "../DataTable";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

const Categories = async () => {
  const categories = await fetcher<Category[]>("coins/categories");
  const columns: DataTableColumn<Category>[] = [
    {
      header: "Category",
      cellClassName: "category-cell",
      cell: (category) => category.name,
    },
    {
      header: "Top Gainers",
      cellClassName: "top-gainers-cell",
      cell: (category) => {
        return category.top_3_coins.map((img, index) => (
          <Image
            src={img}
            key={img + "-" + index}
            alt={img}
            width={28}
            height={28}
          />
        ));
      },
    },
    {
      header: "24h Change",
      cellClassName: "change-header-cell",
      cell: (category) => {
        const isTrendingUp = category.market_cap_change_24h > 0;
        return (
          <div
            className={cn(
              "price-change",
              isTrendingUp ? "text-green-500" : "text-red-500",
            )}
          >
            <p>
              {isTrendingUp ? (
                <TrendingUp width={16} height={16} />
              ) : (
                <TrendingDown width={16} height={16} />
              )}
              {Math.abs(category.market_cap_change_24h).toFixed(2)}%
            </p>
          </div>
        );
      },
    },
    {
      header: "24h Volume",
      cellClassName: "volume-cell",
      cell: (category) => formatCurrency(category.volume_24h),
    },
    {
      header: "Market Cap",
      cellClassName: "market-cell",
      cell: (category) => formatCurrency(category.market_cap),
    },
  ];
  return (
    <div id="categories" className="custom-scrollbar">
      <h4>Top Categories</h4>
      <DataTable
        columns={columns}
        data={categories.slice(0, 10)}
        rowKey={(_, index) => index}
        tableClassName="mt-3"
      />
    </div>
  );
};

export default Categories;
