import { GridModel } from '../models/GridModel';
import { TileModel } from '../models/TileModel';
import { TileColor } from '../common/enums/TileColor';
import { TileBehaviorFactory } from './tileBehaviors/TileBehaviorFactory';
import { TileType } from '../common/enums/TileType';

export class GridService {
    eventTarget: cc.EventTarget = new cc.EventTarget();

    public createGrid(width: number, height: number): GridModel {
        const result = new GridModel({
            width: width,
            height: height,
            tiles: []
        });

        return result;
    }

    public createTiles(grid: GridModel): void {
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

    public createTile(x: number, y: number): TileModel {
        const randomColor = Math.floor(Math.random() * 5);
        const tile = new TileModel({
            position: new cc.Vec2(x, y),
            type: TileType.TT_Color,
            color: randomColor as TileColor
        });

        return tile;
    }

    public createBomb(x: number, y: number): TileModel {
        const randomColor = Math.floor(Math.random() * 5);
        const tile = new TileModel({
            position: new cc.Vec2(x, y),
            type: TileType.TT_Bomb,
            color: randomColor as TileColor
        });

        return tile;
    }

    public applyGravity(grid: GridModel): void {
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

    public moveTile(tile: TileModel, x: number, y: number, grid: GridModel): void {
        grid.tiles[y][x] = tile;
        grid.tiles[tile.position.y][tile.position.x] = undefined;

        tile.position.x = x;
        tile.position.y = y;
    }

    public removeTile(tile: TileModel, grid: GridModel): void {
        if(tile === undefined) {
            return;
        }

        grid.tiles[tile.position.y][tile.position.x] = undefined;
    }

    public fillEmptyCells(grid: GridModel): void {
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

    public getNeighbors(tile: TileModel, grid: GridModel): TileModel[] {
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

    public findConnected(startTile: TileModel, grid: GridModel): TileModel[] {
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

    public collectTile(tile: TileModel, grid: GridModel): number {
        let removedTiles: TileModel[] = [];

        const behavior = TileBehaviorFactory.get(tile.type);
        const group = behavior.activate(tile, grid);

        if (group.length >= 2) {
            const score = group.length * 5;

            if (this.generateBonus(tile, group)) {
                group.shift();
            }

            for (const item of group) {
                this.removeTile(item, grid);
                removedTiles.push(item);
            }

            this.applyGravity(grid);
            this.fillEmptyCells(grid);

            this.eventTarget.emit('TilesRemoved', removedTiles);
            return score;
        }

        return 0;
    }

    public generateBonus(tile: TileModel, group: TileModel[]): boolean {
        if (tile.type === TileType.TT_Color && group.length > 4) {
            const groupSize = this.getGroupSize(group);

            if(group.length > 9) {
                tile.type = TileType.TT_SuperBomb;
            } else if (groupSize.x > groupSize.y) {
                tile.type = TileType.TT_HorizontalRocket;
            } else if(groupSize.y > groupSize.x) {
                tile.type = TileType.TT_VerticalRocket;
            } else {
                tile.type = TileType.TT_Bomb;
            }

            this.eventTarget.emit('TilesUpdated', [tile]);
            
            return true;
        }

        return false
    }

    public shuffleGrid(grid: GridModel): void {
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

    public flatten(grid: TileModel[][]): TileModel[] {
        const result: TileModel[] = [];

        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                result.push(grid[y][x]);
            }
        }

        return result;
    }

    public hasMoves(grid: GridModel): boolean {
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

    public findGroup(startX: number, startY: number, visited: Set<string>, grid: GridModel): TileModel[] {

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

    public getGroupSize(group: TileModel[]): cc.Vec2 {
        const minX = Math.min(...group.map(_ => _.position.x));
        const minY = Math.min(...group.map(_ => _.position.y));
        const maxX = Math.max(...group.map(_ => _.position.x));
        const maxY = Math.max(...group.map(_ => _.position.y));

        return new cc.Vec2(maxX - minX, maxY - minY);
    }
}


