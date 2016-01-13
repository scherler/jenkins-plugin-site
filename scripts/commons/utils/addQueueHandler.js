module.exports = function addQueueHandler(context, fcName) {
  context['_' + fcName] = function () {
    if (context.cacheEvents) {
      context.queue.push({
        handler: fcName,
        args: arguments
      });
    } else {
      if (context.shouldHandleEvent.apply(context, arguments)) {
        context[fcName].apply(context, arguments);
      } else {
        if (context.onUnappliedEvent) {
          context.onUnappliedEvent.apply(context, arguments);
        }
      }
    }
  };
  return '_' + fcName;
};
