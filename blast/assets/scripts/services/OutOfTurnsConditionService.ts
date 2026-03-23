import { TileModel } from "../models/TileModel";
import { GridService } from "./GridService";
import { IBaseConditionService } from "./IBaseConditionService";

export class OutOfTurnsConditionService implements IBaseConditionService {
    maxTurns: number = 10;

    constructor(private _gridService: GridService) {

    }

    check(): boolean {
        return false;
    }
}