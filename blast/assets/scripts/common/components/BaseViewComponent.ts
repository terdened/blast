const {ccclass} = cc._decorator;

@ccclass
export abstract  class BaseViewComponent<T> extends cc.Component {
    public model: T;

    public init(model: T): void {
        this.model = model;
        this.dirty();
    }

    public abstract dirty(): void;
} 