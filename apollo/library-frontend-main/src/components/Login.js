import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LOGIN } from '../queries'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('errrorrrr')
      console.log(error.graphQLErrors[0].message)
    },
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      localStorage.setItem('userToken', token)
      localStorage.setItem('userInfo', result.data.login.username)
      navigate('/newbook')
      setToken(token)
    }
  }, [result.data])

  const loginHandler = async (e) => {
    e.preventDefault()
    login({ variables: { username, password } })
  }
  const loggedUser = localStorage.getItem('userInfo')

  return (
    <>
      <form onSubmit={loginHandler}>
        <div>
          <label htmlFor="username">username: </label>
          <input
            type="text"
            name="username"
            required
            minLength="3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">password: </label>
          <input
            type="password"
            name="password"
            required
            minLength="3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">log in</button>
      </form>
    </>
  )
}

export default Login
