import { useState } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Board from './components/Board/Board'
import ChatPanel from './components/Chat/ChatPanel'

function App() {
  const [selectedBoard, setSelectedBoard] = useState<string>('深度研究')

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f]">
      {/* Left Sidebar */}
      <Sidebar 
        selectedBoard={selectedBoard} 
        onSelectBoard={setSelectedBoard} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Board boardName={selectedBoard} />
      </main>
      
      {/* Right Chat Panel */}
      <ChatPanel />
    </div>
  )
}

export default App
