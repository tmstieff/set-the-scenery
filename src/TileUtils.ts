import MapHelper from "./MapHelper";
import Pollyfill from "./Polyfill";

class ObjectUtil {
    public static getElementAtZ<T>(x: number, y: number, surfaceDelta: number, type: TileElementType): T[] {
        const tile = map.getTile(x, y);
        let elements: T[] = [];
        for (let i = 0; i < tile.numElements; i++) {
            // @ts-ignore
            let element = tile.getElement(i);
            // Check if the type matches at the current desired level
            if (element.type === type) {
                const groundLevel = MapHelper.getTileSurfaceZ(x, y);
                if (element.baseHeight === (groundLevel + surfaceDelta)) {
                    // @ts-ignore
                    elements.push(element as T);
                }
            }
        }

        return elements;
    }

    public static getWallAtSurfaceDelta(x: number, y: number, surfaceDelta: number): WallElement | null {
        let walls = ObjectUtil.getElementAtZ(x, y, surfaceDelta, 'wall');
        if (walls.length > 0) {
            return walls[0] as WallElement;
        }

        return null;
    }

    public static getWallsAtSurfaceDelta(x: number, y: number, surfaceDelta: number): WallElement[] {
        return ObjectUtil.getElementAtZ(x, y, surfaceDelta, 'wall');
    }

    public static placeWallRectangle(start: { x: number, y: number }, end: { x: number, y: number }, objectId: number, surfaceDelta: number, objectHeight: number) {
        let left = Math.floor(Math.min(start.x, end.x));
        let right = Math.floor(Math.max(start.x, end.x));
        let top = Math.floor(Math.min(start.y, end.y));
        let bottom = Math.floor(Math.max(start.y, end.y));

        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                let currentTile = map.getTile(x, y);
                let surfaceHeight = MapHelper.getTileSurfaceZ(x, y);


                const existingWalls = ObjectUtil.getWallsAtSurfaceDelta(x, y, surfaceDelta);
                existingWalls.forEach(wall => {
                    console.log({ type: wall.type, direction: wall.direction })
                })

                // Check if on an edge
                if (x == left) {
                    // Check for a collision
                    const existingWalls = ObjectUtil.getWallsAtSurfaceDelta(x, y, surfaceDelta);
                    if (!Pollyfill.anyExists(existingWalls, (wall: WallElement) => wall.direction === 0)) {
                        const newLeftWall = MapHelper.placeWall(currentTile, objectId, surfaceHeight + surfaceDelta, objectHeight, 0);
                    }

                    currentTile = map.getTile(x, y);
                }

                if (x == right) {
                    // Check for a collision

                    const existingWalls = ObjectUtil.getWallsAtSurfaceDelta(x, y, surfaceDelta);
                    if (!Pollyfill.anyExists(existingWalls, (wall: WallElement) => wall.direction === 2)) {
                        const newRightWall = MapHelper.placeWall(currentTile, objectId, surfaceHeight + surfaceDelta, objectHeight, 2);
                    }

                    currentTile = map.getTile(x, y);
                }

                if (y == top) {
                    // Check for a collision
                    const existingWalls = ObjectUtil.getWallsAtSurfaceDelta(x, y, surfaceDelta);
                    if (!Pollyfill.anyExists(existingWalls, (wall: WallElement) => wall.direction === 3)) {
                        const newTopWall = MapHelper.placeWall(currentTile, objectId, surfaceHeight + surfaceDelta, objectHeight, 3);
                    }

                    currentTile = map.getTile(x, y);
                }

                if (y == bottom) {
                    // Check for a collision
                    const existingWalls = ObjectUtil.getWallsAtSurfaceDelta(x, y, surfaceDelta);
                    if (!Pollyfill.anyExists(existingWalls, (wall: WallElement) => wall.direction === 1)) {
                        const newBottomWall = MapHelper.placeWall(currentTile, objectId, surfaceHeight + surfaceDelta, objectHeight, 1);
                    }

                    currentTile = map.getTile(x, y);
                }
            }
        }
    }

}

export default ObjectUtil;