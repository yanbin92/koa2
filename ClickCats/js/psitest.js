const psi=require('psi')
var testurl="www.baidu.com"
psi(testurl).then(data => {
    console.log(data.ruleGroups.SPEED.score)
    console.log(data.pageStats)
})


psi.output(testurl).then(() => {
    console.log(done)
})


psi(testurl,{nokey:'true',strategy:'mobile'})
.then(data => {
    console.log('Speed score:',data.ruleGroups.SPEED.score);
    console.log('Usaility score',data.ruleGroups.USABILITY.score);
})