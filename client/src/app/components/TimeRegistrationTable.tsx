import React, { useEffect, useState } from "react"
import { Table } from 'antd'
import { getAllTimesRegistered, registerTime } from "../api/projects"
import { Alert, Snackbar } from "@mui/material"
import TimeRegistrationDialog from "./TimeRegistrationDialog"

const columns = [
    {
        title: 'Registration Date',
        dataIndex: 'registrationTimestamp',
        key: 'registrationTimestamp',
        width: 200,
        render: (value: number) => {
            const date = new Date(value * 1000)
            return date.toLocaleDateString()
        },
    },
    {
        title: 'Time Spent (minutes)',
        dataIndex: 'timeMinutes',
        key: 'timeMinutes',
        width: 200
    }
]

export default function TimeRegistrationTable({ projectId, projectStatus }: any) {
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [listRegistrations, setListRegistrations] = useState([])

    useEffect(() => {
        const getListRegistrations = async (projectId: any) => {
            const registrations = (await getAllTimesRegistered(projectId))
                .map((reg: { id: any }) => {
                    return { ...reg, key: reg.id }
                })

            setListRegistrations(registrations)
        }

        getListRegistrations(projectId)
    }, [projectId])

    const handleOpenSnackbar = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    const handleRegisterTime = async (newTime: { timeMinutes: number }) => {
        try {
            await registerTime(projectId, newTime.timeMinutes)

            handleOpenSnackbar('Time registered successfully', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        catch (error: any) {
            handleOpenSnackbar(`Error registering time: ${error.response.data}`, 'error')
        }

        setIsDialogOpen(false)
    }

    return (
        <div>
            {projectStatus === 1 &&
                <button
                    className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                    onClick={() => setIsDialogOpen(true)}>
                    Register Time
                </button>
            }

            <div style={{ height: 300, overflowY: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={listRegistrations}
                    pagination={{
                        pageSizeOptions: ['5', '10', '15', '20'],
                        defaultPageSize: 5,
                        showSizeChanger: true,
                    }}
                />
            </div>

            <TimeRegistrationDialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onAdd={handleRegisterTime}
            />

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}>
                <Alert
                    elevation={6}
                    variant="filled"
                    severity={snackbarSeverity}
                    onClose={() => setOpenSnackbar(false)}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
