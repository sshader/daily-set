"use client";

import { useCallback, useContext } from "react";
import { colorSets, type Card } from "../common/cards";
import { PuzzleContext } from "./PuzzleProvider";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
import { useToast } from "./ui/use-toast";
import confetti from "canvas-confetti";

const paths = {
  Diamond: {
    d: "M25 0 L50 50 L25 100 L0 50 Z",
  },
  Squiggle: {
    d: "M38.4,63.4c0,16.1,11,19.9,10.6,28.3c-0.5,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
  },
  Oval: {
    d: "M25,99.5C14.2,99.5,5.5,90.8,5.5,80V20C5.5,9.2,14.2,0.5,25,0.5S44.5,9.2,44.5,20v60 C44.5,90.8,35.8,99.5,25,99.5z",
  },
};

const sizeMap = {
  Small: {
    width: 20,
    height: 40,
    strokeWidth: 2,
    cardClass: "w-32 h-16",
  },
  Medium: {
    width: 50,
    height: 100,
    strokeWidth: 4,
    cardClass: "w-64 h-32",
  },
  Large: {
    width: 100,
    height: 200,
    strokeWidth: 8,
    cardClass: "w-96 h-48",
  },
};

export function Card({
  card,
  onClick,
  disabled = false,
  selected = false,
  size = "Medium",
  colorPalette,
}: {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  size?: "Small" | "Medium" | "Large";
  colorPalette: keyof typeof colorSets;
}) {
  const colors = colorSets[colorPalette];
  const dimensions = sizeMap[size];
  const shape = (
    <svg
      viewBox="-2 -2 54 104"
      width={dimensions.width}
      height={dimensions.height}
    >
      <path
        width="100"
        height="100"
        d={paths[card.shape].d}
        stroke={colors[card.color]}
        strokeWidth={4}
        fill={
          card.fill === "Striped"
            ? `url(#striped-${card.color})`
            : card.fill === "Open"
              ? "none"
              : colors[card.color]
        }
      />
    </svg>
  );
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex gap-2 flex-shrink-0 justify-center items-center rounded-xl bg-white p-4 relative",
        dimensions.cardClass,
        "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none",
        selected
          ? "before:border-4 before:border-blue-500"
          : "before:border-2 before:border-gray-700",
      )}
    >
      {/* <div>
        <div className="font-black text-neutral-950">{card.cardNumber}</div>
        <div className="font-black text-neutral-950">{card.fill}</div>
        <div className="font-black text-neutral-950">{card.color}</div>
      </div> */}
      {card.count === 1 ? (
        shape
      ) : card.count === 2 ? (
        <>
          {shape}
          {shape}
        </>
      ) : (
        <>
          {shape}
          {shape}
          {shape}
        </>
      )}
    </button>
  );
}

export function InteractiveCard({
  card,
  colorPalette,
}: {
  card: Card;
  colorPalette: keyof typeof colorSets;
}) {
  const colors = colorSets[colorPalette];
  const { selectedCards, selectCard } = useContext(PuzzleContext)!;
  const { isAuthenticated } = useConvexAuth();
  const { toast } = useToast();
  const onClick = useCallback(() => {
    if (!isAuthenticated) {
      return;
    }
    selectCard(card.cardNumber)
      .then((r) => {
        if (r === null) {
          return;
        }
        switch (r.result) {
          case "AlreadyFound":
            toast({
              title: "Already found",
              description: "You already found this set",
            });
            break;
          case "NotASet":
            toast({
              title: "Not a set",
              description: "This is not a valid set",
            });
            break;
          case "FoundSet":
            void confetti({
              colors: Object.values(colors),
              shapes: Object.values(paths).map((p) => {
                return confetti.shapeFromPath({ path: p.d });
              }),
            });
            break;
          default:
            break;
        }
      })
      .catch((e) => {
        toast({
          title: "Error",
          description: "There was an error selecting this card",
        });
      });
  }, [card.cardNumber, isAuthenticated, selectCard, toast, colors]);
  return (
    <Card
      card={card}
      onClick={onClick}
      disabled={!isAuthenticated}
      selected={selectedCards.includes(card.cardNumber)}
      colorPalette={colorPalette}
    />
  );
}
