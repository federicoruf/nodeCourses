const { buildSchema } = require('graphql');

//in the reolservers file, must be a method with this name
module.exports = buildSchema(`
type Post {
    _id: ID!
    title: String!
    content: String!
    imageUrl: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
}

type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
    status: String!
    posts: [Post!]!
}

type AuthData {
    token: String!
    userId: String!
}

type PostData {
    posts: [Post]!
    totalPosts: Int!
}

input UserInputData {
    email: String!
    name: String!
    password: String!
}
input PostinputData {
    title: String!
    content: String!
    imageUrl: String!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    posts(page: Int): PostData!
    post(id: ID!): Post!
    user: User!
}

type RootMutation {
    createUser(userInput: UserInputData): User!
    createPost(postInput: PostinputData): Post!
    updatePost(id: ID!, postInput: PostinputData): Post!
    deletePost(id: ID!): Boolean
    updateStatus(status: String): User! 
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

/*
DADO ESTE ESQUEMA:
type TestData {
        text: String!
        views: Int!
    }
    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }

DADO ESTE QUERY:
{
	"query":"{ hello { text views }}"
}
- SERÍA COMO UN GET
- ESTA INVOCANDO AL MÉTODO HELLO, Q A SU VER RETORNA DATOS TOMANDO EL FORMATO TESTDATA
- { text views } SON LOS DATOS Q ESPERO Q ME RETORNE
*/
