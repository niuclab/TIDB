'use strict';
const fs = require('fs')
const Controller = require('egg').Controller;

class AnalysisController extends Controller {
  async index() {
    const { ctx } = this;
    const {userSelectGene, analysisType} = ctx.params;
    if(analysisType === "reactome"){
      const token = await this.service.analysis.runReactome(userSelectGene);
      await ctx.render('Reactome.pug', {token, userSelectGene})
    }else if(analysisType === "go") {
      const token = await this.service.analysis.writeGoFile(userSelectGene);
      await ctx.render('GO.pug', {token, userSelectGene})
    }else if(analysisType === "PPI") {
      const token = await this.service.analysis.writePPIFile(userSelectGene);
      await ctx.render('PPI.pug', {token, userSelectGene})
    }
  }
  async reactome() {
    const { ctx } = this;
    const {userSelectGene} = ctx.params;
    const token = await this.service.analysis.runReactome(userSelectGene);
    await ctx.render('Reactome.pug', {token, userSelectGene})
  }
  async goAnalysis() {
    const { ctx } = this;
    ctx.body = await this.service.analysis.GOanalysis(ctx.params);
  }
  async redrawGoChart() {
    const { ctx } = this;
    ctx.body = await this.service.analysis.redrawGoChart(ctx.params);
  }
  async getImage() {
    const { ctx } = this;
    const {analysisType, flag} = ctx.params;
    let imageFilePath = "";
    if(analysisType === "go"){
      imageFilePath = `${this.config.programResult}/GO/${flag}/plot.png`
    }
    ctx.set('Content-Type', 'image/png');
		ctx.body = fs.createReadStream(imageFilePath);
  }
  async PPIAnalysis() {
    const { ctx } = this;
    ctx.body = await this.service.analysis.PPI(ctx.params);
  }
  async getPPIResult() {
    const { ctx } = this;
    ctx.body = await this.service.analysis.getPPIResult(ctx.params);
  }
  //检查任务状态
  async checkTaskStatus() {
    const { ctx } = this;
    let {taskType, flag} = ctx.params;
    let resultPath = `${this.config.programResult}/${taskType}/${flag}`;
    ctx.body = await this.service.utils.checkJob(resultPath);
  }
  async getFile() {
    const { ctx } = this;
    const {analysisType, flag} = ctx.params;
    let filePath = "";
    if(analysisType === "go"){
      filePath = `${this.config.programResult}/GO/${flag}/table.csv`
      ctx.attachment('GOresult.csv');
    } else if(analysisType === "PPI") {
      filePath = `${this.config.programResult}/PPI/${flag}/seed_based_subnetwork_edges.csv`
      ctx.attachment('Edgelist.csv');
    }
    ctx.set('Content-Type', 'application/octet-stream');
		ctx.body = fs.createReadStream(filePath);
  }
  //分页展示查询结果
  async searchPaging() {
    const { ctx } = this;
    const {order, limit, offset, geneSymbol, diseaseTerm} = ctx.params;
    ctx.body = [{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"None","diseasename":null,"sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050736","diseasename":"autosomal dominant disease","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050739","diseasename":"autosomal genetic disease","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:1612","diseasename":"breast cancer","sentnumber":"5","pubmednumber":"4"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:162","diseasename":"cancer","sentnumber":"5","pubmednumber":"4"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:305","diseasename":"carcinoma","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050687","diseasename":"cell type cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:170","diseasename":"endocrine gland cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:120","diseasename":"female reproductive organ cancer","sentnumber":"3","pubmednumber":"2"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:3119","diseasename":"gastrointestinal system cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:5683","diseasename":"hereditary breast ovarian cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:3571","diseasename":"liver cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:1324","diseasename":"lung cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:3856","diseasename":"male reproductive organ cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050177","diseasename":"monogenic disease","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050686","diseasename":"organ system cancer","sentnumber":"5","pubmednumber":"4"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:2394","diseasename":"ovarian cancer","sentnumber":"3","pubmednumber":"2"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:1793","diseasename":"pancreatic cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:10283","diseasename":"prostate cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:193","diseasename":"reproductive organ cancer","sentnumber":"3","pubmednumber":"2"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:0050615","diseasename":"respiratory system cancer","sentnumber":"1","pubmednumber":"1"},{"proteinname":"brca1","proteinid":"pro~pr:000004803","diseaseid":"do~doid:5093","diseasename":"thoracic cancer","sentnumber":"5","pubmednumber":"4"}];
  }

