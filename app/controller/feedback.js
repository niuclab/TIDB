'use strict';

const Controller = require('egg').Controller;

class FeedbackController extends Controller {
    async index() {
        const { ctx } = this;
        await ctx.render("feedback.pug")
    }

    async postData() {
        const { ctx } = this;
        const model = ctx.model.UserPost;
        let { GeneName, Organism, pmid, sentence, useremail } = ctx.params;
        await model.create({ GeneName, Organism, pmid, sentence, useremail })
        ctx.set('Content-Type', 'text/html');
        ctx.body = `<!doctype html><script>alert("Thanks, information has posted!");location.href="/tidb/feedback"</script>`;
    }
}
module.exports = FeedbackController;