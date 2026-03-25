import { GridModel } from '../models/GridModel';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';

export class GridService {
    eventTarget: cc.EventTarget = new cc.EventTarget();

    createGrid(width: number, height: number): GridModel {
        const result = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        return result;
    }

    createTiles(grid: GridModel) {
        let createdTiles: TileModel[] = [];

        for (var y = 0; y < grid.height; y++)
        {
            let row: TileModel[] = [];
            
            for (var x = 0; x < grid.width; x++)
            {
                const tile = this.createTile(x, y);
                row.push(tile);
                createdTiles.push(tile);
            }

            grid.tiles.push(row);
        }

        this.eventTarget.emit('TilesCreated', createdTiles);
    }

    createTile(x: number, y: number): TileModel {
        const randomColor = Math.floor(Math.random() * 5);
        const tile = new TileModel({
            position: new cc.Vec2(x, y),
            color: randomColor as TileColor
        });

        return tile;
    }

    applyGravity(grid: GridModel) {
        let updatedTiles: TileModel[] = [];
        for (let x = 0; x < grid.width; x++) {
            let emptyY = 0;

            for (let y = 0; y < grid.height; y++) {
                const tile = grid.tiles[y][x];

                if (tile !== undefined) {
                    if (y !== emptyY) {
                        this.moveTile(tile, x, emptyY, grid);
                        updatedTiles.push(tile);
                    }

                    emptyY++;
                }
            }
        }

        this.eventTarget.emit('TilesUpdated', updatedTiles);
    }

    moveTile(tile: TileModel, x: number, y: number, grid: GridModel) {
        grid.tiles[y][x] = tile;
        grid.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;
    }

    removeTile(tile: TileModel, grid: GridModel) {
        if(tile === undefined) {
            return;
        }

        grid.tiles[tile.position.y][tile.position.x] = undefined;
    }

    fillEmptyCells(grid: GridModel) {
        let createdTiles: TileModel[] = [];
        for (let x = 0; x < grid.width; x++) {
            for (let y = 0; y < grid.height; y++) {
                if (grid.tiles[y][x] === undefined) {
                    const tileModel = this.createTile(x, y);
                    grid.tiles[y][x] = tileModel;
                    createdTiles.push(tileModel);
                }
            }
        }
        this.eventTarget.emit('TilesCreated', createdTiles);
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
        let removedTiles: TileModel[] = [];

        if (group.length >= 2) {
            for (const item of group) {
                this.removeTile(item, grid);
                removedTiles.push(item);
            }

            this.applyGravity(grid);
            this.fillEmptyCells(grid);

            this.eventTarget.emit('TilesRemoved', removedTiles);
            return group.length * 5;
        }

        return 0;
    }

    shuffleGrid(grid: GridModel) {
        const flat = this.flatten(grid.tiles);
        let updatedTiles: TileModel[] = [];

        for (let i = flat.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [flat[i], flat[j]] = [flat[j], flat[i]];
        }

        let index = 0;
        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                grid.tiles[y][x] = flat[index++];
                grid.tiles[y][x].position.x = x;
                grid.tiles[y][x].position.y = y;
            }
        }

        this.eventTarget.emit('TilesUpdated', updatedTiles);
    }

    flatten(grid: TileModel[][]): TileModel[] {
        const result: TileModel[] = [];

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                result.push(grid[y][x]);
            }
        }

        return result;
    }

    hasMoves(grid: GridModel): boolean {
        const visited = new Set<string>();

        for (let y = 0; y < grid.height; y++) {
            for (let x = 0; x < grid.width; x++) {
                const key = `${x}_${y}`;

                if (visited.has(key)) continue;

                const group = this.findGroup(x, y, visited, grid);

                if (group.length >= 2) {
                    return true;
                }
            }
        }

        return false;
    }

    findGroup(startX: number, startY: number, visited: Set<string>, grid: GridModel): TileModel[] {

        const stack: TileModel[] = [grid.tiles[startY][startX]];
        const result: TileModel[] = [];
        const color = grid.tiles[startY][startX].color;

        while (stack.length > 0) {
            const tile = stack.pop()!;
            const key = `${tile.position.x}_${tile.position.y}`;

            if (visited.has(key)) continue;
            
            if (tile.color !== color) continue;

            visited.add(key);

            result.push(tile);

            const neighbors = this.getNeighbors(tile, grid);

            for (const n of neighbors) {
                stack.push(n);
            }
        }

        return result;
    }
}


