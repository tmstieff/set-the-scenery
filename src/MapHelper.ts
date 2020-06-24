class MapHelper {
    static insertTileElement(tile: Tile, height: number): BaseTileElement {
        let index = MapHelper.findPlacementPosition(tile, height);
        let element = tile.insertElement(index);
        // @ts-ignore
        element._index = index;
        element.baseHeight = height;
        return element;
    }

    static findPlacementPosition(tile: Tile, height: number): number {
        let index = 0;
        for (index = 0; index < tile.numElements; index++) {
            let element = tile.getElement(index);
            if (element.baseHeight >= height) {
                break;
            }
        }
        return index;
    }

    static getTileSurfaceZ(x: number, y: number): number | null {
        var tile = map.getTile(x, y);
        if (tile) {
            for (var i = 0; i < tile.numElements; i++) {
                var element = tile.getElement(i);
                if (element && element.type == "surface") {
                    return element.baseHeight;
                }
            }
        }
        return null;
    }

    static placeSmallScenery(tile: Tile, objectIndex: number, height: number, orientation = 0) {
        // @ts-ignore
        const element: SmallSceneryElement = MapHelper.insertTileElement(tile, height);
        element.type = "small_scenery";
        element.object = objectIndex;
        element.primaryColour = 10;
        element.clearanceHeight = height + 1;
        return element;
    }

    static placeWall(tile: Tile, objectIndex: number, baseHeight: number, height: number) {
        // @ts-ignore
        const element: WallElement = MapHelper.insertTileElement(tile, height);
        element.type = "wall";
        element.object = objectIndex;
        element.baseHeight = baseHeight;
        element.clearanceHeight = baseHeight + height;
        return element;
    }

    static getElementIndex(tile, element) {
        for (var i = 0; i < tile.numElements; i++) {
            var elementB = tile.getElement(i);
            if (elementB && element == elementB) {
                return i;
            }
        }
        return null;
    }

    static setPrimaryTileColor(tile: Tile, elementIndex: number, color: number) {
        let data = tile.data;
        let typeFieldIndex = 6;
        data[16 * elementIndex + typeFieldIndex] = color;
        tile.data = data;
    }

    static setTileElementRotation(tile: Tile, elementIndex: number, orientation: number) {
        let data = tile.data;
        let typeFieldIndex = 0;
        let directionMask = 3;
        data[16 * elementIndex + typeFieldIndex] &= ~directionMask;
        data[16 * elementIndex + typeFieldIndex] |= orientation & directionMask;
        tile.data = data;
    }

    static getTileElementRotation(tile: Tile, elementIndex: number) {
        let data = tile.data;
        let typeFieldIndex = 0;
        let directionMask = 3;
        return (data[16 * elementIndex + typeFieldIndex] & directionMask);
    }
}

export default MapHelper;