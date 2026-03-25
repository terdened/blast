export class ScoreModel {
    public position: cc.Vec2;
    public score: number;

    public constructor(init?:Partial<ScoreModel>) {
        Object.assign(this, init);
    }
}