module.exports = {
    mongourl: process.env.MONGOURL,
    domain: 'https://vijesh-my-wish-list.herokuapp.com/',
    jwtheader: {
        alg: "HS512",
        typ: "JWT"
    },
    secretkey: '$vijesh$',
    passwordSecretKey: 'userapp'
}