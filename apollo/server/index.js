const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => {
    console.log(err, err.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

/*
  you can remove the placeholder query once your first own has been implemented 
*/

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

const resolvers = {
  Query: {
    bookCount: async () => await Book.countDocuments({}),
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args) => {
      const booksInDb = await Book.find({}).populate('author')
      if (args.author) {
        const booksByAuthor = booksInDb.filter(
          (e) => e.author.name === args.author
        )
        return !args.genre
          ? booksByAuthor
          : booksByAuthor.filter((p) => p.genres.includes(args.genre))
      } else {
        return !args.genre
          ? booksInDb
          : booksInDb.filter((p) => p.genres.includes(args.genre))
      }
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      console.log(context)
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root) => {
      const booksByAuthor = await Book.find({}).populate('author', { name: 1 })
      return booksByAuthor.filter((e) => e.author.name === root.name).length
    },
    born: (root) => {
      return root.born
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('You need to login to access.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      const booksInDb = await Book.find({})
      if (booksInDb.map((e) => e.title).includes(args.title)) {
        throw new GraphQLError('Title already exists', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }
      if (args.title.length < 5 || args.author.length < 4) {
        throw new GraphQLError('Name is too short', {
          extensions: {
            code: 'GRAPHQL_VALIDATION_FAILED',
          },
        })
      }

      const allAuthors = await Author.find({})

      if (!allAuthors.map((p) => p.name).includes(args.author)) {
        const newAuthor = new Author({ name: args.author })
        try {
          await newAuthor.save()
          authors = authors.concat({ name: args.author })
        } catch (err) {
          console.log(err)
        }
      }

      const foundAuthor = allAuthors.find((el) => el.name === args.author)
      const newBook = new Book({
        ...args,
        author: foundAuthor._id,
        /* id: uuid(), */
      })
      try {
        await newBook.save()
        console.log('Book saved: ', newBook)
        books = books.concat(newBook)
      } catch (err) {
        throw new GraphQLError('Saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            err,
          },
        })
      }

      return newBook
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('You need to login to access.', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      const foundAuthor = await Author.findOne({ name: args.name })
      console.log(foundAuthor)
      if (!foundAuthor) return null
      foundAuthor.born = args.setBornTo
      const result = await foundAuthor.save()
      console.log('result: ', result)
      return result
    },
    addAuthors: async (root, args) => {
      for (const el of authors) {
        const authorToAdd = new Author({ ...el })
        await authorToAdd.save()
      }
      return authors.length
    },
    addBooks: async (root, args) => {
      for (const el of books) {
        const authorOfBook = await Author.findOne({ name: el.author })
        const bookToAdd = new Book({ ...el, author: authorOfBook._id })
        await bookToAdd.save()
      }
      return books.length
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'uncrackable') {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      const signed = jwt.sign(userForToken, process.env.JWT_SECRET)
      return { value: signed, username: user.username }
    },
    createUser: async (root, args) => {
      const newUser = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      })

      return newUser.save().catch((error) => {
        throw new GraphQLError('User creation failed.', {
          extension: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
