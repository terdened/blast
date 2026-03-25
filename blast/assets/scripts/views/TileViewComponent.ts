import { TileModel } from '../models/TileModel';
import { BaseViewComponent } from '../common/components/BaseViewComponent';
import { v2InterpTo } from '../common/extentsions/MathExtentions';
import { GameConstants } from '../common/GameConstants';
import { TileType } from '../common/enums/TileType';
const { ccclass, property } = cc._decorator;

@ccclass
export class TileViewComponent extends BaseViewComponent<TileModel> {
    public events = new cc.EventTarget();

    @property({type: cc.Node})
    public collision: cc.Node = null;

    @property([cc.SpriteFrame])
    public frames: cc.SpriteFrame[] = [];

    @property({type: cc.SpriteFrame})
    public horizontalRocketFrame: cc.SpriteFrame = null;

    @property({type: cc.SpriteFrame})
    public verticalRocketFrame: cc.SpriteFrame = null;

    @property({type: cc.SpriteFrame})
    public bombFrame: cc.SpriteFrame = null;

    @property({type: cc.SpriteFrame})
    public superBombFrame: cc.SpriteFrame = null;

    private _movementFinished: boolean = true;
    private _targetPosition: cc.Vec2;
    private _velocity: number = 0;

    public setSpawnPosition(spawnHeight: number) {
        this.node.setPosition(new cc.Vec2(this._targetPosition.x, spawnHeight));
    }

    public dirty(): void {
        this._targetPosition = this.calculateTargetPosition();
        this._movementFinished = false;
        this._velocity = 0;

        this.node.zIndex = this.model.position.y;

        this.setFrame();
    }

    protected onEnable(): void {
        this._registerNodeEvent();
    }

    protected onDisable(): void {
        this.unregisterNodeEvent();
    }

    protected update(dt: number): void {
        this.handlePosition(dt);
    }

    private _registerNodeEvent(): void {
        this.collision.on(cc.Node.EventType.MOUSE_ENTER, this.playHoverAnimation, this);
        this.collision.on(cc.Node.EventType.MOUSE_LEAVE, this.playUnhoverAnimation, this);
        this.collision.on(cc.Node.EventType.MOUSE_DOWN, this.onClick, this);
    }

    private unregisterNodeEvent(): void {
        this.collision.off(cc.Node.EventType.MOUSE_ENTER, this.playHoverAnimation, this);
        this.collision.off(cc.Node.EventType.MOUSE_LEAVE, this.playUnhoverAnimation, this);
        this.collision.off(cc.Node.EventType.MOUSE_DOWN, this.onClick, this);
    }

    private onClick (event?: cc.Event.EventMouse): void {
        this.events.emit('click', this.model);
    }

    private playHoverAnimation() {
        cc.tween(this.node).to(0.2, {scale: 1.1 }, {easing: 'smooth'}).start();
        this.node.color = new cc.Color(128, 128, 128);
    }

    private playUnhoverAnimation() {
        cc.tween(this.node).to(0.2, {scale: 1 }, {easing: 'smooth'}).start();
        this.node.color = new cc.Color(255, 255, 255);
    }

    private setFrame(): void {
        switch (this.model.type) {
            case TileType.TT_Color:
                this.getComponent(cc.Sprite).spriteFrame = this.frames[this.model.color];
                break;
            case TileType.TT_HorizontalRocket:
                this.getComponent(cc.Sprite).spriteFrame = this.horizontalRocketFrame;
                break;
            case TileType.TT_VerticalRocket:
                this.getComponent(cc.Sprite).spriteFrame = this.verticalRocketFrame;
                break;
            case TileType.TT_Bomb:
                this.getComponent(cc.Sprite).spriteFrame = this.bombFrame;
                break;
            case TileType.TT_SuperBomb:
                this.getComponent(cc.Sprite).spriteFrame = this.superBombFrame;
                break;
        }
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


