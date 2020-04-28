module.exports = {
    mongourl: "mongodb+srv://vijesh:12345@cluster0-4iysa.mongodb.net/test?retryWrites=true&w=majority",
    //mongourl: "vijesh:12345@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true",
    //mongourl: "mongodb:vijesh:12345@cluster0-shard-00-00-4iysa.mongodb.net:27017,cluster0-shard-00-01-4iysa.mongodb.net:27017,cluster0-shard-00-02-4iysa.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",
    domain: 'http://localhost:5000/',
    jwtheader: {
        alg: "HS512",
        typ: "JWT"
    },
    secretkey: '$vijesh$',
    passwordSecretKey: 'userapp'
}