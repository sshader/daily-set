import * as cheerio from "cheerio";

export const parsePuzzle = (puzzleHtml: string) => {
  const $ = cheerio.load(puzzleHtml);
  /*
    <div class="set-card-td">
        <a href="javascript:board.cardClicked(2)" border="0">
            <img nopin="nopin" class="A2" src="/sites/all/modules/setgame_set/assets/images/new/7.png" name="card2">
        </a>
        <p class="set-inputs">
            <input name="A2" type="checkbox" onclick="board.count()">
        </p>
    </div>
  */

  // Tuesday, September 24, 2024
  const dateText = $(".set-game-wrapper").children("h1").text();
  const date = new Date(dateText).toISOString();
  const cards = $(".set-card-td")
    .map((i, el) => {
      // /sites/all/modules/setgame_set/assets/images/new/7.png
      const imgSrc = $(el).children("a").children("img").attr("src");
      if (imgSrc === undefined) {
        throw new Error("Couldn't find card image src");
      }
      // 7.png
      const cardFileName = imgSrc.split("/").at(-1);
      // 7
      const cardNumber = cardFileName!.split(".")[0];
      return parseInt(cardNumber);
    })
    .get();
  return { date, cards };
};
