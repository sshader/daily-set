import { getCardForDisplay, type Card as CardType } from "@/common/cards";
import { Card, InteractiveCard } from "./Card";
import { colorSets } from "@/common/cards";

export function Puzzle({
  cards,
  colorPalette,
}: {
  cards: CardType[];
  colorPalette: keyof typeof colorSets;
}) {
  const colors = colorSets[colorPalette];
  const rowLength = 4;
  const rows = [];
  for (let i = 0; i < cards.length; i += rowLength) {
    rows.push(cards.slice(i, i + rowLength));
  }
  const allCards = [];
  for (let i = 0; i < 81; i += 1) {
    allCards.push(
      <Card card={getCardForDisplay(i + 1)} colorPalette={colorPalette}></Card>,
    );
  }
  return (
    <div className="flex flex-col gap-4">
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
              style={{ stroke: colors.Green, strokeWidth: 1 }}
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
              style={{ stroke: colors.Purple, strokeWidth: 1 }}
            />
          </pattern>
        </defs>
      </svg>
      {rows.map((row, idx) => (
        <div className="flex gap-4" key={idx}>
          {row.map((card) => (
            <InteractiveCard
              key={card.cardNumber}
              card={card}
              colorPalette={colorPalette}
            />
          ))}
        </div>
      ))}
      {/* {...allCards} */}
    </div>
  );
}
