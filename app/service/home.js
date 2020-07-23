const Service = require('egg').Service;
const _ = require('lodash')
const axios = require('axios')

class HomeService extends Service {

  async searchHelp(searchItem) {
    const records = await this.ctx.model.TidbGene.aggregate([
      { $match: { "gene_symbol": { $regex: new RegExp(`^${searchItem}`), $options: "i" } } },
      { "$group": { "_id": "$gene_symbol", "doc": { "$first": "$$ROOT" } } },
      {
        '$addFields': {
          'gene_symbol': '$gene_symbol'
        }
      }, {
        '$replaceRoot': {
          'newRoot': '$doc'
        }
      },
      { "$limit": 10 }
    ]).exec();
    return records.map(item => {
      return {
        id: item._id,
        label: item.gene_symbol,
        value: item.gene_symbol
      }
    })
  }
  //gene 搜索
  async searchPaging({ geneSymbol }) {
    const queryConditions = geneSymbol.trim().split(",").map(item => {
      let temp = item.replace(/-/g, "-?");
      return new RegExp(`^${temp}$`, "i");
    })
    //step1 查询gene_annotation表Synonyms_list字段，获取到Name, 不区分大小写
    const geneAnnotationRecords = await this.ctx.model.GeneAnnotation.find({ "Synonyms_list": { $in: queryConditions } }, null, { lean: true }).exec();
    //step2 查询tidb_gene表gene_symbol 获取到gene_symbol， 不区分大小写
    const geneRecords = await this.ctx.model.TidbGene.find({ "gene_symbol": { $in: queryConditions } }, "gene_symbol", { lean: true }).exec();
    let queryGeneSymbols = [];
    geneAnnotationRecords.concat(geneRecords).forEach(item => {
      let geneSymbol = item["Name"] ? item["Name"] : item["gene_symbol"];
      if (!queryGeneSymbols.includes(geneSymbol)) {
        queryGeneSymbols.push(new RegExp(`^${geneSymbol}$`, "i"));
      }
    })
    const records = await this.ctx.model.TidbGene.aggregate([
      {
        '$match': {
          'gene_symbol': { $in: queryGeneSymbols }
        }
      }, {
        $group: {
          _id: {
            organism: "$organism",
            gene: "$gene_symbol",
            pmid: "$pmid",
            gene_id: "$gene_id"
          },
          countSent: {
            $sum: 1
          }
        }
      }, {
        $group: {
          _id: {
            organism: "$_id.organism",
            gene: "$_id.gene",
            gene_id: "$_id.gene_id"
          },
          countPmid: {
            $sum: 1
          }
        }
      }]).exec();
    //let { pmids, sents } = records[0]
    return records.map(item => {
      return {
        _id: item["_id"]["gene"],
        organism: item["_id"]["organism"],
        countPmid: item.countPmid,
        gene_id: item["_id"]["gene_id"],
        gene_name: item["_id"]["gene_name"]
      }
    })
  }

  async detailPaging(geneId) {
    //关联reference
    const records = await this.ctx.model.TidbGene.aggregate([
      [
        {
          '$match': {
            'gene_id': Number(geneId)
          }
        }, {
          '$lookup': {
            'from': 'abstract_annotation', 
            'localField': 'pmid', 
            'foreignField': 'pmid', 
            'as': 'refers'
          }
        }, {
          '$unwind': {
            'path': '$refers'
          }
        }
      ]
    ]);
    return records.map(item=>{
      if(item.sentence){
        delete item["sentence"]
      }
      let {pmid, sentence_pos} = item;
      let sentKey = `${pmid}_${sentence_pos}`
      item["sentence"] = item["refers"]["abstract"][sentKey];
      delete item["refers"];
      return item;
    })
  }
  /**
   * 查询数据库获取gene的ensembl信息
   * @param userGene
   * @returns {Promise<void>}
   */
  async getEnsembl(userGene) {
    const records = await this.ctx.model.GeneEnsembl.find({ ensembl: { $in: userGene.split(",") } }, "ensembl, gene_symbol", { lean: true }).exec();
    return records.map(item => item["ensembl"]).join(",");
  }

  async runReactome(userGene) {
    const userInputGene = userGene.replace(/,/g, "\n");
    /*const res = await axios.post("http://reactome.ncpsb.org/AnalysisService/identifiers/projection?interactors=false&pageSize=20&page=1",
      `#Genes\n${userInputGene}`,
      {headers: {'Content-Type': 'text/plain'}})
    return res.data.summary.token;*/
    return "MjAyMDA1MDcwNTM3MjJfNjIw";
  }

  async getSentence(pmid, sentence_pos) {
    let returnData = []
    const record = await this.ctx.model.AbstractAnnotation.findOne({
      'pmid': Number(pmid)
    }, null, { lean: true }).exec();
    for (let key in record["abstract"]) {
      returnData.push({
        id: key,
        sentence: record["abstract"][key]
      });
    }
    return returnData;
  }
  //用户校验基因句子
  async validateGeneSent({ gene_sent_id, result }) {
    //判断用户是否登录
    let email = this.ctx.session.email;
    if (email) {
      const model = this.ctx.model.ValidateGeneSent;
      const geneSentModel = this.ctx.model.TidbGene;
      //判断是否进行过操作
      let record = await model.findOne({ gene_sent_id }).exec();
      if (record) {
        //之前操作过
        if (result === record["result"]) {
          //之前和现在的选择一致
          return { status: 2 } //之前和现在的选择一致
        } else {
          if (result === "yes") {
            await geneSentModel.findByIdAndUpdate(gene_sent_id, { $inc: { "yes": 1, "no": -1 } })
          } else if (result === "no") {
            await geneSentModel.findByIdAndUpdate(gene_sent_id, { $inc: { "no": 1, "yes": -1 } })
          } else {
            return { status: 3 }//操作值非法
          }
          await model.findByIdAndUpdate(record._id, { result });
        }
      } else {
        //新增
        if (result === "yes") {
          await geneSentModel.findByIdAndUpdate(gene_sent_id, { $inc: { "yes": 1 } })
        } else if (result === "no") {
          await geneSentModel.findByIdAndUpdate(gene_sent_id, { $inc: { "no": 1 } })
        } else {
          return { status: 3 }//操作值非法
        }
        await model.create({ result, gene_sent_id, email });
      }
      return { status: 1 }//操作成功
    } else {
      return { status: -1 } //未登录
    }
  }
}

module.exports = HomeService
