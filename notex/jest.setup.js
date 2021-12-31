// The below can be used in a Jest global setup file or similar for your testing set-up
const x = require('@next/env');

module.export = async () => {
  const projectDir = process.cwd()
  console.log(projectDir);
  x.loadEnvConfig(projectDir)
}