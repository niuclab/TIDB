module.exports = app => {
    return {
        schedule: {
            cron: '0 0 3 * * *', // 1 分钟间隔
            type: 'worker', // 指定所有的 worker 都需要执行
        },
        async task(ctx) {
            const dirPath = app.config.programResult
            await ctx.service.utils.fileClean(dirPath+"/GO", 2, []);//保存三天数据
            await ctx.service.utils.fileClean(dirPath+"/PPI", 2, []);//保存三天数据
        }
    }
}