import Sidebar from './components/Sidebar/Sidebar'
import Board from './components/Board/Board'
import ChatPanel from './components/Chat/ChatPanel'
import { SkillPicker } from './components/SkillPicker'
import { DeepResearchModal } from './components/DeepResearchModal'
import { useBoardStore } from './lib/store'

function App() {
  const selectedBoardId = useBoardStore((s) => s.selectedBoardId)

  return (
    <div className="flex h-screen w-full bg-[#0f0f0f] relative">
      {/* Left Sidebar */}
      <Sidebar 
        selectedBoard={selectedBoardId || '1'} 
        onSelectBoard={(id) => useBoardStore.getState().selectBoard(id)} 
      />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#1a1a1a] rounded-l-2xl border-l border-white/5 my-2 ml-2 shadow-2xl overflow-hidden relative z-0">
        <Board boardId={selectedBoardId || '1'} />
      </main>
      
      {/* Right Chat Panel */}
      <ChatPanel />

      {/* Overlays */}
      <SkillPicker />
      <DeepResearchModal />
    </div>
  )
}

export default App
