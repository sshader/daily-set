"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { createContext, ReactNode, useCallback, useState } from "react";

type PuzzleContextType = {
  puzzleId: Id<"puzzles"> | undefined;
  selectedCards: Array<number>;
  selectCard: (
    cardNumber: number,
  ) => Promise<null | { result: "NotASet" | "AlreadyFound" | "FoundSet" }>;
};

export const PuzzleContext = createContext<PuzzleContextType | undefined>(
  undefined,
);

export default function PuzzleProvider({
  children,
  puzzleId,
}: {
  children: ReactNode;
  puzzleId: Id<"puzzles">;
}) {
  const [selectedCards, setSelectedCards] = useState<Array<number>>([]);
  const checkSet = useMutation(api.play.checkSet);
  const selectCard = useCallback(
    async (cardNumber: number) => {
      if (selectedCards.includes(cardNumber)) {
        setSelectedCards(selectedCards.filter((c) => c !== cardNumber));
        return null;
      }
      if (selectedCards.length === 3) {
        // Don't allow more than 3 cards to be selected
        return null;
      }
      const newSelectedCards = [...selectedCards, cardNumber];
      if (newSelectedCards.length === 3) {
        const result = await checkSet({ cards: newSelectedCards, puzzleId });
        setTimeout(() => setSelectedCards([]), 1000);
        return result;
      }
      setSelectedCards(newSelectedCards);
      return null;
    },
    [checkSet, setSelectedCards, selectedCards, puzzleId],
  );
  return (
    <PuzzleContext.Provider
      value={{
        puzzleId,
        selectedCards,
        selectCard,
      }}
    >
      {children}
    </PuzzleContext.Provider>
  );
}
