const Sidebar = () => {
    return (
        <div className=" fixed inset-y-0 left-0 z-20 flex flex-col border-r border-slate-800/50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300  text-white w-64">
            <div className="flex items-center justify-between p-4 h-16 bg-gradient-to-r from-[#29beb3] via-slate-700 to-[#a96bde] border-b border-slate-600/50">
                <p>panel de control</p>
            </div>
        </div>
    )
}

export default Sidebar;