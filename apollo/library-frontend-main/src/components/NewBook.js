import { useApolloClient, useMutation } from '@apollo/client'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ALL_AUTHORS, ALL_BOOKS, BOOKS_BY_GENRE, CREATE_BOOK } from '../queries'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const client = useApolloClient()

  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      { query: ALL_BOOKS },
      { query: ALL_AUTHORS },
      { query: BOOKS_BY_GENRE, variables: { genre } },
    ],
    awaitRefetchQueries: true,
    onError: (error) => {
      const { graphQLErrors, networkError } = error
      if (networkError) console.log(networkError.result)
      if (graphQLErrors) console.log(graphQLErrors)
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        )
    },
  })
  const location = useLocation()
  if (!localStorage.getItem('userToken')) {
    return (
      <>
        <Link to="/login" state={{ from: location }}>
          login
        </Link>
      </>
    )
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('add book...')
    addBook({
      variables: { title, author, published: parseInt(published), genres },
    })
    client.resetStore()
    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook
