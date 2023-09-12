import React from "react"

interface DeleteProjectDialogProps {
    open: boolean
    onClose: () => void
    onAdd: () => void
}

export default function DeleteProjectDialog({ open, onClose, onAdd }: DeleteProjectDialogProps) {
    const handleDeleteProject = () => {
        onAdd()
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
                    <h2 className="text-lg font-semibold mb-4">Do you want to delete the selected projects?</h2>
                    <div className="text-right">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleDeleteProject}
                        >
                            Delete
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
