import { TileModel } from "../TileModel";

export class GridUpdateResult {
    public created: TileModel[] = [];
    public removed: TileModel[] = [];
    public updated: TileModel[] = [];

    append(right: GridUpdateResult) {
        this.created = this.created.concat(right.created);
        this.removed = this.removed.concat(right.removed);
        this.updated = this.updated.concat(right.updated);
    }
    
    public constructor(init?:Partial<GridUpdateResult>) {
        Object.assign(this, init);
    }
};