  async searchDetail() {
    const { ctx } = this;
    const {proteinId, proteinName} = ctx.params;
    await ctx.render('SearchDetail.pug', {
      proteinId, proteinName
    })
  }

  async detailPaging() {
    const { ctx } = this;
    const {proteinId, proteinName} = ctx.params;
    ctx.body = [{"sentid":"11156388_5","diseasename":"thoracic cancer","proteinname":"brca1","yes":"2","no":"0","sentence":"We now show that these <span class=\"match term0\">autoantibodies<\/span> are directed against <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span>, originally identified as a protein interacting with the product of the <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span> gene <span class=\"match term0\">1<\/span>, <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>","docid":"11156388"},{"sentid":"17347129_4","diseasename":"thoracic cancer","proteinname":"brca1","yes":"1","no":"0","sentence":"PATIENTS AND METHODS: Sera from normal controls (n = 94), <span class=\"match term0\">primary<\/span> <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span> patients (n = 97) and patients with ductal <span class=\"match term0\">carcinoma<\/span> in situ (DCIS) (n = 40) were investigated for the presence of <span class=\"match term0\">autoantibodies<\/span> to <span class=\"match term0\">p<\/span><span class=\"match term0\">53<\/span>, c-<span class=\"match term0\">myc<\/span>, <span class=\"match term0\">HER<\/span><span class=\"match term0\">2<\/span>, NY-ESO-<span class=\"match term0\">1<\/span>, <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>, <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">2<\/span> and <span class=\"match term0\">MUC<\/span><span class=\"match term0\">1<\/span> antigens by enzyme-linked immunosorbent assay","docid":"17347129"},{"sentid":"25865228_3","diseasename":"thoracic cancer","proteinname":"brca1","yes":"1","no":"0","sentence":"METHODS: Enzyme-Linked Immunosorbent Assay (ELISA) was used to detect <span class=\"match term0\">autoantibodies<\/span> to <span class=\"match term0\">PARP<\/span><span class=\"match term0\">1<\/span> and <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>\/<span class=\"match term0\">BRCA<\/span><span class=\"match term0\">2<\/span> in 618 serum samples including 131 from <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span>, 94 from <span class=\"match term0\">lung<\/span> <span class=\"match term0\">cancer<\/span>, 34 from <span class=\"match term0\">ovarian<\/span> <span class=\"match term0\">cancer<\/span>, 107 from <span class=\"match term0\">prostate<\/span> <span class=\"match term0\">cancer<\/span>, 76 from <span class=\"match term0\">liver<\/span> <span class=\"match term0\">cancer<\/span>, 41 from <span class=\"match term0\">pancreatic<\/span> <span class=\"match term0\">cancer<\/span> and 135 from normal individuals","docid":"25865228"},{"sentid":"25865228_8","diseasename":"thoracic cancer","proteinname":"brca1","yes":"1","no":"0","sentence":"This was significantly higher <span class=\"match term0\">autoantibody<\/span> responses to <span class=\"match term0\">PARP<\/span><span class=\"match term0\">1<\/span> and <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>\/<span class=\"match term0\">BRCA<\/span><span class=\"match term0\">2<\/span> (especially to <span class=\"match term0\">PARP<\/span><span class=\"match term0\">1<\/span> and <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>) in <span class=\"match term0\">ovarian<\/span> <span class=\"match term0\">cancer<\/span> and <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span> compared to normal control sera (P &lt; 0.001 and P &lt; 0.01","docid":"25865228"},{"sentid":"9032395_5","diseasename":"thoracic cancer","proteinname":"brca1","yes":"1","no":"0","sentence":"We used the 16-mer core sequences of the RRSs in the AAV ITRs and AAVS<span class=\"match term0\">1<\/span> separately as query sequences and identified 18 new RRSs in or flanking the genes coding for the following: tyrosine kinase activator <span class=\"match term0\">protein<\/span> <span class=\"match term0\">1<\/span> (TKA-<span class=\"match term0\">1<\/span>); <span class=\"match term0\">colony<\/span> <span class=\"match term0\">stimulating<\/span> <span class=\"match term0\">factor<\/span>-<span class=\"match term0\">1<\/span>; <span class=\"match term0\">insulin<\/span>-<span class=\"match term0\">like<\/span> <span class=\"match term0\">growth<\/span> <span class=\"match term0\">factor<\/span> <span class=\"match term0\">binding<\/span> <span class=\"match term0\">protein<\/span> <span class=\"match term0\">2<\/span> (<span class=\"match term0\">IGFBP<\/span>-<span class=\"match term0\">2<\/span>); histone H...<span class=\"match term0\">factor<\/span>; an endoplasmic reticulum-Golgi intermediate compartment resident <span class=\"match term0\">protein<\/span> called <span class=\"match term0\">p<\/span><span class=\"match term0\">63<\/span>; a global transcription activator (hSNF<span class=\"match term0\">2<\/span>L); the <span class=\"match term0\">beta<\/span>-<span class=\"match term0\">actin<\/span> repair domain; a retinoic acid-inducible <span class=\"match term0\">factor<\/span>, also known as midkine; a <span class=\"match term0\">breast<\/span> <span class=\"match term0\">tumor<\/span> autoantigen...a <span class=\"match term0\">growth<\/span>-arrest- and DNA-damage-inducible <span class=\"match term0\">protein<\/span> called gadd45; the <span class=\"match term0\">cyclin<\/span>-dependent kinase inhibitor called <span class=\"match term0\">KIP<\/span><span class=\"match term0\">2<\/span>, which inhibits several G<span class=\"match term0\">1<\/span> <span class=\"match term0\">cyclin<\/span>-<span class=\"match term0\">cyclin<\/span>-dependent kinase complexes; and the <span class=\"match term0\">hereditary<\/span> <span class=\"match term0\">breast<\/span> and <span class=\"match term0\">ovarian<\/span> <span class=\"match term0\">cancer<\/span> gene (<span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>","docid":"9032395"}]
  }

