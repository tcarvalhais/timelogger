import React, { useState } from "react"

interface AddProjectDialogProps {
    open: boolean
    onClose: () => void
    onAdd: (newProject: { name: string; deadlineDate: string }) => void
}

export default function AddProjectDialog({ open, onClose, onAdd }: AddProjectDialogProps) {

    const [projectName, setProjectName] = useState("")
    const [deadlineDate, setDeadlineDate] = useState("")

    const handleAddProject = () => {
        const deadlineDateTimestamp = Math.floor(new Date(deadlineDate).getTime() / 1000).toString()
        onAdd({ name: projectName, deadlineDate: deadlineDateTimestamp })

        setProjectName("")
        setDeadlineDate("")

        onClose()
    }

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
            )}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="bg-white rounded-lg p-4 shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Add New Project</h2>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Project Name"
                            className="w-full border p-2 rounded"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <div className="flex flex-col">
                            <label htmlFor="deadlineDate" className="mb-1">
                                Deadline Date
                            </label>
                            <input
                                type="date"
                                id="deadlineDate"
                                className="w-full border p-2 rounded"
                                value={deadlineDate}
                                onChange={(e) => setDeadlineDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleAddProject}
                        >
                            Add
                        </button>
                        <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 ml-2 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
