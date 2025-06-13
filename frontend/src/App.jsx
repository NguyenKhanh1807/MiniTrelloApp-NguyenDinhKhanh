import { Routes, Route } from 'react-router-dom'
import SignIn from './pages/signIn'
import Dashboard from './pages/dashboard'
import BoardDetail from './pages/BoardDetail';
import CardDetail from './pages/CardDetail';
import Profile from './pages/Profile';
import Invitations from './pages/Invitations';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import './App.css'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boards/:id" element={<BoardDetail />} />
        <Route path="/boards/:boardId/cards/:cardId" element={<CardDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/invitations" element={<Invitations />} />
      </Routes>
    </DndProvider>
  )
}

export default App