'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    await ctx.render('Home.pug')
  }
  async searchHelp() {
    const { ctx } = this;
    const {term} = ctx.params;
    ctx.body = await ctx.service.home.searchHelp(term);
  }
  async search() {
    const { ctx } = this;
    const {geneSymbol} = ctx.params;
    await ctx.render('Search.pug', {
      geneSymbol:geneSymbol.replace(/(\r\n)|(\n)/g,",")
    })
  }
  //分页展示查询结果
  async searchPaging() {
    const { ctx } = this;
    ctx.body = await ctx.service.home.searchPaging(ctx.params);
  }

  async searchDetail() {
    const { ctx } = this;
    const {geneId} = ctx.params;
    await ctx.render('SearchDetail.pug', {
      geneId
    })
  }

  async detailPaging() {
    const { ctx } = this;
    const {geneId} = ctx.params;
    ctx.body = await ctx.service.home.detailPaging(geneId);
  }

  async getSentence() {
    const { ctx } = this;
    const {pmid, sentence_pos, gene_id} = ctx.params;
    ctx.body = await ctx.service.home.getSentence(pmid, sentence_pos, gene_id);
    //ctx.body = [{"id":"11156388_1","sentence":"Identification of an apoptotic cleavage product of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> as an <span class=\"match term0\">autoantigen<\/span>: a potential factor in the antitumoral response mediated by apoptotic bodies"},{"id":"11156388_10","sentence":"Thus, the highly immunogenic form of cleaved <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> could contribute to the antitumoral response mediated by apoptotic bodies"},{"id":"11156388_2","sentence":"We have shown previously that rats can be cured from induced peritoneal colon carcinomatosis by injections of apoptotic bodies derived from tumor cells and <span class=\"match term0\">interleukin<\/span> <span class=\"match term0\">2<\/span>"},{"id":"11156388_3","sentence":"This curative treatment generated a tumor-specific cytotoxic T-cell response associated with a humoral response."},{"id":"11156388_4","sentence":"<span class=\"match term0\">Autoantibodies<\/span> from sera of cured rats strongly recognized a Mr 67,000 protein from apoptotic bodies and weakly reacted with a protein of Mr approximately 97,000 in PROb parental cells"},{"id":"11156388_5","sentence":"We now show that these <span class=\"match term0\">autoantibodies<\/span> are directed against <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span>, originally identified as a protein interacting with the product of the <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span> gene <span class=\"match term0\">1<\/span>, <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>"},{"id":"11156388_6","sentence":"We demonstrate that the Mr 67,000 antigen is a cleaved form of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> present in apoptotic bodies derived from rat and human colon and <span class=\"match term0\">mammary<\/span> <span class=\"match term0\">carcinoma<\/span> cell lines"},{"id":"11156388_7","sentence":"Moreover, we show that the cleavage site of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> is located NH2 terminally but downstream of the RING domain essential for <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> and <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span> protein interaction"},{"id":"11156388_8","sentence":"In vitro studies using [35S]methionine-labeled human <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> and apoptotic cellular extracts derived from SW48 <span class=\"match term0\">carcinoma<\/span> cells indicate that <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> proteolysis occurs at an early stage of apoptosis and in a cell cycle-dependent manner"},{"id":"11156388_9","sentence":"This hydrolysis is inhibited by EGTA, and the <span class=\"match term0\">calpain<\/span> <span class=\"match term0\">inhibitor<\/span> I, N-acetyl-leu-leu-norleucinal, but not by several caspases <span class=\"match term0\">inhibitors<\/span>, suggesting that <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> is hydrolyzed by the calcium-dependent cysteine proteases, <span class=\"match term0\">calpains<\/span>"}];
  }

  async gene() {
    const { ctx } = this;
    const {docid} = ctx.params;
  }

  async validateGeneSent() {
    const { ctx } = this;
    ctx.body = await ctx.service.home.validateGeneSent(ctx.params)
  }
}

module.exports = HomeController;
