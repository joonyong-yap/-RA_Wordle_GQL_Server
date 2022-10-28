const {ApolloServer, gql} = require("apollo-server");
const https = require("https");
const fs = require("fs");


const textURL = "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt";

const typeDefs = gql`
    type Query
    {
        validWord (word : String!) : Boolean,
        providedWords : ProvidedWords!
    }
    type ProvidedWords
    {
        id : Int!,
        name : String!
    }
`
const resolvers = {
    Query : {
        validWord : (parent, {word}, context) =>{
            if(wordList.includes(word.toLowerCase()))
            {
                return true;
            }
            return false;
        },
        providedWords : () =>{
            let num = Math.floor(Math.random() * wordList.length);
            let str = String(wordList[num]).toUpperCase();
            return {
                id : num,
                name : str
            };
        }
    }
}

async function ReadLoadWordCSV(){
    let promise = new Promise((resolve, reject) => {
        let data = '';
        let arr = [];
        https.get(textURL, res => {
            res.on('data', chunk => { data += chunk })
            res.on('end', () => {
                arr = data.split('\n');
                resolve(arr);
            })
        })
    });

    wordList = await promise;
    console.log("server reading  " + textURL);
    return;
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

wordList = [];

ReadLoadWordCSV();

server.listen().then(({url}) => {
    console.log("server started at " + url);
});