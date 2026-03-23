import { GridModel } from "../models/GridModel";

export interface IBaseConditionService {
    check(grid: GridModel): boolean;
}