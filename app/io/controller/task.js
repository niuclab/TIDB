'use strict';

const Controller = require('egg').Controller;

class TaskController extends Controller {
  async submitTask() {
    const { ctx, app } = this;
    const submitData = ctx.args[0];
    let taskType = submitData["taskType"];
    if(taskType === "go"){
        await ctx.service.analysis.GOanalysis(submitData);
    } else if(taskType === 'goRedraw') {
        await ctx.service.analysis.redrawGoChart(submitData);
    }
    await ctx.socket.emit('res', `Hi! I've got your message: ${JSON.stringify(submitData)}`);
  }
}

module.exports = TaskController;
