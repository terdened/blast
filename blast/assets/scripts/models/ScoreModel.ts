export class ScoreModel {
    position: cc.Vec2;
    score: number;

    public constructor(init?:Partial<ScoreModel>) {
        Object.assign(this, init);
    }
}