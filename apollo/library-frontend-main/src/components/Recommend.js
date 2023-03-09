import { useLazyQuery, useQuery } from '@apollo/client'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BOOKS_BY_GENRE, ME } from '../queries'

const Recommend = ({ token }) => {
  const [callBooksByGenre, booksByGenre] = useLazyQuery(BOOKS_BY_GENRE)
  const [favGenre, setFavGenre] = useState(null)
  const [skip, setSkip] = useState(!Boolean(localStorage.getItem('userInfo')))
  const { data, loading } = useQuery(ME, {
    skip,
    onError: (err) => console.log(err),
  })
  const location = useLocation()

  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      setSkip(false)
    }
    if (data && data.me) {
      setFavGenre(data.me.favouriteGenre)
      callBooksByGenre({ variables: { genre: favGenre } })
    }
  }, [data, favGenre])

  if (!localStorage.getItem('userToken')) {
    return (
      <Link to="/login" state={{ from: location }}>
        login
      </Link>
    )
  }

  if (loading || booksByGenre.loading) {
    return <>loading...</>
  }

  return (
    <div>
      <h4>
        books in your favourite genre:
        <span style={{ color: 'rgba(255,0,255,1)' }}> {favGenre}</span>
      </h4>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
          </thead>
          <tbody>
            {booksByGenre?.data?.allBooks.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Recommend
