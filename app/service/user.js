const Service = require('egg').Service;

class UserService extends Service {
    async login({email, password}) {
        const userModel = this.ctx.model.User;
        let record = await userModel.findOne({email}).exec();
        if(record){
            let userPassword = record["password"];
            if(this.ctx.helper.bcompare(password, userPassword)){
                this.ctx.session.email = email;
                return {status: 1}
            }else {
                return {status: -1}
            }
        }else {
            return {status: -1}
        }
    }

    async register({email, password}) {
        const userModel = this.ctx.model.User;
        let record = await userModel.findOne({email}).exec();
        if(record){
            return {"status":-1}//邮箱已被注册 
        }else {
            let userPassword = this.ctx.helper.bhash(password);
            await userModel.create({email, password:userPassword})
            return {status:1};//注册成功
        }
    }

}
module.exports = UserService;