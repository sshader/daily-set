import type { Card as CardType } from "@/convex/model/cards";
import { Card } from "./Card";
export const colors = {
  Red: "#e74c3c",
  Green: "#27ae60",
  Purple: "#8e44ad",
};

export function Puzzle({ cards }: { cards: CardType[] }) {
  const rowLength = 4;
  const rows = [];
  for (let i = 0; i < cards.length; i += rowLength) {
    rows.push(cards.slice(i, i + rowLength));
  }
  return (
    <div className="bg-blue-300 flex flex-col gap-10">
      <svg height="0" width="0">
        <defs>
          <pattern
            id="striped-Red"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path d="M-1,1 H5" style={{ stroke: colors.Red, strokeWidth: 1 }} />
          </pattern>
          <pattern
            id="striped-Green"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path
              d="M-1,1 H5"
              style={{ color: colors.Green, strokeWidth: 1 }}
            />
          </pattern>
          <pattern
            id="striped-Purple"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <path
              d="M-1,1 H5"
              style={{ color: colors.Purple, strokeWidth: 1 }}
            />
          </pattern>
        </defs>
      </svg>
      {rows.map((row, idx) => (
        <div className="flex gap-10" key={idx}>
          {row.map((card) => (
            <Card key={card.cardNumber} card={card} />
          ))}
        </div>
      ))}
    </div>
  );
}
