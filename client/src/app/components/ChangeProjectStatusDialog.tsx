import React, { useState } from "react"

interface ChangeProjectDialogProps {
    open: boolean
    onClose: () => void
    onAdd: (projectId: any, projectStatus: number) => void
    status: number
}

export default function ChangeProjectStatusDialog({ open, onClose, onAdd, status }: ChangeProjectDialogProps) {
    const [projectId, setProjectId] = useState(null)
    const [projectStatus, setProjectStatus] = useState(0)

    const handleChangeProjectStatus = () => {
        onAdd(projectId, projectStatus)
        setProjectId(null)
        setProjectStatus(0)
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
                    {status === 0 ?
                        <h2 className="text-lg font-semibold mb-4">Do you want to start the project?</h2>
                        :
                        <h2 className="text-lg font-semibold mb-4">Do you want to complete the project?</h2>
                    }
                    <div className="text-right">
                        {status === 0 ?
                            <button
                                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleChangeProjectStatus}
                            >
                                Start
                            </button>
                            :
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleChangeProjectStatus}
                            >
                                Complete
                            </button>
                        }
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
