import React, { useState } from "react"
import { Badge, Table } from 'antd'
import { Project } from "../../utils"
import TimeRegistrationTable from "./TimeRegistrationTable"
import { Alert, Snackbar } from "@mui/material"
import DeleteProjectDialog from "./DeleteProjectDialog"
import { changeProjectStatus, deleteProject } from "../api/projects"
import ChangeProjectStatusDialog from "./ChangeProjectStatusDialog"

interface ProjectTableProps {
    listProjects: Project[]
}

export default function ProjectTable({ listProjects }: ProjectTableProps) {
    const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([])
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
    const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('success')
    const [isDeleteProjectDialogOpen, setIsDeleteProjectDialogOpen] = useState(false)
    const [clickedRowId, setClickedRowId] = useState<any | null>(null)

    const handleRowRender = (row: { id: any, projectStatus: number }) => {
        return (
            <TimeRegistrationTable projectId={row.id} projectStatus={row.projectStatus} />
        )
    }

    const handleOpenSnackbar = (message: string, severity: 'error' | 'warning' | 'info' | 'success') => {
        setSnackbarMessage(message)
        setSnackbarSeverity(severity)
        setOpenSnackbar(true)
    }

    const handleDeleteProject = async () => {
        try {
            selectedRowKeys.forEach(async (projectId) => {
                await deleteProject(projectId)
            })

            handleOpenSnackbar('Project(s) deleted successfully', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        catch (error: any) {
            handleOpenSnackbar(`Error while deleting project(s): ${error.response.data}`, 'error')
        }

        setIsDeleteProjectDialogOpen(false)
    }

    const handleChangeProjectStatus = async (projectId: any, projectStatus: number) => {
        try {
            await changeProjectStatus(projectId, projectStatus)

            handleOpenSnackbar('Project status changed successfully', 'success')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        }
        catch (error: any) {
            handleOpenSnackbar(`Error while changing project status: ${error.response.data}`, 'error')
        }

        setClickedRowId(null)
    }

    const onSelectChange = (selectedKeys: any[]) => {
        setSelectedRowKeys(selectedKeys)
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    }

    const columns = [
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
            width: 300
        },
        {
            title: 'Creation Date',
            dataIndex: 'creationDateTimestamp',
            key: 'creationDateTimestamp',
            width: 200,
            render: (value: number) => {
                const date = new Date(value * 1000)
                return date.toLocaleDateString()
            },
        },
        {
            title: 'Deadline Date',
            dataIndex: 'deadlineDateTimestamp',
            key: 'deadlineDateTimestamp',
            width: 200,
            render: (value: number) => {
                const date = new Date(value * 1000)
                return date.toLocaleDateString()
            },
        },
        {
            title: 'Time Spent (minutes)',
            dataIndex: 'timeSpent',
            key: 'timeSpent',
            width: 200
        },
        {
            title: 'Status',
            dataIndex: 'projectStatus',
            key: 'projectStatus',
            width: 150,
            render: (value: number) => {
                const statusMap = {
                    0: 'New',
                    1: 'In Progress',
                    2: 'Completed',
                }

                const statusText = statusMap[value] || 'Unknown'
                let badge

                switch (value) {
                    case 0:
                        badge = <Badge status='default' text={statusText} />
                        break
                    case 1:
                        badge = <Badge color='purple' text={statusText} />
                        break
                    case 2:
                        badge = <Badge status='success' text={statusText} />
                        break
                    default:
                        badge = <Badge status='default' text={statusText} />
                        break
                }

                return (
                    <div>
                        {badge}
                    </div>
                )
            }
        },
        {
            title: '',
            dataIndex: 'id',
            key: 'options',
            width: 300,
            render: (id: any, row: Project) => {
                return (
                    <div>
                        {row.projectStatus == 0 ?
                            <div className="w-1/2">
                                <button
                                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-1 px-1 rounded text-xs"
                                    onClick={() => setClickedRowId(id)}>
                                    Start Project
                                </button>
                            </div>
                            :
                            <div>
                                {row.projectStatus == 1 ?
                                    <div className="w-1/2">
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-1 rounded text-xs"
                                            onClick={() => setClickedRowId(id)}>
                                            Complete Project
                                        </button>
                                    </div>
                                    :
                                    <></>
                                }
                            </div>
                        }

                        {clickedRowId && clickedRowId === id && (
                            <ChangeProjectStatusDialog
                                open={true}
                                onClose={() => setClickedRowId(null)}
                                onAdd={() => handleChangeProjectStatus(id, row.projectStatus)}
                                status={row.projectStatus}
                            />
                        )}
                    </div>
                )
            }
        }
    ]

    return (
        <div>
            <div style={{ height: 400, width: '100%' }}>
                <Table
                    columns={columns}
                    dataSource={listProjects}
                    rowSelection={rowSelection}
                    pagination={{
                        pageSizeOptions: ['5', '10', '15', '20'],
                        defaultPageSize: 10,
                        showSizeChanger: true,
                    }}
                    expandable={{
                        expandedRowRender: handleRowRender
                    }}
                />
                {selectedRowKeys.length > 0 ?
                    <div className="w-1/2">
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                            onClick={() => setIsDeleteProjectDialogOpen(true)}>
                            Delete Project
                        </button>
                    </div>
                    :
                    <></>
                }
            </div>

            <DeleteProjectDialog
                open={isDeleteProjectDialogOpen}
                onClose={() => setIsDeleteProjectDialogOpen(false)}
                onAdd={handleDeleteProject}
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
