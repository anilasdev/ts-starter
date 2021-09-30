let fs = require('fs'),
  path = require('path'),
  models: any = {},
  name: string

fs.readdirSync(__dirname)
  .filter((file: any) => {
    return file !== path.basename(__filename)
  })
  .forEach((file: any) => {
    name = path.parse(file).name
    models[name] = require(`./${name}`)
  })
export {}
module.exports = models
