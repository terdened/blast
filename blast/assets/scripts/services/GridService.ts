import { GridModel } from '../models/GridModel';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';


export class GridService {
    grid: GridModel;
    eventTarget: cc.EventTarget = new cc.EventTarget();

    init(width: number, height: number) {
        this.grid = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        this.createTiles();
    }

    createTiles() {
        for (var y = 0; y < this.grid.height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < this.grid.width; x++)
            {
                const tile = this.createTile(x, y);
                row.push(tile);
            }

            this.grid.tiles.push(row);
        }
    }

    createTile(x: number, y: number): TileModel {
        const randomColor = Math.floor(Math.random() * 5);
        const tile = new TileModel({
            position: new cc.Vec2(x, y),
            color: randomColor as TileColor
        });

        this.eventTarget.emit('TileCreated', tile);

        return tile;
    }

    handleClick(model: TileModel) {
        const group = this.findConnected(model);

        if (group.length >= 2) {
            for (const tile of group) {
                this.removeTile(tile);
            }

            this.applyGravity();
            this.spawnNewTiles();
        }
    }

    applyGravity() {
        for (let x = 0; x < this.grid.width; x++) {
            let emptyY = 0;

            for (let y = 0; y < this.grid.height; y++) {
                const tile = this.grid.tiles[y][x];

                if (tile !== undefined) {
                    if (y !== emptyY) {
                        this.moveTile(tile, x, emptyY);
                    }

                    emptyY++;
                }
            }
        }
    }

    moveTile(tile: TileModel, x: number, y: number) {
        this.grid.tiles[y][x] = tile;
        this.grid.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;

        this.eventTarget.emit('TileUpdated', tile);
    }

    removeTileAtPosition(x: number, y: number) {
        const tile = this.grid.tiles[y][x];
        this.removeTile(tile);
    }

    removeTile(tile: TileModel) {
        if(tile === undefined) {
            return;
        }

        this.grid.tiles[tile.position.y][tile.position.x] = undefined;
        this.eventTarget.emit('TileRemoved', tile);
    }

    spawnNewTiles() {
        for (let x = 0; x < this.grid.width; x++) {
            for (let y = 0; y < this.grid.height; y++) {
                if (this.grid.tiles[y][x] == null) {
                    const tileModel = this.createTile(x, y);
                    this.grid.tiles[y][x] = tileModel;
                }
            }
        }
    }

    getNeighbors(tile: TileModel): TileModel[] {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        const result: TileModel[] = [];

        for (const d of dirs) {
            const nx = tile.position.x + d.x;
            const ny = tile.position.y + d.y;

            if (this.grid.tiles[ny] && this.grid.tiles[ny][nx]) {
                result.push(this.grid.tiles[ny][nx]);
            }
        }

        return result;
    }

    findConnected(startTile: TileModel): TileModel[] {
        const stack: TileModel[] = [startTile];
        const visited = new Set<string>();
        const result: TileModel[] = [];

        const targetColor = startTile.color;

        while (stack.length > 0) {
            const tile = stack.pop()!;
            const key = `${tile.position.x}_${tile.position.y}`;

            if (visited.has(key)) continue;
            visited.add(key);

            if (tile.color !== targetColor) continue;

            result.push(tile);

            const neighbors = this.getNeighbors(tile);
            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
}


