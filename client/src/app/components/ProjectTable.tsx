import React from "react"
import { Table } from 'antd'
import { Project } from "../../utils"
import TimeRegistrationTable from "./TimeRegistrationTable"

interface ProjectTableProps {
    listProjects: Project[]
}

const columns = [
    {
        title: 'Project Name',
        dataIndex: 'name',
        key: 'name',
        width: 200
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
        width: 200,
        render: (value: number) => {
            const statusMap = {
                0: 'New',
                1: 'In Progress',
                2: 'Completed',
            }
            return statusMap[value] || 'Unknown'
        }
    }
]

export default function ProjectTable({ listProjects }: ProjectTableProps) {

    const handleRowRender = (row: { id: any }) => {
        return (
            <TimeRegistrationTable projectId={row.id} />
        )
    }

    return (
        <div style={{ height: 400, width: '100%' }}>
            <Table
                columns={columns}
                dataSource={listProjects}
                pagination={{
                    pageSizeOptions: ['5', '10', '15', '20'],
                    defaultPageSize: 10,
                    showSizeChanger: true,
                }}
                expandable={{
                    expandedRowRender: handleRowRender
                }}
            />
        </div>
    )
}
