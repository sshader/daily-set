"use client";

import { useContext } from "react";
import type { Card } from "../convex/model/cards";
import { PuzzleContext } from "./PuzzleProvider";
import { cn } from "@/lib/utils";
import { useConvexAuth } from "convex/react";
export const colors = {
  Red: "#e74c3c",
  Green: "#27ae60",
  Purple: "#8e44ad",
};

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

export function Card({ card }: { card: Card }) {
  const { selectedCards, selectCard } = useContext(PuzzleContext)!;
  const { isAuthenticated } = useConvexAuth();
  const shape = (
    <svg viewBox="-2 -2 54 104" width="50" height="100">
      <path
        width="100"
        height="100"
        d={paths[card.shape].d}
        stroke={colors[card.color]}
        strokeWidth={2}
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
      disabled={!isAuthenticated}
      onClick={() => {
        if (!isAuthenticated) {
          return;
        }
        selectCard(card.cardNumber)
          .then((r) => {
            if (r !== null) {
              alert(r);
            }
          })
          .catch((e) => {
            alert(e);
          });
      }}
      className={cn(
        "flex gap-2 justify-center w-40 rounded-xl border border-gray-700 p-2 bg-white",
        selectedCards.includes(card.cardNumber)
          ? "border-4 border-blue-500"
          : "",
      )}
    >
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
