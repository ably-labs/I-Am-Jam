export class Scoreboard {

    private items: { name: string; score: number; }[];
    private cap: number;
  
    public get scores(): { name: string; score: number; }[] {
      return this.items;
    }
  
    constructor(items: { name: string; score: number; }[] = null, cap: number = 10) {
      this.items = [];
      this.cap = cap;
      this.addRange(items || []);
    }
  
    public addRange(items: { name: string; score: number; }[]) {

      for (let score of items) {

        if (this.items.filter(x => x.name.trim() === score.name.trim()).length > 0) {

          var currentHighScore = this.items.filter(x => x.name === score.name)[0];
          this.items = this.items.filter(x => x.name !== score.name);

          var bestScore = Math.min(currentHighScore.score, score.score);
          score.score = bestScore;
        }
    
        this.items.push(score);        

        this.items.sort((a, b) => a.score - b.score);
        this.items = this.items.slice(0, this.cap);
      }
    }
}
