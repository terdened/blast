const {ccclass} = cc._decorator;

@ccclass('BaseViewComponent')
export abstract  class BaseViewComponent<T> extends cc.Component {
    model: T;

    init(model: T): void {
        this.model = model;
        this.dirty();
    }

    abstract dirty(): void;
}