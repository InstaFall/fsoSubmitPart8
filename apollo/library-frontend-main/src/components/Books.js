import { useEffect, useState } from 'react'
import { BOOKS_BY_GENRE } from '../queries'
import { useLazyQuery } from '@apollo/client'

const Books = ({ books }) => {
  const [filter, setFilter] = useState('')
  const [callBooksByGenre, booksByGenre] = useLazyQuery(BOOKS_BY_GENRE)
  const bookGenres = books.map((el) => el.genres)
  const genres = []
  bookGenres.forEach((el) => {
    for (let i = 0; i < el.length; i++) {
      if (!genres.includes(el[i])) {
        genres.push(el[i])
      }
    }
  })
  // Filter with React
  /* const booksToList = filter
    ? books.filter((el) => el.genres.includes(filter))
    : books */

  // Filter with GraphQL Query: BOOKS_BY_GENRE
  useEffect(() => {
    callBooksByGenre({ variables: { genre: filter } })
  }, [filter])

  return (
    <div>
      <h2>books</h2>
      in genres: <b></b>
      <div>
        {genres.map((el) => (
          <button key={el} onClick={() => setFilter(el)}>
            {el}
          </button>
        ))}
        <button onClick={() => setFilter('')}>all</button>
      </div>
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
  )
}

export default Books
