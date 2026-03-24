import { GridModel } from '../models/GridModel';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';


export class GridService {
    eventTarget: cc.EventTarget = new cc.EventTarget();

    createGrid(width: number, height: number): GridModel {
        const result = new GridModel({
            width: width,
            height: height,
            tiles: this.createTiles(width, height)
        });

        return result;
    }

    createTiles(width: number, height: number): TileModel[][] {
        let result: TileModel[][] = [];
        for (var y = 0; y < height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < width; x++)
            {
                const tile = this.createTile(x, y);
                row.push(tile);
            }

            result.push(row);
        }

        return result;
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

    applyGravity(grid: GridModel) {
        for (let x = 0; x < grid.width; x++) {
            let emptyY = 0;

            for (let y = 0; y < grid.height; y++) {
                const tile = grid.tiles[y][x];

                if (tile !== undefined) {
                    if (y !== emptyY) {
                        this.moveTile(tile, x, emptyY, grid);
                    }

                    emptyY++;
                }
            }
        }
    }

    moveTile(tile: TileModel, x: number, y: number, grid: GridModel) {
        grid.tiles[y][x] = tile;
        grid.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;

        this.eventTarget.emit('TileUpdated', tile);
    }

    removeTileAtPosition(x: number, y: number, grid: GridModel) {
        const tile = grid.tiles[y][x];
        this.removeTile(tile, grid);
    }

    removeTile(tile: TileModel, grid: GridModel) {
        if(tile === undefined) {
            return;
        }

        grid.tiles[tile.position.y][tile.position.x] = undefined;
        this.eventTarget.emit('TileRemoved', tile);
    }

    spawnNewTiles(grid: GridModel) {
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                if (grid.tiles[y][x] == null) {
                    const tileModel = this.createTile(x, y);
                    grid.tiles[y][x] = tileModel;
                }
            }
        }
    }

    getNeighbors(tile: TileModel, grid: GridModel): TileModel[] {
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

            if (grid.tiles[ny] && grid.tiles[ny][nx]) {
                result.push(grid.tiles[ny][nx]);
            }
        }

        return result;
    }

    findConnected(startTile: TileModel, grid: GridModel): TileModel[] {
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

            const neighbors = this.getNeighbors(tile, grid);
            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }

    collectTile(tile: TileModel, grid: GridModel): number {
        const group = this.findConnected(tile, grid);

        if (group.length >= 2) {
            for (const item of group) {
                this.removeTile(item, grid);
            }

            this.applyGravity(grid);
            this.spawnNewTiles(grid);

            return group.length * 5;
        }

        return 0;
    }
}


