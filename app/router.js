'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  const subRouter = app.router.namespace('/tidb');
  subRouter.get('/', controller.home.index);
  subRouter.get('/search/searchHelp', controller.home.searchHelp);//基因查询autocomplete
  subRouter.post('/search', controller.home.search);
  subRouter.get('/search/:searchType/:searchItem', controller.home.search);
  subRouter.get('/searchPaging', controller.home.searchPaging);
  subRouter.get('/searchDetail/:geneId', controller.home.searchDetail);
  subRouter.get('/detailPaging', controller.home.detailPaging);
  subRouter.get('/getSentence', controller.home.getSentence);
  subRouter.get('/gene', controller.home.gene);
  subRouter.get('/validateGeneSent', controller.home.validateGeneSent)
  subRouter.get('/getGeneAnnotation/:geneId', controller.browse.getGeneAnnotation);

  subRouter.post('/analysis', controller.analysis.index);
  subRouter.post('/reactome', controller.analysis.reactome);
  subRouter.get('/goAnalysis', controller.analysis.goAnalysis);
  subRouter.get("/redrawGoChart/:flag/:featuresNumber/:chartType", controller.analysis.redrawGoChart);
  subRouter.get("/getImage/:analysisType/:flag", controller.analysis.getImage)
  subRouter.get("/getFile/:analysisType/:flag", controller.analysis.getFile)
  subRouter.get("/PPIAnalysis", controller.analysis.PPIAnalysis)
  subRouter.get("/checkTaskStatus", controller.analysis.checkTaskStatus)
  subRouter.get("/getPPIResult", controller.analysis.getPPIResult)

  subRouter.get("/browse", controller.browse.index);
  subRouter.get("/browsePaging", controller.browse.browsePaging);
  subRouter.get("/geneDownload/:gene", controller.browse.download);

  subRouter.get("/login", controller.user.login);
  subRouter.get("/register", controller.user.register);

  subRouter.get('/feedback', controller.feedback.index)
  subRouter.post('/feedback', controller.feedback.postData)

  subRouter.get('/help', controller.help.index)
  io.of("/task_socket").route('submitTask', io.controller.task.submitTask);
};
