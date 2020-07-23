const Service = require('egg').Service;
const execa = require('execa')
const {execSync, exec} = require("child_process")
const axios = require('axios')
const {v4:uuidv4} = require("uuid");
const fs = require('fs-extra')
const csvParse = require('csv-parse/lib/sync')

class AnalysisService extends Service {
  async writeGoFile(geneSymbols) {
    let flag = uuidv4();
    let dirPath = `${this.config.programResult}/GO/${flag}`;
    await fs.ensureDir(dirPath);
    fs.writeFileSync(`${dirPath}/input`, geneSymbols.replace(/,/g,"\n"))
    return flag;
  }
  async GOanalysis({species, goClass, cutoff, FDR="FALSE", featuresNumber=10, chartType="dot", flag}) {
    let dirPath = `${this.config.programResult}/GO/${flag}`;
    const cmd = `Rscript --vanilla ${this.config.programPath}/GO-enrichment/GO-enrichment.R ${dirPath}/input  "${species}" "${goClass}" ${cutoff} ${FDR} ${featuresNumber} ${chartType} ${dirPath}/table.csv ${dirPath}/plot.png ${dirPath}/enrich_res.rda`;
    console.log(111, cmd);
    //execSync(cmd);
    const nsp = this.app.io.of('/task_socket');
    exec(cmd,{}, (error, stdout, stderr)=>{
      let status = error? "error": "success";
      let tableDatas = error?[]:csvParse(fs.readFileSync(`${dirPath}/table.csv`),{columns:true});
      nsp.to(flag).emit("taskOver",{status, tableDatas, taskType: "go"});
    })
    //let tableDatas = csvParse(fs.readFileSync(`${dirPath}/table.csv`),{columns:true})
    //return {status: "success", tableDatas};
  }
  async redrawGoChart({flag, featuresNumber, chartType="dot"}) {
    let dirPath = `${this.config.programResult}/GO/${flag}`;
    const cmd = `Rscript --vanilla ${this.config.programPath}/GO-enrichment/GO-visualization.R ${dirPath}/enrich_res.rda ${chartType} ${featuresNumber} ${dirPath}/plot.png`;
    console.log(222, cmd);
    const nsp = this.app.io.of('/task_socket');
    exec(cmd,{}, (error, stdout, stderr)=>{
      let status = error? "error": "success";
      nsp.to(flag).emit("taskOver",{status, taskType: "goRedraw"});
    })
    //execSync(cmd);
    //return {status: "success"};
  }
  /**
   * 查询数据库获取gene的ensembl信息
   * @param userGene
   * @returns {Promise<void>}
   */
  async getEnsembl (userGene) {
    const records = await this.ctx.model.GeneEnsembl.find({ensembl: {$in: userGene.split(",")}}, "ensembl, gene_symbol", {lean: true}).exec();
    return records.map(item => item["ensembl"]).join(",");
  }

  async runReactome (userGene) {
    const userInputGene = userGene.replace(/,/g, "\n");
    const res = await axios.post("http://reactome.ncpsb.org/AnalysisService/identifiers/projection?interactors=false&pageSize=20&page=1",
      `#Genes\n${userInputGene}`,
      {headers: {'Content-Type': 'text/plain'}})
    return res.data.summary.token;
  }

  async writePPIFile(geneSymbols) {
    let flag = uuidv4();
    let dirPath = `${this.config.programResult}/PPI/${flag}`;
    await fs.ensureDir(dirPath);
    fs.writeFileSync(`${dirPath}/input`, geneSymbols)
    return flag;
  }
  async PPI({times, cutoff, species, flag}){
    let dirPath = `${this.config.programResult}/PPI/${flag}`;
    let scriptPath = `${this.config.programPath}/PPI`;
    let seeds = fs.readFileSync(`${dirPath}/input`).toString().trim();
    const cmd = `python ppi.py --times=${times} --seeds=${seeds} --cutoff=${cutoff} --species=${species} --output_dir=${dirPath}/`
    console.log('PPI command: ' +cmd);
    //execSync(cmd, {cwd: scriptPath});
    await this.service.utils.runCommand(cmd, scriptPath, dirPath)
    //return this.getNetworkData(dirPath);
    return "success";
  }
  async getPPIResult({flag}) {
    let dirPath = `${this.config.programResult}/PPI/${flag}`;
    return this.getNetworkData(dirPath);
  }
  getNetworkData(resultPath) {
    let elements = [], missGenes="", nodesArr=[];
    let checkCotent = fs.readFileSync(`${resultPath}/check.txt`).toString().trim();
    let checkArr = checkCotent.split("\n");
    let tipCode = 1;//正常
    if(checkArr.length){
      let line1 = checkArr[0];
      if(line1 === "partial") {
        tipCode = 2;
        missGenes = checkArr[1];
      }else if("none" === line1){
        tipCode = 3;//没有匹配的基因
      }
    }
    if(tipCode !== 3){
      nodesArr = csvParse(fs.readFileSync(`${resultPath}/seed_based_subnetwork_nodes.csv`),{columns:true});
      let edgeArr = csvParse(fs.readFileSync(`${resultPath}/seed_based_subnetwork_edges.csv`),{columns:true});
      nodesArr.forEach(item=>{
        elements.push({
          data:{id:item.node}
        })
      })
      edgeArr.forEach(({source, target}) => {
        let id = `${source}_${target}`;
        elements.push({
          data:{id, source, target}
        })
      });
    }
    return {status: "success", elements, "nodeNumber":nodesArr.length, missGenes, tipCode};
  }


}

module.exports = AnalysisService
