"use client";

import DataTable from "../DataTable";

const SKELETON_ROWS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }];

export function CoinOverviewFallback() {
  return (
    <div id="coin-overview-fallback">
      <div className="header pt-2">
        <div className="header-image animate-pulse bg-dark-400" />
        <div className="info">
          <div className="header-line-sm animate-pulse rounded bg-dark-400" />
          <div className="header-line-lg animate-pulse rounded bg-dark-400" />
        </div>
      </div>
    </div>
  );
}

const trendingSkeletonColumns: DataTableColumn<{ id: number }>[] = [
  {
    header: "Name",
    cell: () => (
      <div className="name-cell">
        <div className="name-link">
          <div className="name-image animate-pulse bg-dark-400" />
          <div className="name-line animate-pulse rounded bg-dark-400" />
        </div>
      </div>
    ),
  },
  {
    header: "24H Change",
    cell: () => (
      <div className="change-cell">
        <div className="price-change">
          <div className="change-icon animate-pulse bg-dark-400" />
          <div className="change-line animate-pulse rounded bg-dark-400" />
        </div>
      </div>
    ),
  },
  {
    header: "Price",
    cell: () => (
      <div className="price-cell">
        <div className="price-line animate-pulse rounded bg-dark-400" />
      </div>
    ),
  },
];

export function TrendingCoinsFallback() {
  return (
    <div id="trending-coins-fallback">
      <h4>Trending Coins</h4>
      <DataTable
        columns={trendingSkeletonColumns}
        data={SKELETON_ROWS}
        rowKey={(row) => row.id}
        tableClassName="trending-coins-table"
        headerCellClassName="py-3!"
        bodyCellClassName="py-2!"
      />
    </div>
  );
}
