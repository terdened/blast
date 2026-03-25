export const fInterpTo = (current: number, target: number, dt: number, speed: number) => {
    if (speed <= 0) return target;

    const dist = target - current;
    if (Math.abs(dist) < 0.0001) return target;

    const deltaMove = dist * Math.min(dt * speed, 1);
    return current + deltaMove;
}

export const v2InterpTo = (current: cc.Vec2, target: cc.Vec2, dt: number, speed: number) => {
    return new cc.Vec2(
        fInterpTo(current.x, target.x, dt, speed),
        fInterpTo(current.y, target.y, dt, speed)
    );
}