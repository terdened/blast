import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { v2InterpTo } from '../common/extentsions/MathExtentions';
import { GameConstants } from '../common/GameConstants';
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
    private _velocity: number = 0;

    protected onEnable(): void {
        this._registerNodeEvent();
    }

    protected onDisable(): void {
        this._unregisterNodeEvent();
    }

    public setSpawnPosition(spawnHeight: number) {
        this.node.setPosition(new cc.Vec2(this._targetPosition.x, spawnHeight));
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
        this._velocity = 0;

        let spriteComponent = this.getComponent(cc.Sprite);
        spriteComponent.spriteFrame = this.frames[this.model.color];

        this.node.zIndex = this.model.position.y;
    }

    private calculateTargetPosition(): cc.Vec2 {
        return new cc.Vec2(this.model.position.x * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2, this.model.position.y * GameConstants.TILE_SIZE + GameConstants.TILE_SIZE / 2);
    }

    private handlePosition(dt: number): void {
        if (this._movementFinished) {
            return;
        }

        this._velocity += dt * GameConstants.GRAVITY_FORCE;
        let newPosition = v2InterpTo(this.node.getPosition(), this._targetPosition, dt, this._velocity);
        this.node.setPosition(newPosition);
    }
}


