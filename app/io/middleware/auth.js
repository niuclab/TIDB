
module.exports = () => {
    return async (ctx, next) => {
      const { app, socket, logger, helper } = ctx;
      const id = socket.id;
      const nsp = app.io.of('/task_socket');
      const query = socket.handshake.query;
  
      // 任务信息
      const { taskId } = query;
      const tick = (id, msg) => {
        logger.debug('#tick', id, msg);
  
        // 踢出用户前发送消息
        socket.emit(id, helper.parseMsg('deny', msg));
  
        // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
        nsp.adapter.remoteDisconnect(id, true, err => {
          logger.error(err);
        });
      };
      logger.debug('#join', taskId);
      socket.join(taskId);
      await next();
    };
  };
  