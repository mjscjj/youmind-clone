import Sidebar from './components/Sidebar/Sidebar'
import Board from './components/Board/Board'
import ChatPanel from './components/Chat/ChatPanel'
import { useBoardStore } from './lib/store'

function App() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId)

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f]">
      {/* Left Sidebar */}
      <Sidebar 
        selectedBoard={selectedBoardId || 'research'} 
        onSelectBoard={(id) => useBoardStore.getState().selectBoard(id)} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <Board boardId={selectedBoardId || 'research'} />
      </main>
      
      {/* Right Chat Panel */}
      <ChatPanel />
    </div>
  )
}

export default App
