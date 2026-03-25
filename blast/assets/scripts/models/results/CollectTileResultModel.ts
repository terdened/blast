import { GridUpdateResult } from "./GridUpdateResult";

export class CollectTileResultModel {
    public updateResult: GridUpdateResult = new GridUpdateResult();
    public score: number = 0;
    
    public constructor(init?:Partial<CollectTileResultModel>) {
        Object.assign(this, init);
    }
}