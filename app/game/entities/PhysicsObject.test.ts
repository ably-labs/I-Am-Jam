import { PhysicsObject } from "./PhysicsObject";

describe("PhysicsObject", () => {
    it("can move horizontally", () => {
        const playfield = {
            isSolidSurface: (x: number, y: number) => {
                return x < 0 || x >= 1000 || y < 0 || y >= 1000;
            }
        }

        const physicsObject = new PhysicsObject(0, 0, 100, 100, 1, 0);

        physicsObject.onTick({ playfield } as any);

        expect(physicsObject.x).toBe(1);
        expect(physicsObject.y).toBe(0);
        expect(physicsObject.trailingEdge).toBe(1);
        expect(physicsObject.leadingEdge).toBe(101);
        expect(physicsObject.top).toBe(100);
        expect(physicsObject.bottom).toBe(0);
    }, 33);

    it("can move horizontally, but movement is cut short by obstacle half way through", () => {
        const playfield = {
            isSolidSurface: (x: number, y: number) => {
                return x < 0 || x >= 150 || y < 0 || y >= 1000;
            }
        }

        const physicsObject = new PhysicsObject(0, 0, 100, 100, 50, 0);

        physicsObject.onTick({ playfield } as any);

        expect(physicsObject.x).toBe(0);
        expect(physicsObject.y).toBe(0);
        expect(physicsObject.trailingEdge).toBe(0);
        expect(physicsObject.leadingEdge).toBe(100);
        expect(physicsObject.top).toBe(100);
        expect(physicsObject.bottom).toBe(0);
    }, 33);
    
    it("can fall vertically", () => {
        const playfield = {
            isSolidSurface: (x: number, y: number) => {
                return x < 0 || x >= 1000 || y < 0 || y >= 1000;
            }
        }

        const physicsObject = new PhysicsObject(0, 1, 100, 100, 0, 0);

        physicsObject.onTick({ playfield } as any);

        expect(physicsObject.x).toBe(0);
        expect(physicsObject.y).toBe(0);
        expect(physicsObject.trailingEdge).toBe(0);
        expect(physicsObject.leadingEdge).toBe(100);
        expect(physicsObject.top).toBe(100);
        expect(physicsObject.bottom).toBe(0);
    }, 33);

    it("can move vertically, but movemet is cut short by obstacle half way through", () => {
        const playfield = {
            isSolidSurface: (x: number, y: number) => {
                return x < 0 || x >= 1000 || y < 0 || y >= 1000;
            }
        }

        const physicsObject = new PhysicsObject(0, 0, 100, 100);
        
        physicsObject.x = 0;
        physicsObject.y = 0;
        physicsObject.velocityX = 0;
        physicsObject.velocityY = 50;

        physicsObject.onTick({ playfield } as any);

        expect(physicsObject.x).toBe(0);
        expect(physicsObject.y).toBe(48);
        expect(physicsObject.trailingEdge).toBe(0);
        expect(physicsObject.leadingEdge).toBe(100);
        expect(physicsObject.top).toBe(148);
        expect(physicsObject.bottom).toBe(48);
    }, 33);
});