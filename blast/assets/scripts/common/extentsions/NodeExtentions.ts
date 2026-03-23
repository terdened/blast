export const getView = <T extends cc.Component>(
  node: cc.Node,
  type: new (...args: any[]) => T
) => node.getComponent(type);
