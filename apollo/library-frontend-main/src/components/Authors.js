import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_AUTHORS, EDIT_BORN } from '../queries'

const Authors = (props) => {
  const authors = props.authors
  const [author, setAuthor] = useState(authors[0].name)
  const [birthyear, setBirthyear] = useState('')
  const [editAuthor] = useMutation(EDIT_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      console.log(error.graphQLErrors[0])
      const errors = error.graphQLErrors[0]
      const messages = Object.values(errors).join('\n')
      console.log(errors, messages)
    },
  })

  const submitBirthyear = (event) => {
    event.preventDefault()
    editAuthor({ variables: { name: author, born: parseInt(birthyear) } })
    setAuthor('')
    setBirthyear('')
  }

  if (!props.show) {
    return null
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submitBirthyear}>
        <select onChange={(e) => setAuthor(e.target.value)}>
          {authors.map((e) => (
            <option key={e.name} value={e.name}>
              {e.name}
            </option>
          ))}
        </select>
        <div>
          <label htmlFor="born">born</label>
          <input
            type="text"
            value={birthyear}
            onChange={(e) => setBirthyear(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default Authors