  async getSentence() {
    const { ctx } = this;
    const {docid} = ctx.params;
    ctx.body = [{"id":"11156388_1","sentence":"Identification of an apoptotic cleavage product of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> as an <span class=\"match term0\">autoantigen<\/span>: a potential factor in the antitumoral response mediated by apoptotic bodies"},{"id":"11156388_10","sentence":"Thus, the highly immunogenic form of cleaved <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> could contribute to the antitumoral response mediated by apoptotic bodies"},{"id":"11156388_2","sentence":"We have shown previously that rats can be cured from induced peritoneal colon carcinomatosis by injections of apoptotic bodies derived from tumor cells and <span class=\"match term0\">interleukin<\/span> <span class=\"match term0\">2<\/span>"},{"id":"11156388_3","sentence":"This curative treatment generated a tumor-specific cytotoxic T-cell response associated with a humoral response."},{"id":"11156388_4","sentence":"<span class=\"match term0\">Autoantibodies<\/span> from sera of cured rats strongly recognized a Mr 67,000 protein from apoptotic bodies and weakly reacted with a protein of Mr approximately 97,000 in PROb parental cells"},{"id":"11156388_5","sentence":"We now show that these <span class=\"match term0\">autoantibodies<\/span> are directed against <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span>, originally identified as a protein interacting with the product of the <span class=\"match term0\">breast<\/span> <span class=\"match term0\">cancer<\/span> gene <span class=\"match term0\">1<\/span>, <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span>"},{"id":"11156388_6","sentence":"We demonstrate that the Mr 67,000 antigen is a cleaved form of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> present in apoptotic bodies derived from rat and human colon and <span class=\"match term0\">mammary<\/span> <span class=\"match term0\">carcinoma<\/span> cell lines"},{"id":"11156388_7","sentence":"Moreover, we show that the cleavage site of <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> is located NH2 terminally but downstream of the RING domain essential for <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> and <span class=\"match term0\">BRCA<\/span><span class=\"match term0\">1<\/span> protein interaction"},{"id":"11156388_8","sentence":"In vitro studies using [35S]methionine-labeled human <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> and apoptotic cellular extracts derived from SW48 <span class=\"match term0\">carcinoma<\/span> cells indicate that <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> proteolysis occurs at an early stage of apoptosis and in a cell cycle-dependent manner"},{"id":"11156388_9","sentence":"This hydrolysis is inhibited by EGTA, and the <span class=\"match term0\">calpain<\/span> <span class=\"match term0\">inhibitor<\/span> I, N-acetyl-leu-leu-norleucinal, but not by several caspases <span class=\"match term0\">inhibitors<\/span>, suggesting that <span class=\"match term0\">BARD<\/span><span class=\"match term0\">1<\/span> is hydrolyzed by the calcium-dependent cysteine proteases, <span class=\"match term0\">calpains<\/span>"}];
  }

  async gene() {
    const { ctx } = this;
    const {docid} = ctx.params;
  }
}

module.exports = AnalysisController;
