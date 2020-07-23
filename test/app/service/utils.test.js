const { app, mock, assert } = require('egg-mock/bootstrap');
describe('test utils', () => {
    it('should clean files', async () => {
      // 创建 ctx
      const ctx = app.mockContext();
      // 通过 ctx 访问到 service.user
      await ctx.service.utils.fileClean('/root/TIDB_api/result/GO', 2, []);
      assert(true);
    });
    it('should get unique genes', async () => {
      // 创建 ctx
      const ctx = app.mockContext();
      // 通过 ctx 访问到 service.user
      await ctx.service.utils.getGeneData();
      assert(true);
    });
  });