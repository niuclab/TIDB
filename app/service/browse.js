const stringify = require('csv-stringify/lib/sync')
const Service = require('egg').Service;

class BrowseService extends Service {
    async browsePaging({geneTerm, limit, offset}) {
        let reg = new RegExp(`^${geneTerm}`, "i");
        return await this.ctx.model.TidbGene.aggregate([
            {
              '$match': {
                'gene_symbol': {
                  '$regex': reg
                }
              }
            }, {
                '$project': {
                  'gene_symbol': 1,
                  'organism': 1,
                  "gene_id":1
                }
              }, {
                '$group': {
                  "_id": {
                    "gene_symbol":"$gene_symbol",
                    "organism":"$organism"
                  },
                  'doc': {
                    '$first': '$$ROOT'
                  }
                }
              }, {
                '$replaceRoot': {
                  'newRoot': '$doc'
                }
              }, {
                '$sort':{"gene_symbol":1},
              }
        ]).collation({ locale: 'en_US' }).exec();
    }
    async download(gene) {
        let records = await this.ctx.model.TidbGene.find({"gene_symbol":gene},null, {lean:true}).sort({pmid:1, sentence_pos:1}).exec();
        let tempRecords = records.map(item=>{
            return {
              "Gene name": item["gene_name"],
                "Gene Symbol": item["gene_symbol"],
                "Organism": item["organism"],
                "PubMed ID": item["pmid"],
                "Sentence": item["sentence"],
            }
        })
        return stringify(tempRecords,{header: true});
    }
}

module.exports = BrowseService;