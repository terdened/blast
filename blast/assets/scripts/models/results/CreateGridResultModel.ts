import { GridModel } from "../GridModel";
import { GridUpdateResult } from "./GridUpdateResult";

export class CreateGridResultModel {
    public updateResult: GridUpdateResult = new GridUpdateResult();
    public grid: GridModel;
    
    public constructor(init?:Partial<CreateGridResultModel>) {
        Object.assign(this, init);
    }
}