'use strict';
const { Readable } = require("stream")
const _ = require('lodash')
const Controller = require('egg').Controller;

class BrowseController extends Controller {
    async index() {
        const { ctx } = this;
        await ctx.render('Browse.pug')
    }
    //geneTerm
    async browsePaging() {
        const { ctx } = this;
        ctx.body = await this.service.browse.browsePaging(ctx.params)
    }

    async download() {
        const { ctx } = this;
        const { gene } = ctx.params;
        ctx.attachment(`${gene}.csv`);
        ctx.set('Content-Type', 'application/octet-stream');
        let fileContent = await this.service.browse.download(gene);
        ctx.body = Readable.from(fileContent);

    }
    async getGeneAnnotation() {
        const { ctx } = this;
        const { geneId } = ctx.params;
        let geneInfo = await ctx.model.GeneAnnotation.findOne({"Gene ID":Number(geneId)}, null, {lean:true}).exec();
        let geneName = geneInfo["Name"];
        delete geneInfo["_id"]
        delete geneInfo["Name"]
        delete geneInfo["Gene ID"]
        delete geneInfo["Synonyms_list"]
        for(let key in geneInfo) {
            let value = geneInfo[key];
            if(_.isObject(value)){
                geneInfo[key] = `<a href="${value.href}" target="_blank">${value.text}</a>`
            }
        }
        await ctx.render("Gene.pug", {geneName, geneInfo});
    }
}

module.exports = BrowseController;