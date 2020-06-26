import Oui from "./OliUI";
import LocationPrompt from "./LocationPrompt";
import MapHelper from "./MapHelper";
import TileUtils from "./TileUtils";

class MainWindow {
    private currentLocationX: number;
    private currentLocationY: number;
    private surfaceDeltaZ: number;
    private lastElement: WallElement | SmallSceneryElement;

    private isSet: boolean;

    private locationPrompt: LocationPrompt;

    private window: any

    constructor() {
        this.currentLocationX = -1;
        this.currentLocationY = -1;

        this.surfaceDeltaZ = 0;

        this.locationPrompt = new LocationPrompt("set-the-scenery-loc-prompt");
        this.window = this.createWindow();
    }

    show() {
        this.window.open();
    }

    onSet(start: { x: number, y: number }, end: { x: number, y: number }) {
        if (start.x > -1 && start.y > -1) {
            const element: WallElement | null = TileUtils.getWallAtSurfaceDelta(start.x, start.y, this.surfaceDeltaZ);
            if (element || this.lastElement) {
                let objectHeight = 4;
                if (element) {
                    this.lastElement = element;

                    objectHeight = element.clearanceHeight - element.baseHeight;
                } else if (this.lastElement) {
                    objectHeight = this.lastElement.clearanceHeight - this.lastElement.baseHeight;
                }

                const zLevel = this.surfaceDeltaZ;
                const objectId = element ? element.object : this.lastElement.object;

                TileUtils.placeWallRectangle(start, end, objectId, zLevel, objectHeight);
            }
        }
    }

    createWindow() {
        const that = this;

        let window = new Oui.Window("set-the-scenery", "Set the Scenery");
        window._paddingBottom = 6;
        window._paddingLeft = 6;
        window._paddingRight = 6;
        window.setColors(24);
        window.setWidth(300);

        window.setOnClose(() => {
            that.locationPrompt.cancel();
        });

        let horizontalBox = new Oui.HorizontalBox();
        horizontalBox.setPadding(0, 0, 0, 0);

        let locateButton = null;
        this.surfaceDeltaZ = 0;

        let promptLocationButton = new Oui.Widgets.ImageButton(5504, () => {
            if (!promptLocationButton.isPressed()) {
                statusLabel.setText("Select a tile...");
                this.locationPrompt.prompt((start: { x: number, y: number }, end: { x: number, y: number }) => {
                    that.currentLocationX = start.x;
                    that.currentLocationY = start.y;
                    locateButton.setIsDisabled(false);
                    promptLocationButton.setIsPressed(false);
                    statusLabel.setText("Location set (x: " + start.x + ", y: " + start.y + ")");
                    that.isSet = true;
                    if (that.onSet)
                        that.onSet(start, end);
                }, () => {
                    promptLocationButton.setIsPressed(false);
                });
                promptLocationButton.setIsPressed(true);
            }
            else {
                if (that.isSet) {
                    statusLabel.setText("Location set (x: " + that.currentLocationX + ", y: " + that.currentLocationY + ")");
                }
                else {
                    statusLabel.setText("No location");
                }
                this.locationPrompt.cancel();
                promptLocationButton.setIsPressed(false);
            }
        });
        promptLocationButton.setWidth(44);
        promptLocationButton.setHeight(32);
        promptLocationButton.setBorder(true);
        horizontalBox.addChild(promptLocationButton);

        let infoBox = new Oui.VerticalBox();
        infoBox._paddingTop = infoBox._paddingTop + 1;
        horizontalBox.addChild(infoBox);
        horizontalBox.setRemainingWidthFiller(infoBox);

        let infoLabel = new Oui.Widgets.Label('Select a corner tile...');
        infoBox.addChild(infoLabel);

        let statusLabel = new Oui.Widgets.Label("No location");
        infoBox.addChild(statusLabel);

        locateButton = new Oui.Widgets.ImageButton(5167, () => {
            ui.mainViewport.scrollTo({ x: that.currentLocationX * 32, y: that.currentLocationY * 32 });
        });
        locateButton.setWidth(24);
        locateButton.setHeight(24);
        locateButton.setIsDisabled(true);
        horizontalBox.addChild(locateButton);

        if (this.isSet) {
            statusLabel.setText("Location set (x: " + this.currentLocationX + ", y: " + this.currentLocationY + ")");
            locateButton.setIsDisabled(false);
        }

        window.addChild(horizontalBox);

        let heightGroupBox = new Oui.GroupBox("Height Adjustment");
        window.addChild(heightGroupBox);

        let heightInput = new Oui.Widgets.Spinner(0, 1, (value: number) => this.surfaceDeltaZ = value);
        heightGroupBox.addChild(heightInput);

        let bottom = new Oui.HorizontalBox();
        bottom.setPadding(0, 0, 0, 0);
        window.addChild(bottom);

        let bottomFiller = new Oui.VerticalBox();
        bottom.addChild(bottomFiller);
        bottom.setRemainingWidthFiller(bottomFiller);


        return window;
    }
}

export default MainWindow;