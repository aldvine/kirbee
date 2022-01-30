export const CHARACTER_KIRBY = "KIRBY";
export const CHARACTER_KNIGHT = "KNIGHT";
export class Character {
  constructor(name, startImage, winImage, loseImage) {
    this.name = name;
    this.startImage = startImage;
    this.winImage = winImage;
    this.loseImage = loseImage;
  }

  getWinImage() {
    return this.winImage;
  }
  getLoseImage() {
    return this.loseImage;
  }
  getStartImage() {
    return this.startImage;
  }
}
