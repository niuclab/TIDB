const Service = require('egg').Service;
const fs = require('fs-extra'), moment = require('moment');
const {exec} = require("child_process")

class UtilsService extends Service {
    async fileClean(dirPath, saveTime, exceptFiles=[]){
        let files = fs.readdirSync(dirPath);
        for(let file of files) {
            if(!exceptFiles.includes(file)){
                let {birthtime} = fs.statSync(`${dirPath}/${file}`)
                let saveDays = moment().diff(moment(birthtime),'days')
                if(saveTime >= saveDays-1){
                    fs.removeSync(`${dirPath}/${file}`)
                }
            }
        }
    }
    //获取gene数据
    async getGeneData() {
        let geneRecords = await this.ctx.model.TidbGene.aggregate([
            {
                '$group': {
                  '_id': '$gene_symbol', 
                  'count': {
                    '$sum': 1
                  }
                }
              }, {
                '$project': {
                  '_id': 1
                }
            }
        ]);
        let genes = [];
        geneRecords.forEach(item=>{
            genes.push(`"${item._id}"`);
        })
        console.log(`(${genes.join(",")})`)
    }
    //异步执行脚本
    async runCommand(cmd, execPath, resultPath) {
        await fs.remove(`${resultPath}/execError`);
        await fs.remove(`${resultPath}/execSuccess`);
        exec(cmd, {cwd: execPath}, (error, stdout, stderr)=>{
            if(error){
                fs.writeFileSync(`${resultPath}/execError`, error);
            }else {
                fs.writeFileSync(`${resultPath}/execSuccess`, stdout);
            }
        })
    }
    //检查任务是否完成
    async checkJob(resultPath){
        if(fs.existsSync(`${resultPath}/execError`)) {
            return {status:"error"}
        }else if(fs.existsSync(`${resultPath}/execSuccess`)) {
            return {status:"success"}
        }else{
            return {status:"running"}
        }
    }
}
module.exports = UtilsService;