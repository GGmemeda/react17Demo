import React, {useState} from "react";
import {Button, Form, Input, Table, Modal} from "antd";
import {getTableData, addProjects, getProjectsById, deleteProjects} from "./api/appAPi";
import AppPopup from "./AppPopup";
import "./App.scss"
import {
    FormOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from "@ant-design/icons";

import {useAntdTable, useRequest} from "ahooks";

const {confirm} = Modal;

const columns = (onEdit, onDelete) => [
    {
        title: "项目名称",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "描述",
        dataIndex: "des",
        key: "des",
    },
    {
        title: "操作",
        key: "operation",
        fixed: "right",
        width: 130,
        render: (text, record) => (<div className="table-page__operate">
            <Button type="text" onClick={() => onEdit(record.id)}
                    className="table-page__operate--edit"><FormOutlined/></Button>
            <Button type="text" onClick={() => onDelete(record.id)}
                    className="table-page__operate--delete"><DeleteOutlined/></Button>
        </div>),
    },
];


const TablePage = () => {
    const [formRef] = Form.useForm();

    const [show, setShow] = useState(false);

    const {tableProps, search, refresh} = useAntdTable(getTableData, {
        defaultPageSize: 5,
        form: formRef,
    });
    const {submit} = search;

    const {loading, run} = useRequest(addProjects, {
        manual: true,
        onSuccess: () => {
            submit();
            onHandleCancel();
        },
    });

    const {run: getDetail, data: formData, mutate} = useRequest(getProjectsById, {
        manual: true,
        onSuccess: () => {
            setShow(true);
        },
    });

    const {run: runDelete} = useRequest(deleteProjects, {
        manual: true,
        onSuccess: submit,
    });
    const onShowModel = () => {
        setShow(true)
    }
    const onHandleOk = (values) => {
        if (formData?.data?.id) {
            run(values, formData?.data?.id);
        } else {
            run(values);
        }
    }
    const onHandleCancel = () => {
        setShow(false);
        mutate({});
    }

    const onDelete = (id) => {
        setShow(false);
        confirm({
            title: "确认删除这条信息吗",
            icon: <ExclamationCircleOutlined/>,
            content: "删除后不可恢复，请谨慎操作！",
            onOk() {
                runDelete(id)
            }
        });
    }

    const onEdit = (id)=>{
        setShow(true);
        getDetail(id)
    }


    const searchForm = (
        <div className="table-page__search">
            <div className="table-page__search__group">
                <Button type="primary" onClick={onShowModel}>新增</Button>
                <Button onClick={refresh}>刷新</Button>
            </div>
            <Form form={formRef}>
                <div>项目名称</div>
                <Form.Item name="name">
                    <Input.Search placeholder="enter name" className='table-page__search__input' onSearch={submit}/>
                </Form.Item>
            </Form>
        </div>
    );
    return (
        <div className="table-page">
            {searchForm}
            <Table rowKey="id" columns={columns(onEdit, onDelete)} scroll={{x: 1500, y: 300}}  {...tableProps} />
            <AppPopup formData={formData?.data}
                      show={show}
                      title={formData?.data?.id ? "编辑项目" : "创建项目"}
                      handleOk={onHandleOk}
                      handleCancel={onHandleCancel} loading={loading}/>
        </div>
    );
};

export default TablePage;
