import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router'
import { NavLink } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useApolloClient, useMutation, useQuery } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, LOGI, ME } from './queries'
import Login from './components/Login'
import Recommend from './components/Recommend'

const App = () => {
  //const [page, setPage] = useState('authors')
  const [token, setToken] = useState('')
  const client = useApolloClient()

  const authorsQuery = useQuery(ALL_AUTHORS)
  const booksQuery = useQuery(ALL_BOOKS)

  useEffect(() => {
    const sessionToken = localStorage.getItem('userToken')
    if (sessionToken) {
      setToken(sessionToken)
    }
  }, [])

  if (authorsQuery.loading || booksQuery.loading) return <div>Loading..</div>

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  return (
    <>
      <div>
        <nav
          style={{
            boxSizing: 'content-box',
            display: 'inline-flex',
            fontSize: '1.5em',
            backgroundColor: '#D2D2D2',
            padding: '4px 2px',
            gap: '1em',
            borderRadius: '10px',
          }}
        >
          <NavLink
            to="/authors"
            style={({ isActive }) =>
              isActive
                ? {
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dashed',
                    opacity: '0.75',
                  }
                : undefined
            }
          >
            authors
          </NavLink>

          <NavLink
            to="/books"
            style={({ isActive }) =>
              isActive
                ? {
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dashed',
                    opacity: '0.75',
                  }
                : undefined
            }
          >
            books
          </NavLink>
          <NavLink
            to="/newbook"
            style={({ isActive }) =>
              isActive
                ? {
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dashed',
                    opacity: '0.75',
                  }
                : undefined
            }
          >
            add book
          </NavLink>
          <NavLink
            to="/recommend"
            style={({ isActive }) =>
              isActive
                ? {
                    textDecorationLine: 'underline',
                    textDecorationStyle: 'dashed',
                    opacity: '0.75',
                  }
                : undefined
            }
          >
            recommendation
          </NavLink>
          <div>
            {token && (
              <p
                style={{
                  display: 'inline',
                  marginLeft: '1em',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                }}
              >
                {localStorage.getItem('userInfo')} logged in{' '}
                <button onClick={logout}>log out</button>
              </p>
            )}
          </div>
        </nav>
      </div>
      <Routes>
        <Route path="/" element={<></>} />
        <Route
          path="/authors"
          element={<Authors authors={authorsQuery.data.allAuthors} />}
        />
        <Route
          path="/books"
          element={<Books books={booksQuery.data.allBooks} />}
        />
        <Route path="/newbook" element={<NewBook />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/recommend" element={<Recommend token={token} />} />
      </Routes>
    </>
  )
}

export default App
