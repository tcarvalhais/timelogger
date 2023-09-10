import React, { useEffect, useState } from "react"
import { Table } from 'antd'
import { getAllTimesRegistered } from "../api/projects"

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

export default function TimeRegistrationTable({ projectId }: any) {
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

    return (
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
    )
}
