import { useState } from 'react'

const Books = ({ books }) => {
  const [filter, setFilter] = useState('')

  const bookGenres = books.map((el) => el.genres)
  const genres = []
  bookGenres.forEach((el) => {
    for (let i = 0; i < el.length; i++) {
      if (!genres.includes(el[i])) {
        genres.push(el[i])
      }
    }
  })

  const booksToList = filter
    ? books.filter((el) => el.genres.includes(filter))
    : books
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
          {booksToList.map((a) => (
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
