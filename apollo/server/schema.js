const typeDefs = `
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }
  type User {
    username: String!
    favouriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
    username: String!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }
  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    addAuthors: Int
    addBooks: Int
    createUser(
      username: String!
      favouriteGenre: String
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`
module.exports = typeDefs
