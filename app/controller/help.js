'use strict';

const Controller = require('egg').Controller;

class helpController extends Controller{
    async index() {
        const {ctx} = this;
        await ctx.render("FAQ.pug")
    }
}
module.exports = helpController;