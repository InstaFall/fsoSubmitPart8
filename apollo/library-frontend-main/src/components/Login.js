import { useApolloClient, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { LOGIN, ME } from '../queries'

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const client = useApolloClient()
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log('errrorrrr')
      console.log(error.graphQLErrors[0].message)
    },
    awaitRefetchQueries: true,
    refetchQueries: [{ query: ME }],
  })
  const location = useLocation()
  const navigate = useNavigate()
  const toRedirect = location.state?.from?.pathname || '/'
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      localStorage.setItem('userToken', token)
      localStorage.setItem('userInfo', result.data.login.username)
      setToken(token)
      client.resetStore()
      navigate(toRedirect)
    }
  }, [result.data])

  const loginHandler = async (e) => {
    e.preventDefault()
    await login({ variables: { username, password } })
  }

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
