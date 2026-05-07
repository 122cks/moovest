import StockCard from "./StockCard";

export default function StockList({ stocks, onCardClick }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {stocks.map((stock, idx) => (
        <StockCard
          key={`${stock.ticker}-${stock.rank}`}
          stock={stock}
          index={idx}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
