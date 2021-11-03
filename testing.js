export const mockMethodCall = (methodName, ...args) => {
  const context =
    args && args[args.length - 1] && args[args.length - 1].context
      ? args[args.length - 1].context
      : {};

  const methodInstance = Meteor.server.method_handlers[methodName];

  return methodInstance.apply(context, [...args]);
};
