class LocationPrompt {
    private id: string;
    private cursor: CursorType;
    private onFinish: Function;
    private onCancelled: Function;

    private selectedCoords: { x: number, y: number };
    private downCoords: { x: number, y: number };

    private hasGridOn: boolean;

    constructor(id = "set-the-scenery-location-prompt") {
        this.id = id;
        this.cursor = "cross_hair";
        this.onFinish = null;
        this.onCancelled = null;

        this.selectedCoords = { x: 0, y: 0 };
        this.downCoords = { x: 0, y: 0 };

        this.hasGridOn = false;
    }

    setSelectionRange(start: { x: number, y: number }, end: { x: number, y: number }) {
        const left = Math.min(start.x, end.x);
        const right = Math.max(start.x, end.x);
        const top = Math.min(start.y, end.y);
        const bottom = Math.max(start.y, end.y);
        ui.tileSelection.range = {
            leftTop: { x: left, y: top },
            rightBottom: { x: right, y: bottom }
        };
    }

    prompt(onFinish = null, onCancelled = null) {
        if (ui.tool && ui.tool.id == this.id) {
            this.cancel();
        }
        this.onFinish = onFinish;
        this.onCancelled = onCancelled;

        ui.activateTool({
            id: this.id,
            cursor: this.cursor,
            onStart: () => {
                ui.mainViewport.visibilityFlags |= (1 << 7);
            },
            onDown: (e) => {
                if (e.mapCoords.x === 0 && e.mapCoords.y === 0) {
                    return;
                }
                this.downCoords = e.mapCoords;
                this.selectedCoords = e.mapCoords;
            },
            onMove: (e) => {
                if (e.mapCoords.x === 0 && e.mapCoords.y === 0) {
                    return;
                }

                if (e.isDown) {
                    this.selectedCoords = e.mapCoords;
                } else {
                    this.downCoords = e.mapCoords;
                    this.selectedCoords = e.mapCoords;
                }

                this.setSelectionRange(this.downCoords, this.selectedCoords);
            },
            onUp: (e) => {
                this.selectedCoords = e.mapCoords;
                this.setSelectionRange(this.downCoords, this.selectedCoords);
                if (this.onFinish)
                    this.onFinish(
                        {
                            x: Math.floor(this.downCoords.x / 32),
                            y: Math.floor(this.downCoords.y / 32)
                        },
                        {
                            x: Math.floor(this.selectedCoords.x / 32),
                            y: Math.floor(this.selectedCoords.y / 32)
                        });
                ui.tileSelection.range = null;
                ui.tool.cancel();
            },
            onFinish: () => {
                ui.tileSelection.range = null;
                ui.mainViewport.visibilityFlags &= ~(1 << 7);
            },
        });
    }

    cancel() {
        if (ui.tool && ui.tool.id == this.id) {
            if (this.onCancelled) {
                this.onCancelled();
            }
            ui.tool.cancel();
        }
    }
}

export default LocationPrompt;