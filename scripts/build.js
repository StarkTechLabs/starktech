const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')

const walkSync = function (dir, filelist = []) {
  fs.readdirSync(dir).forEach(function (file) {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file))
  })
  return filelist
}

const DEST = './build'
const files = [
  'index.html',
  ...walkSync('./src'),
  ...walkSync('./public')
]

rimraf.sync(DEST)
fs.mkdirSync(DEST)

for (const file of files) {
  const dest = path.join(DEST, file)
  const dir = path.dirname(dest)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  fs.copyFileSync(file, dest)
}
