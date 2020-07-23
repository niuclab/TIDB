const { app, mock, assert } = require('egg-mock/bootstrap');
describe('test analysis code', () => {
    it('should run PPI program', async () => {
      // 创建 ctx
      const ctx = app.mockContext();
      // 通过 ctx 访问到 service.user
      let flag = await ctx.service.analysis.writePPIFile("TLR4,NOS2,TNF");
      console.log(11, flag);
      let prams = {times:100, cutoff:0, species:"human", flag};
      let networkData = await ctx.service.analysis.PPI(prams);
      console.log(22, JSON.stringify(networkData, null, 2));
      assert(true);
    });
  });