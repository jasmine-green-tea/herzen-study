import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.css"
import { ChakraProvider, defaultSystem  } from '@chakra-ui/react'

// const theme = extendTheme() // 👈 Можно добавить кастомные стили

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider value={defaultSystem }>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)