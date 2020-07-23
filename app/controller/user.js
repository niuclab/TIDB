'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller{
    async login() {
        const {ctx} = this;
        ctx.body = await ctx.service.user.login(ctx.params);
    }

    async register() {
        const {ctx} = this;
        ctx.body = await ctx.service.user.register(ctx.params);
    } 
}
module.exports = UserController;