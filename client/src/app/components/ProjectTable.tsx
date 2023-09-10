import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid'
import { getProjects, getTotalTimeRegistered } from "../api/projects";

interface Project {
    id: any,
    name: String,
    creationDateTimestamp: number,
    deadlineDateTimestamp: number,
    projectStatus: number,
    timeSpent: number
}

const columns = [
    {
        field: 'name',
        headerName: 'Project Name',
        width: 300
    },
    {
        field: 'creationDateTimestamp',
        headerName: 'Creation Date',
        width: 200,
        type: 'date',
        valueFormatter: (params: { value: number }) => {
            const date = new Date(params.value * 1000)
            return date.toLocaleDateString()
        },
    },
    {
        field: 'deadlineDateTimestamp',
        headerName: 'Deadline Date',
        width: 200,
        type: 'date',
        valueFormatter: (params: { value: number }) => {
            const date = new Date(params.value * 1000)
            return date.toLocaleDateString()
        },
    },
    {
        field: 'timeSpent',
        headerName: 'Time Spent (mins)',
        width: 200
    },
    {
        field: 'projectStatus',
        headerName: 'Status',
        width: 200,
        valueFormatter: (params: { value: number }) => {
            const statusMap = {
                0: 'New',
                1: 'In Progress',
                2: 'Completed',
            }
            return statusMap[params.value] || 'Unknown'
        }
    }
]

export default function ProjectTable() {
    const [listProjects, setListProjects] = useState<Project[]>([])

    useEffect(() => {
        const getListProjects = async () => {
            const projects = await getProjects()
            const projectsWithTotalTime = await Promise.all(
                projects.map(async (project: { id: any }) => {
                    const timeSpent = await getTotalTimeRegistered(project.id)
                    return { ...project, timeSpent: timeSpent }
                })
            )

            setListProjects(projectsWithTotalTime)
        }

        getListProjects()
    }, [])

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={listProjects}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            page: 0,
                            pageSize: 5
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 15, 20]}
                checkboxSelection
            />
        </div>
    );
}
