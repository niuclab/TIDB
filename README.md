# TIDB

## 数据库配置

### 下载MongoDB数据库

从 https://www.mongodb.com/try/download/community 下载相应的版本 一直按照默认选项安装。

### 导入数据

数据文件`TIDB_api/data/tidb.dump` 使用 mongorestore 导入数据

导入数据命令：`mongorestore --archive=TIDB_api/data/tidb.dump`

### 数据库可视化工具[可选]

可以使用 [compass](https://www.mongodb.com/try/download/compass) 对数据库进行查询修改，一般安装数据库时会询问是否安装compass，选择是就行

## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org

