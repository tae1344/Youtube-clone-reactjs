// product 모드인지 dev 모드인지 분기처리해서 인식해준다.
if (process.env.NODE_ENV === 'production') {
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}