export const getCardForDisplay = (cardNumber: number): Card => {
  let num = cardNumber - 1;
  const countBit = num % 3;
  num = (num - countBit) / 3;
  const colorBit = num % 3;
  num = (num - colorBit) / 3;
  const shapeBit = num % 3;
  num = (num - shapeBit) / 3;
  const fillBit = num % 3;
  return {
    count: countBit === 0 ? 1 : countBit === 1 ? 2 : 3,
    color: colorBit === 0 ? "Red" : colorBit === 1 ? "Purple" : "Green",
    shape: shapeBit === 0 ? "Squiggle" : shapeBit === 1 ? "Diamond" : "Oval",
    fill: fillBit === 0 ? "Solid" : fillBit === 1 ? "Striped" : "Open",
    cardNumber,
  };
};

export type Card = {
  color: "Red" | "Green" | "Purple";
  fill: "Solid" | "Open" | "Striped";
  shape: "Oval" | "Diamond" | "Squiggle";
  count: 1 | 2 | 3;
  cardNumber: number;
};

// more color blind friendly
// export const colors = {
//   Red: "#b51963",
//   Green: "#5ba300",
//   Purple: "#054fb9",
// };

export const colors = {
  Red: "#e74c3c",
  Green: "#27ae60",
  Purple: "#8e44ad",
};
