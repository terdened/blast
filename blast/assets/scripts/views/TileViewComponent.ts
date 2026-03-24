import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
const { ccclass, property } = cc._decorator;

@ccclass('TileViewComponent')
export class TileViewComponent extends BaseViewComponent<TileModel> {
    public events = new cc.EventTarget();

    @property([cc.Node])
    collision: cc.Node;

    @property([cc.SpriteFrame])
    frames: cc.SpriteFrame[] = [];

    private _movementFinished: boolean = true;
    private _targetPosition: cc.Vec2;
    private _moveTime: number = 0;
    private _moveDuration: number = 2;
    private _tileSize: number = 100;

    protected onEnable(): void {
        this._registerNodeEvent();
    }

    protected onDisable(): void {
        this._unregisterNodeEvent();
    }

    protected start(): void {
        let newPosition = new cc.Vec2();
        cc.Vec2.add(newPosition, this._targetPosition, new cc.Vec2(0, this._tileSize * 2));
        this.node.setPosition(newPosition);
    }

    protected update(dt: number): void {
        this.handlePosition(dt);
    }

    protected _registerNodeEvent(): void {
        this.collision.on(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.collision.on(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        this.collision.on(cc.Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected _unregisterNodeEvent(): void {
        this.collision.off(cc.Node.EventType.MOUSE_ENTER, this._onMouseMoveIn, this);
        this.collision.off(cc.Node.EventType.MOUSE_LEAVE, this._onMouseMoveOut, this);
        this.collision.off(cc.Node.EventType.MOUSE_DOWN, this._onMouseDown, this);
    }

    protected _onMouseMoveIn (event?: cc.Event.EventMouse): void {
        cc.tween(this.node).to(0.2, {scale: 1.1 }, {easing: 'smooth'}).start();
        this.node.color = new cc.Color(128, 128, 128);
    }

    protected _onMouseMoveOut (event?: cc.Event.EventMouse): void {
        cc.tween(this.node).to(0.2, {scale: 1 }, {easing: 'smooth'}).start();
        this.node.color = new cc.Color(255, 255, 255);
    }

    protected _onMouseDown (event?: cc.Event.EventMouse): void {
        this.events.emit('click', this.model);
    }

    public dirty(): void {
        this._targetPosition = this.calculateTargetPosition();
        this._movementFinished = false;
        this._moveTime = 0;
        const randomDuration = Math.floor(Math.random() * 0.5) + 1.5;
        this._moveDuration = randomDuration;

        let spriteComponent = this.getComponent(cc.Sprite);
        spriteComponent.spriteFrame = this.frames[this.model.color];

        this.node.zIndex = this.model.position.y;
    }

    private calculateTargetPosition(): cc.Vec2 {
        return new cc.Vec2(this.model.position.x * this._tileSize + this._tileSize / 2, this.model.position.y * this._tileSize + this._tileSize / 2);
    }

    private handlePosition(dt: number): void {
        if (this._movementFinished) {
            return;
        }

        this._moveTime += dt;
        let ratio = 1.0;
        if (this._moveDuration > 0) {
            ratio = this._moveTime / this._moveDuration;
        }

        if (ratio >= 1) {
            ratio = 1;
        }

        let newPosition = new cc.Vec2();
        cc.Vec2.lerp(newPosition, this.node.getPosition(), this._targetPosition, ratio);
        
        if (cc.Vec2.distance(newPosition, this._targetPosition) < 1) {
            newPosition = this._targetPosition;
            this._movementFinished = true;
        }

        this.node.setPosition(newPosition);
    }
}


