import React, {useEffect} from "react";
import {Form, Input, Modal} from "antd";
import PropTypes from "prop-types";

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 20},
};


const AppPopup = (props) => {
    const {show, handleOk, handleCancel, title, loading, formData} = props
    const [popupForm] = Form.useForm();

    useEffect(() => {
        popupForm.setFieldsValue(formData);
    }, [formData, popupForm])

    useEffect(() => {
        if (!show) {
            popupForm.resetFields()
        }
    }, [show])

    const onFinish = () => {
        popupForm.validateFields().then(handleOk)
    };
    return (<Modal forceRender title={title} visible={show} onOk={onFinish} onCancel={handleCancel}
                   confirmLoading={loading}>
        <Form
            {...layout}
            form={popupForm}
        >
            <Form.Item
                label="项目名称"
                name="name"
                rules={[{required: true, message: "Please input your username!"}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="项目描述"
                name="des"
                rules={[{required: true, message: "Please input your password!"}]}
            >
                <Input.TextArea/>
            </Form.Item>
        </Form>
    </Modal>)
}

AppPopup.propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool,
    handleOk: PropTypes.func,
    handleCancel: PropTypes.func,
    loading: PropTypes.bool,
    formData: PropTypes.object
}

AppPopup.defaultProps = {
    title: '',
    show: false,
    handleOk: () => {
    },
    handleCancel: () => {
    },
    loading: false,
    formData: {}
}

export default AppPopup;
