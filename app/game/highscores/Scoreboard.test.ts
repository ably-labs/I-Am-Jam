import {Scoreboard} from "./Scoreboard";

describe("Scoreboard", () => {

    it("can add scores", () => {
        const scoreboard = new Scoreboard();

        scoreboard.addRange([{ name: "Alice", score: 10 }]);

        expect(scoreboard.scores).toEqual([{ name: "Alice", score: 10 }]);
    });

    it("can add many scores", () => {
        const scoreboard = new Scoreboard();
        
        scoreboard.addRange([{ name: "Alice", score: 10 }]);
        scoreboard.addRange([{ name: "Bob", score: 10 }]);

        expect(scoreboard.scores).toEqual([
            { name: "Alice", score: 10 },
            { name: "Bob", score: 10 }
        ]);
    });

    it("multiple scores update scoreboard", () => {
        const scoreboard = new Scoreboard();
        
        scoreboard.addRange([{ name: "Alice", score: 10 }]);
        scoreboard.addRange([{ name: "Alice", score: 20 }]);

        expect(scoreboard.scores).toEqual([
            { name: "Alice", score: 10 },
        ]);
    });

    it("sorts on add - lowest first", () => {
        const scoreboard = new Scoreboard();
        
        scoreboard.addRange([{ name: "Alice", score: 10 }]);
        scoreboard.addRange([{ name: "Bob", score: 20 }]);

        expect(scoreboard.scores[0]).toEqual({ name: "Alice", score: 10 });
    });

    
    it("multiple scores, updates existing when added", () => {
        const scoreboard = new Scoreboard();        
        scoreboard.addRange([{ name: "Alice", score: 10 }]);
        scoreboard.addRange([{ name: "Bob", score: 20 }]);

        scoreboard.addRange([{ name: "Alice", score: 5 }]);

        expect(scoreboard.scores).toEqual([
            { name: "Alice", score: 5 },
            { name: "Bob", score: 20 }
        ]);
    });
});