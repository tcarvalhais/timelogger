import React, { useState } from "react"

interface RegisterTimeDialogProps {
    open: boolean
    onClose: () => void
    onAdd: (newTime: { timeMinutes: number }) => void
}

export default function TimeRegistrationDialog({ open, onClose, onAdd }: RegisterTimeDialogProps) {
    const [timeMinutes, setTimeMinutes] = useState(0)

    const handleRegisterTime = () => {
        onAdd({ timeMinutes: timeMinutes })
        setTimeMinutes(0)
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
                    <h2 className="text-lg font-semibold mb-4">Register Time (minutes)</h2>
                    <div className="mb-4">
                        <input
                            type="number"
                            placeholder="Time Spent"
                            className="w-full border p-2 rounded"
                            value={timeMinutes}
                            onChange={(e) => setTimeMinutes(parseInt(e.target.value))}
                        />
                    </div>
                    <div className="text-right">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={handleRegisterTime}
                        >
                            Register
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
