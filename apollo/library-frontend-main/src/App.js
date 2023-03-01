import { useState } from 'react'
import { Route, Routes } from 'react-router'
import { Link } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, LOGIN } from './queries'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN)
  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  if (authorsQuery.loading || booksQuery.loading) return <div>Loading..</div>

  //console.log(authorsQuery.data)
  return (
    <>
      <div>
        <Link to="/authors">
          <button onClick={() => setPage('authors')}>authors</button>
        </Link>
        <Link to="/books">
          <button onClick={() => setPage('books')}>books</button>
        </Link>
        <Link to="/newbook">
          <button onClick={() => setPage('add')}>add book</button>
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<></>} />
        <Route
          path="/authors"
          element={
            <Authors
              authors={authorsQuery.data.allAuthors}
              show={page === 'authors'}
            />
          }
        />
        <Route
          path="/books"
          element={
            <Books books={booksQuery.data.allBooks} show={page === 'books'} />
          }
        />
        <Route path="/newbook" element={<NewBook show={page === 'add'} />} />
      </Routes>
    </>
  )
}

export default App
